import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSafeWallet } from "@/hooks/useSafeWallet";
import { TrendingUp, Coins, ShieldCheck, Users, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/lender")({
  component: LenderDashboard,
  head: () => ({
    meta: [
      { title: "Lend & Earn — AgriFi India" },
      {
        name: "description",
        content:
          "Deposit USDC and earn 8-12% APY by funding crop-collateralized loans for Indian farmers.",
      },
    ],
  }),
});

const pools = [
  {
    id: "kharif-24",
    name: "Kharif Pool 2024",
    crops: "Rice, Cotton, Sugarcane",
    apy: 11.2,
    tvl: 124500,
    util: 78,
    risk: "Medium" as const,
  },
  {
    id: "rabi-24",
    name: "Rabi Pool 2024",
    crops: "Wheat, Mustard, Gram",
    apy: 8.6,
    tvl: 286000,
    util: 64,
    risk: "Low" as const,
  },
  {
    id: "hort-24",
    name: "Horticulture Pool",
    crops: "Mango, Pomegranate",
    apy: 13.5,
    tvl: 52000,
    util: 45,
    risk: "High" as const,
  },
];

function LenderDashboard() {
  const { connected } = useSafeWallet();
  const [amount, setAmount] = useState("100");

  const handleDeposit = (poolName: string) => {
    if (!connected) return toast.error("Connect your wallet first");
    toast.success(`Deposited $${amount} USDC to ${poolName}`, {
      description: "Position will appear after Devnet confirmation.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="max-w-3xl mb-8">
          <h1 className="text-3xl font-bold mb-2">Earn yield by funding farmers</h1>
          <p className="text-muted-foreground">
            Deposit USDC into a crop pool. Earn interest as farmers repay at harvest. Every loan is
            over-collateralized and insured.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Stat
            icon={<TrendingUp className="h-5 w-5" />}
            label="Avg APY"
            value="11.1%"
            tone="gold"
          />
          <Stat icon={<Coins className="h-5 w-5" />} label="Total TVL" value="$462K" />
          <Stat icon={<Users className="h-5 w-5" />} label="Active farmers" value="1,284" />
          <Stat
            icon={<ShieldCheck className="h-5 w-5" />}
            label="Default rate"
            value="0.8%"
            tone="success"
          />
        </div>

        <h2 className="text-xl font-semibold mb-4">Available pools</h2>
        <div className="space-y-4">
          {pools.map((pool) => (
            <Card key={pool.id} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{pool.name}</h3>
                    <Badge
                      variant={
                        pool.risk === "Low"
                          ? "secondary"
                          : pool.risk === "High"
                            ? "destructive"
                            : "default"
                      }
                    >
                      {pool.risk} risk
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{pool.crops}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">APY</p>
                      <p className="font-bold text-gold text-lg">{pool.apy}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">TVL</p>
                      <p className="font-semibold">${pool.tvl.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Utilization</p>
                      <p className="font-semibold">{pool.util}%</p>
                    </div>
                  </div>
                </div>

                <div className="lg:w-64 space-y-2">
                  <Label htmlFor={`amt-${pool.id}`} className="text-xs">
                    Deposit amount (USDC)
                  </Label>
                  <Input
                    id={`amt-${pool.id}`}
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="10"
                  />
                  <Button className="w-full" onClick={() => handleDeposit(pool.name)}>
                    Deposit <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-6 p-5 bg-accent/40">
          <h3 className="font-semibold mb-2">How your money is protected</h3>
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>Every loan backed by a Crop-NFT worth more than the borrowed amount (60% LTV).</li>
            <li>Parametric insurance covers weather, drought, and pest disasters.</li>
            <li>Liquidations via Dutch auction if collateral value falls below threshold.</li>
            <li>Diversification across crops, regions, and harvest seasons.</li>
          </ul>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "gold" | "success";
}) {
  const toneClass =
    tone === "gold"
      ? "bg-gold/10 text-gold"
      : tone === "success"
        ? "bg-success/10 text-success"
        : "bg-primary/10 text-primary";
  return (
    <Card className="p-5">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${toneClass}`}>
        {icon}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </Card>
  );
}
