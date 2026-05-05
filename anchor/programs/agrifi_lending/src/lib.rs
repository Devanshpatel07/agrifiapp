// AgriFi Lending – Solana Anchor program
// Micro-loans for Indian farmers, funded by a community lender pool in USDC.
//
// Accounts:
//   - Pool      : global liquidity pool (one per mint, e.g. Devnet USDC)
//   - Farmer    : on-chain profile + credit score
//   - Loan      : individual loan request / active loan
//
// Flow:
//   1. `initialize_pool`          – admin creates the USDC pool + vault
//   2. `register_farmer`          – farmer signs up, score starts at 500
//   3. `lender_deposit`           – any wallet deposits USDC into the pool
//   4. `request_loan`             – farmer requests `amount` for `term_days`
//   5. `approve_loan`             – pool authority approves & transfers USDC
//   6. `repay_loan`               – farmer repays principal + interest;
//                                   credit score adjusts based on on-time status

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("AgriFiLEnDinG1111111111111111111111111111111");

// --- constants ---------------------------------------------------------------
const SECONDS_PER_DAY: i64 = 86_400;
const BPS_DENOM: u64 = 10_000;
const MAX_LOAN_AMOUNT: u64 = 500_000_000; // 500 USDC (6 decimals)
const MIN_SCORE_FOR_LOAN: u16 = 400;
const STARTING_SCORE: u16 = 500;

#[program]
pub mod agrifi_lending {
    use super::*;

    // ---------- pool ---------------------------------------------------------
    pub fn initialize_pool(ctx: Context<InitializePool>, interest_bps: u16) -> Result<()> {
        require!(interest_bps <= 5_000, AgriErr::InterestTooHigh); // <= 50%
        let pool = &mut ctx.accounts.pool;
        pool.authority = ctx.accounts.authority.key();
        pool.mint = ctx.accounts.mint.key();
        pool.vault = ctx.accounts.vault.key();
        pool.interest_bps = interest_bps;
        pool.total_deposits = 0;
        pool.total_borrowed = 0;
        pool.bump = ctx.bumps.pool;
        Ok(())
    }

