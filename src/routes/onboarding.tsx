import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useSafeWallet } from "@/hooks/useSafeWallet";
import { Wheat, MapPin, Calendar, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
  head: () => ({
    meta: [
      { title: "Apply for a Crop Loan — AgriFi India" },
      {
        name: "description",
        content:
          "Register your farm, get an AI-powered yield estimate, and unlock instant USDC against your harvest.",
      },
    ],
  }),
});

const CROPS = [
  { value: "wheat", label: "Wheat (गेहूं)", pricePerQuintal: 2275 },
  { value: "rice", label: "Rice (चावल)", pricePerQuintal: 2300 },
  { value: "cotton", label: "Cotton (कपास)", pricePerQuintal: 7100 },
  { value: "sugarcane", label: "Sugarcane (गन्ना)", pricePerQuintal: 340 },
  { value: "maize", label: "Maize (मक्का)", pricePerQuintal: 2090 },
  { value: "soybean", label: "Soybean (सोयाबीन)", pricePerQuintal: 4600 },
];

const YIELD_PER_ACRE: Record<string, number> = {
  wheat: 18,
  rice: 22,
  cotton: 8,
  sugarcane: 350,
  maize: 25,
  soybean: 12,
};

function Onboarding() {
  const navigate = useNavigate();
  const { connected } = useSafeWallet();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [village, setVillage] = useState("");
  const [state, setState] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [crop, setCrop] = useState("wheat");
  const [area, setArea] = useState("2");
  const [harvestDate, setHarvestDate] = useState("");

  const cropInfo = CROPS.find((c) => c.value === crop)!;
  const acres = parseFloat(area) || 0;
  const estYieldQuintals = (YIELD_PER_ACRE[crop] || 15) * acres;
  const estValueINR = estYieldQuintals * cropInfo.pricePerQuintal;
  const maxLoanINR = Math.floor(estValueINR * 0.6);
  const maxLoanUSDC = Math.floor(maxLoanINR / 83);

  const handleSubmit = () => {
    if (!connected) {
      toast.error("Please connect your wallet first");
      return;
    }
    toast.success("Crop-NFT minted! Loan offer ready.", {
      description: `Up to $${maxLoanUSDC} USDC available.`,
    });
    setTimeout(() => navigate({ to: "/farmer" }), 1200);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Apply for a crop loan</h1>
          <p className="text-muted-foreground">
            Step {step} of 3 · Takes about 5 minutes
          </p>
          <div className="mt-4 flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-primary mb-2">
              <MapPin className="h-5 w-5" />
              <h2 className="font-semibold">Farmer details</h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ramesh Kumar" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="village">Village</Label>
                <Input id="village" value={village} onChange={(e) => setVillage(e.target.value)} placeholder="Karnal" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger id="state"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {["Punjab", "Haryana", "Uttar Pradesh", "Maharashtra", "Karnataka", "Telangana", "Bihar", "Gujarat"].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="aadhaar">Aadhaar number (mock KYC)</Label>
              <Input
                id="aadhaar"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
                placeholder="XXXX XXXX XXXX"
              />
            </div>
            <Button
              className="w-full"
              onClick={() => setStep(2)}
              disabled={!name || !village || !state || aadhaar.length !== 12}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Wheat className="h-5 w-5" />
              <h2 className="font-semibold">Crop details</h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="crop">Crop type</Label>
              <Select value={crop} onValueChange={setCrop}>
                <SelectTrigger id="crop"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CROPS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="area">Area (acres)</Label>
                <Input id="area" type="number" min="0.5" step="0.5" value={area} onChange={(e) => setArea(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="harvest">Expected harvest</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input id="harvest" type="date" value={harvestDate} onChange={(e) => setHarvestDate(e.target.value)} className="pl-9" />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
              <Button onClick={() => setStep(3)} disabled={!harvestDate} className="flex-1">
                Get AI estimate <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Sparkles className="h-5 w-5" />
              <h2 className="font-semibold">Your AI loan offer</h2>
            </div>
            <div className="rounded-lg p-5" style={{ background: "var(--gradient-hero)" }}>
              <p className="text-sm text-primary-foreground/80 mb-1">Maximum loan amount</p>
              <p className="text-4xl font-bold text-primary-foreground">
                ${maxLoanUSDC.toLocaleString()} <span className="text-base font-medium">USDC</span>
              </p>
              <p className="text-sm text-primary-foreground/90 mt-1">
                ≈ ₹{maxLoanINR.toLocaleString("en-IN")} · 60% LTV
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <Row label="Crop" value={cropInfo.label} />
              <Row label="Area" value={`${acres} acres`} />
              <Row label="Estimated yield" value={`${estYieldQuintals.toFixed(1)} quintals`} />
              <Row label="Estimated value" value={`₹${estValueINR.toLocaleString("en-IN")}`} />
              <Row label="Interest rate" value="9% APR" highlight />
              <Row label="Repayment" value={harvestDate || "At harvest"} />
            </div>
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-accent/50 p-3 rounded-md">
              <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
              <span>
                Confirming will mint a Crop-NFT to your wallet and open a USDC borrowing position on Solana Devnet.
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
              <Button onClick={handleSubmit} className="flex-1">
                {connected ? "Mint NFT & Borrow" : "Connect wallet to continue"}
              </Button>
            </div>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between border-b border-border pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "font-semibold text-gold" : "font-medium"}>{value}</span>
    </div>
  );
}
