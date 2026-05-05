import { useContext } from "react";
import { WalletContext } from "@solana/wallet-adapter-react";
import type { PublicKey } from "@solana/web3.js";

/**
 * SSR-safe wallet hook. Returns a stub when no WalletProvider is in the tree
 * (during SSR or before the client provider mounts). After hydration the real
 * context is available and full wallet state is returned.
 */
export function useSafeWallet(): {
  connected: boolean;
  publicKey: PublicKey | null;
} {
  const ctx = useContext(WalletContext);
  if (!ctx) return { connected: false, publicKey: null };
  return { connected: ctx.connected, publicKey: ctx.publicKey };
}
