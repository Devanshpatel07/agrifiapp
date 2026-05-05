# AgriFi Lending – Solana Anchor Program

Rust on-chain program powering the AgriFi micro-lending protocol for Indian farmers.

## Stack

- **Language:** Rust (edition 2021)
- **Framework:** Anchor 0.30.1
- **Token:** SPL Token (USDC on Devnet)
- **Cluster:** Solana Devnet

## Layout

```
anchor/
├── Anchor.toml
├── Cargo.toml
└── programs/agrifi_lending/
    ├── Cargo.toml
    └── src/lib.rs        # Pool, Farmer, Loan accounts + 6 instructions
```

## Instructions

| Instruction       | Caller | Purpose                                       |
| ----------------- | ------ | --------------------------------------------- |
| `initialize_pool` | admin  | Create USDC pool + PDA-owned vault            |
| `lender_deposit`  | lender | Deposit USDC into the shared pool             |
| `register_farmer` | farmer | Create on-chain profile (score starts at 500) |
| `request_loan`    | farmer | Open a loan request (≤ 500 USDC, ≤ 365 days)  |
| `approve_loan`    | admin  | Disburse from vault → farmer ATA              |
| `repay_loan`      | farmer | Repay principal + interest; updates score     |

## Build & deploy (run locally, not in Lovable)

```bash
# install toolchain
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install 0.30.1 && avm use 0.30.1

cd anchor
anchor build
solana-keygen new -o target/deploy/agrifi_lending-keypair.json   # if needed
anchor deploy --provider.cluster devnet
```

After deploy, copy the new program ID into:

- `Anchor.toml` → `[programs.devnet]`
- `programs/agrifi_lending/src/lib.rs` → `declare_id!(...)`
- The frontend `SolanaProvider` / loan client.

## Notes

- Interest is fixed-rate (bps), accrued as a flat fee over the term.
- Credit score adjusts ±25/−50 based on on-time vs. late repayment.
- All token movements go through a PDA-controlled vault — no admin custody.
