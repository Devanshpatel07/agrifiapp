import { Link, useLocation } from "@tanstack/react-router";
import { useState, useEffect, lazy, Suspense } from "react";
import { Menu, X, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const WalletMultiButton = lazy(() =>
  import("@solana/wallet-adapter-react-ui").then((m) => ({
    default: m.WalletMultiButton,
  })),
);

function ClientWalletButton({ style }: { style: React.CSSProperties }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <Button variant="outline" size="sm" style={{ height: "2.5rem" }}>
        Connect Wallet
      </Button>
    );
  }
  return (
    <Suspense
      fallback={
        <Button variant="outline" size="sm">
          Loading...
        </Button>
      }
    >
      <WalletMultiButton style={style} />
    </Suspense>
  );
}

const links = [
  { to: "/", label: "Home" },
  { to: "/onboarding", label: "Get a Loan" },
  { to: "/farmer", label: "Farmer Dashboard" },
  { to: "/lender", label: "Lend & Earn" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <Sprout className="h-6 w-6" />
          <span>AgriFi</span>
          <span className="text-xs font-medium text-gold">India</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent",
                location.pathname === l.to ? "text-primary bg-accent" : "text-muted-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <ClientWalletButton
            style={{
              background: "var(--color-primary)",
              color: "var(--color-primary-foreground)",
              borderRadius: "0.5rem",
              height: "2.5rem",
              fontSize: "0.875rem",
              padding: "0 1rem",
            }}
          />
        </div>

        <button
          className="md:hidden p-2 rounded-md hover:bg-accent"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium",
                  location.pathname === l.to
                    ? "text-primary bg-accent"
                    : "text-muted-foreground hover:bg-accent",
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-2">
              <ClientWalletButton
                style={{
                  background: "var(--color-primary)",
                  color: "var(--color-primary-foreground)",
                  borderRadius: "0.5rem",
                  width: "100%",
                  height: "2.5rem",
                  fontSize: "0.875rem",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
