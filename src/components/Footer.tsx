import { Sprout } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sprout className="h-4 w-4 text-primary" />
          <span>AgriFi India · Crop-collateralized lending on Solana</span>
        </div>
        <p className="text-xs text-muted-foreground">Devnet demo · Not financial advice</p>
      </div>
    </footer>
  );
}
