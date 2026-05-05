import { createFileRoute, Link } from "@tanstack/react-router";
import { useSafeWallet } from "@/hooks/useSafeWallet";
import { Wheat, TrendingUp, Calendar, Coins, Satellite, AlertCircle, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/farmer")({
  component: FarmerDashboard,
  head: () => ({
    meta: [
      { title: "Farmer Dashboard — AgriFi India" },
      {
        name: "description",
        content:
          "Track your crop loans, NDVI health score, and repayment schedule on AgriFi.",
      },
    ],
  }),
});

const loans = [
  {
    id: "CRP-2024-001",
    crop: "Wheat (गेहूं)",
    area: 2,
    borrowed: 540,
    collateral: 900,
    apr: 9,
    health: 87,
    daysToHarvest: 64,
    status: "Active",
  },
  {
    id: "CRP-2024-002",
    crop: "Cotton (कपास)",
    area: 1.5,
    borrowed: 320,
    collateral: 530,
    apr: 9,
    health: 72,
    daysToHarvest: 110,
    status: "Active",
  },
];

function FarmerDashboard() {
  const { connected, publicKey } = useSafeWallet();
  const totalBorrowed = loans.reduce((s, l) => s + l.borrowed, 0);
  const totalCollateral = loans.reduce((s, l) => s + l.collateral, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Namaste, Farmer 🙏</h1>
            <p className="text-muted-foreground">
              {connected && publicKey
                ? `Wallet · ${publicKey.toBase58().slice(0, 6)}...${publicKey.toBase58().slice(-4)}`
                : "Connect your wallet to manage loans on-chain"}
            </p>
          </div>
          <Button asChild>
            <Link to="/onboarding">
              New loan application <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Coins className="h-5 w-5" />} label="Total borrowed" value={`$${totalBorrowed} USDC`} />
          <StatCard icon={<Wheat className="h-5 w-5" />} label="Collateral value" value={`$${totalCollateral}`} />
          <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Active loans" value={`${loans.length}`} />
          <StatCard icon={<Satellite className="h-5 w-5" />} label="Avg crop health" value="80% NDVI" tone="success" />
        </div>

        <h2 className="text-xl font-semibold mb-4">Your active crop loans</h2>
        <div className="space-y-4">
          {loans.map((loan) => (
            <Card key={loan.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Wheat className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{loan.crop}</h3>
                      <p className="text-xs text-muted-foreground">
                        {loan.id} · {loan.area} acres
                      </p>
                    </div>
                    <Badge className="ml-auto bg-success text-success-foreground">{loan.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <Field label="Borrowed" value={`$${loan.borrowed}`} />
                    <Field label="Collateral" value={`$${loan.collateral}`} />
                    <Field label="APR" value={`${loan.apr}%`} />
                    <Field
                      label="Days to harvest"
                      value={
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {loan.daysToHarvest}
                        </span>
                      }
                    />
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground inline-flex items-center gap-1">
                        <Satellite className="h-3 w-3" /> NDVI crop health
                      </span>
                      <span className={loan.health > 75 ? "text-success font-medium" : "text-gold font-medium"}>
                        {loan.health}%
                      </span>
                    </div>
                    <Progress value={loan.health} className="h-2" />
                  </div>
                </div>

                <div className="md:w-44 flex md:flex-col gap-2">
                  <Button size="sm" className="flex-1">Repay early</Button>
                  <Button size="sm" variant="outline" className="flex-1">View on-chain</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-6 p-5 border-gold/30 bg-gold/5">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-gold shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Insurance coverage active</p>
              <p className="text-muted-foreground">
                Both loans are protected by parametric insurance. Drought, flood, or pest events
                trigger automatic payouts via smart contract.
              </p>
            </div>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "success";
}) {
  return (
    <Card className="p-5">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
        tone === "success" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
      }`}>
        {icon}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold mt-0.5">{value}</p>
    </div>
  );
}