    pub fn lender_deposit(ctx: Context<LenderDeposit>, amount: u64) -> Result<()> {
        require!(amount > 0, AgriErr::ZeroAmount);

        let cpi = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.lender_ata.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
                authority: ctx.accounts.lender.to_account_info(),
            },
        );
        token::transfer(cpi, amount)?;

        ctx.accounts.pool.total_deposits = ctx
            .accounts
            .pool
            .total_deposits
            .checked_add(amount)
            .ok_or(AgriErr::MathOverflow)?;
        Ok(())
    }

    // ---------- farmer -------------------------------------------------------
    pub fn register_farmer(ctx: Context<RegisterFarmer>, name: String, region: String) -> Result<()> {
        require!(name.len() <= 64, AgriErr::StringTooLong);
        require!(region.len() <= 64, AgriErr::StringTooLong);

        let farmer = &mut ctx.accounts.farmer;
        farmer.owner = ctx.accounts.owner.key();
        farmer.name = name;
        farmer.region = region;
        farmer.credit_score = STARTING_SCORE;
        farmer.loans_taken = 0;
        farmer.loans_repaid = 0;
        farmer.bump = ctx.bumps.farmer;
        Ok(())
    }

    // ---------- loan lifecycle ----------------------------------------------
    pub fn request_loan(ctx: Context<RequestLoan>, amount: u64, term_days: u16) -> Result<()> {
        require!(amount > 0 && amount <= MAX_LOAN_AMOUNT, AgriErr::InvalidAmount);
        require!(term_days > 0 && term_days <= 365, AgriErr::InvalidTerm);
        require!(
            ctx.accounts.farmer.credit_score >= MIN_SCORE_FOR_LOAN,
            AgriErr::CreditScoreTooLow
        );

        let loan = &mut ctx.accounts.loan;
        loan.farmer = ctx.accounts.farmer.key();
        loan.borrower = ctx.accounts.owner.key();
        loan.pool = ctx.accounts.pool.key();
        loan.principal = amount;
        loan.interest_bps = ctx.accounts.pool.interest_bps;
        loan.term_days = term_days;
        loan.status = LoanStatus::Requested;
        loan.requested_at = Clock::get()?.unix_timestamp;
        loan.disbursed_at = 0;
        loan.due_at = 0;
        loan.repaid_amount = 0;
        loan.bump = ctx.bumps.loan;
        Ok(())
    }

    pub fn approve_loan(ctx: Context<ApproveLoan>) -> Result<()> {
        let loan = &mut ctx.accounts.loan;
        require!(loan.status == LoanStatus::Requested, AgriErr::InvalidLoanState);

        let pool = &mut ctx.accounts.pool;
        let available = pool
            .total_deposits
            .checked_sub(pool.total_borrowed)
            .ok_or(AgriErr::MathOverflow)?;
        require!(available >= loan.principal, AgriErr::InsufficientLiquidity);

        // PDA-signed transfer from vault -> borrower
        let mint_key = pool.mint;
        let seeds = &[b"pool".as_ref(), mint_key.as_ref(), &[pool.bump]];
        let signer = &[&seeds[..]];

        let cpi = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.borrower_ata.to_account_info(),
                authority: pool.to_account_info(),
            },
            signer,
        );
        token::transfer(cpi, loan.principal)?;

        let now = Clock::get()?.unix_timestamp;
        loan.status = LoanStatus::Active;
        loan.disbursed_at = now;
        loan.due_at = now + (loan.term_days as i64) * SECONDS_PER_DAY;

        pool.total_borrowed = pool
            .total_borrowed
            .checked_add(loan.principal)
            .ok_or(AgriErr::MathOverflow)?;

        let farmer = &mut ctx.accounts.farmer;
        farmer.loans_taken = farmer.loans_taken.checked_add(1).ok_or(AgriErr::MathOverflow)?;
        Ok(())
    }

    pub fn repay_loan(ctx: Context<RepayLoan>) -> Result<()> {
        let loan = &mut ctx.accounts.loan;
        require!(loan.status == LoanStatus::Active, AgriErr::InvalidLoanState);

        let interest = (loan.principal as u128)
            .checked_mul(loan.interest_bps as u128)
            .and_then(|v| v.checked_div(BPS_DENOM as u128))
            .ok_or(AgriErr::MathOverflow)? as u64;
        let total_due = loan.principal.checked_add(interest).ok_or(AgriErr::MathOverflow)?;

        let cpi = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.borrower_ata.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
                authority: ctx.accounts.owner.to_account_info(),
            },
        );
        token::transfer(cpi, total_due)?;

        let now = Clock::get()?.unix_timestamp;
        let on_time = now <= loan.due_at;

        loan.repaid_amount = total_due;
        loan.status = LoanStatus::Repaid;

        let pool = &mut ctx.accounts.pool;
        pool.total_borrowed = pool.total_borrowed.saturating_sub(loan.principal);
        pool.total_deposits = pool
            .total_deposits
            .checked_add(interest)
            .ok_or(AgriErr::MathOverflow)?;

        let farmer = &mut ctx.accounts.farmer;
        farmer.loans_repaid = farmer.loans_repaid.checked_add(1).ok_or(AgriErr::MathOverflow)?;
        // simple credit score adjustment
        let new_score = if on_time {
            (farmer.credit_score as i32 + 25).min(900)
        } else {
            (farmer.credit_score as i32 - 50).max(0)
        };
        farmer.credit_score = new_score as u16;
        Ok(())
    }
}

