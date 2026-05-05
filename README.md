# 🌾 AgriFi App

> A decentralized finance (DeFi) application for the agricultural sector, built on the Solana blockchain. AgriFi bridges traditional farming with Web3 — enabling farmers and agri-businesses to access on-chain financial tools through a modern, intuitive interface.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development](#development)
- [Smart Contracts (Anchor)](#smart-contracts-anchor)
- [Deployment](#deployment)
- [Scripts](#scripts)
- [Contributing](#contributing)

---

## Overview

AgriFi App is a full-stack Web3 application that combines a **React/TypeScript frontend** with **Solana smart contracts** written in Rust via the [Anchor framework](https://www.anchor-lang.com/). The frontend is deployed on **Cloudflare Workers** using TanStack Start, providing a fast, globally distributed edge experience.

The app enables wallet-connected users (via Phantom and Solflare) to interact with on-chain agricultural finance programs, leveraging Solana's speed and low transaction costs.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript 5.8 | Type safety |
| TanStack Start / Router | Full-stack framework & file-based routing |
| TanStack Query | Server state management & data fetching |
| Vite 7 | Build tool & dev server |
| Tailwind CSS 4 | Utility-first styling |
| shadcn/ui + Radix UI | Accessible, headless UI components |
| React Hook Form + Zod | Form handling & schema validation |
| Recharts | Data visualization / charts |
| Lucide React | Icon library |

### Blockchain
| Technology | Purpose |
|---|---|
| Solana Web3.js | Solana RPC & transaction APIs |
| Anchor | Solana smart contract framework (Rust) |
| @solana/wallet-adapter | Wallet connection (Phantom, Solflare) |

### Infrastructure
| Technology | Purpose |
|---|---|
| Cloudflare Workers | Edge deployment & hosting |
| Wrangler | Cloudflare Workers CLI & config |
| Bun | Fast JavaScript runtime & package manager |

---

## Project Structure

```
agrifiapp/
├── anchor/                   # Solana smart contracts (Rust/Anchor)
│   └── programs/
│       └── agrifiapp/
│           └── src/
│               └── lib.rs    # On-chain program logic
├── src/                      # Frontend application
│   ├── routes/               # File-based routing (TanStack Router)
│   ├── components/           # Reusable UI components
│   └── ...
├── package.json              # Node dependencies & scripts
├── vite.config.ts            # Vite + Cloudflare plugin config
├── tsconfig.json             # TypeScript configuration
├── wrangler.jsonc            # Cloudflare Workers deployment config
├── components.json           # shadcn/ui component registry
├── bunfig.toml               # Bun configuration
├── .prettierrc               # Code formatting rules
└── eslint.config.js          # Linting configuration
```

---

## Features

- 🔗 **Wallet Integration** — Connect via Phantom or Solflare wallets with a single click
- 📊 **On-Chain Data Dashboard** — Visualize agricultural finance metrics powered by Recharts
- 📝 **Smart Contract Interactions** — Submit and track Solana transactions via Anchor programs
- 🧩 **Component-Rich UI** — Extensive Radix UI primitives (dialogs, dropdowns, tabs, accordion, and more)
- 🔒 **Form Validation** — Type-safe forms with React Hook Form and Zod schema validation
- 🌐 **Edge Deployment** — Hosted on Cloudflare Workers for low-latency global access
- ⚡ **Fast DX** — Powered by Vite 7 and Bun for near-instant dev feedback

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Bun](https://bun.sh/) `>= 1.x` (preferred) **or** Node.js `>= 18`
- [Rust](https://www.rust-lang.org/tools/install) (for building Anchor programs)
- [Anchor CLI](https://www.anchor-lang.com/docs/installation) `>= 0.30`
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- A Solana wallet browser extension (Phantom or Solflare)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Devanshpatel07/agrifiapp.git
cd agrifiapp
```

### 2. Install Dependencies

```bash
bun install
# or
npm install
```

### 3. Configure Environment

Create a `.env` file at the root (if applicable):

```env
# Example — update with your actual values
VITE_SOLANA_NETWORK=devnet
VITE_RPC_ENDPOINT=https://api.devnet.solana.com
```

### 4. Start the Development Server

```bash
bun run dev
# or
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Development

### Available Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start the development server with hot reload |
| `bun run build` | Build the app for production |
| `bun run build:dev` | Build in development mode |
| `bun run preview` | Preview the production build locally |
| `bun run lint` | Run ESLint checks |
| `bun run format` | Auto-format code with Prettier |

### Code Style

This project uses **ESLint** and **Prettier** for consistent code quality. It's recommended to enable format-on-save in your editor.

```bash
# Lint
bun run lint

# Format all files
bun run format
```

---

## Smart Contracts (Anchor)

The on-chain programs live in the `anchor/` directory and are written in **Rust** using the Anchor framework.

### Build Programs

```bash
cd anchor
anchor build
```

### Run Tests

```bash
anchor test
```

### Deploy to Devnet

```bash
anchor deploy --provider.cluster devnet
```

After deployment, update the program ID in your frontend configuration if it changes.

---

## Deployment

This app is deployed to **Cloudflare Workers** using Wrangler.

### Production Build

```bash
bun run build
```

### Deploy to Cloudflare

```bash
npx wrangler deploy
```

The `wrangler.jsonc` is pre-configured with:
- **Compatibility date:** `2025-09-24`
- **Node.js compatibility** flag enabled
- **Entry point:** `@tanstack/react-start/server-entry`

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure your code passes linting and formatting checks before submitting.

---

## License

This project is currently unlicensed. Please contact the repository owner for usage rights.

---

