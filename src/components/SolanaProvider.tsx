import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Buffer } from "buffer";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";

if (typeof window !== "undefined") {
  (window as unknown as { Buffer: typeof Buffer; global: typeof globalThis }).Buffer = Buffer;
  (window as unknown as { Buffer: typeof Buffer; global: typeof globalThis }).global = window;
}
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

/**
 * Solana wallet adapter relies on browser globals and cannot run during SSR.
 * We mount the providers only on the client. Descendants that use wallet
 * hooks must use `useSafeWallet()` from `@/hooks/useSafeWallet` so they
 * don't throw during the SSR pass (when no provider is present).
 */
export function SolanaProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const endpoint = useMemo(() => clusterApiUrl(WalletAdapterNetwork.Devnet), []);
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);

  if (!mounted) return <>{children}</>;

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