// --- accounts ---------------------------------------------------------------

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Pool::SIZE,
        seeds = [b"pool", mint.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, Pool>,

    pub mint: Account<'info, Mint>,

    #[account(
        init,
        payer = authority,
        token::mint = mint,
        token::authority = pool,
        seeds = [b"vault", mint.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct LenderDeposit<'info> {
    #[account(mut, seeds = [b"pool", pool.mint.as_ref()], bump = pool.bump)]
    pub pool: Account<'info, Pool>,
    #[account(mut, address = pool.vault)]
    pub vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub lender_ata: Account<'info, TokenAccount>,
    pub lender: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct RegisterFarmer<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + Farmer::SIZE,
        seeds = [b"farmer", owner.key().as_ref()],
        bump
    )]
    pub farmer: Account<'info, Farmer>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RequestLoan<'info> {
    #[account(seeds = [b"pool", pool.mint.as_ref()], bump = pool.bump)]
    pub pool: Account<'info, Pool>,
    #[account(seeds = [b"farmer", owner.key().as_ref()], bump = farmer.bump,
              has_one = owner)]
    pub farmer: Account<'info, Farmer>,
    #[account(
        init,
        payer = owner,
        space = 8 + Loan::SIZE,
        seeds = [b"loan", farmer.key().as_ref(), &farmer.loans_taken.to_le_bytes()],
        bump
    )]
    pub loan: Account<'info, Loan>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ApproveLoan<'info> {
    #[account(mut, seeds = [b"pool", pool.mint.as_ref()], bump = pool.bump,
              has_one = authority)]
    pub pool: Account<'info, Pool>,
    #[account(mut, has_one = pool, has_one = farmer)]
    pub loan: Account<'info, Loan>,
    #[account(mut)]
    pub farmer: Account<'info, Farmer>,
    #[account(mut, address = pool.vault)]
    pub vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub borrower_ata: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct RepayLoan<'info> {
    #[account(mut, seeds = [b"pool", pool.mint.as_ref()], bump = pool.bump)]
    pub pool: Account<'info, Pool>,
    #[account(mut, has_one = pool, has_one = farmer, has_one = borrower)]
    pub loan: Account<'info, Loan>,
    #[account(mut, seeds = [b"farmer", owner.key().as_ref()], bump = farmer.bump)]
    pub farmer: Account<'info, Farmer>,
    /// CHECK: validated through has_one on loan
    pub borrower: UncheckedAccount<'info>,
    #[account(mut, address = pool.vault)]
    pub vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub borrower_ata: Account<'info, TokenAccount>,
    pub owner: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

// --- state -------------------------------------------------------------------
#[account]
pub struct Pool {
    pub authority: Pubkey,
    pub mint: Pubkey,
    pub vault: Pubkey,
    pub interest_bps: u16,
    pub total_deposits: u64,
    pub total_borrowed: u64,
    pub bump: u8,
}
impl Pool {
    pub const SIZE: usize = 32 + 32 + 32 + 2 + 8 + 8 + 1;
}

#[account]
pub struct Farmer {
    pub owner: Pubkey,
    pub name: String,        // 4 + 64
    pub region: String,      // 4 + 64
    pub credit_score: u16,
    pub loans_taken: u64,
    pub loans_repaid: u64,
    pub bump: u8,
}
impl Farmer {
    pub const SIZE: usize = 32 + (4 + 64) + (4 + 64) + 2 + 8 + 8 + 1;
}

#[account]
pub struct Loan {
    pub farmer: Pubkey,
    pub borrower: Pubkey,
    pub pool: Pubkey,
    pub principal: u64,
    pub interest_bps: u16,
    pub term_days: u16,
    pub status: LoanStatus,
    pub requested_at: i64,
    pub disbursed_at: i64,
    pub due_at: i64,
    pub repaid_amount: u64,
    pub bump: u8,
}
impl Loan {
    pub const SIZE: usize = 32 + 32 + 32 + 8 + 2 + 2 + 1 + 8 + 8 + 8 + 8 + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, Debug)]
pub enum LoanStatus {
    Requested,
    Active,
    Repaid,
    Defaulted,
}

// --- errors ------------------------------------------------------------------
#[error_code]
pub enum AgriErr {
    #[msg("Interest rate exceeds protocol cap (50%).")]
    InterestTooHigh,
    #[msg("Amount must be greater than zero.")]
    ZeroAmount,
    #[msg("Loan amount outside allowed range.")]
    InvalidAmount,
    #[msg("Term must be 1-365 days.")]
    InvalidTerm,
    #[msg("String exceeds max length.")]
    StringTooLong,
    #[msg("Credit score below minimum threshold.")]
    CreditScoreTooLow,
    #[msg("Pool has insufficient liquidity.")]
    InsufficientLiquidity,
    #[msg("Loan is not in the required state for this action.")]
    InvalidLoanState,
    #[msg("Math overflow.")]
    MathOverflow,
}
