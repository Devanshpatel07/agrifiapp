import { createFileRoute, Link } from "@tanstack/react-router";
import { Sprout, Coins, ShieldCheck, TrendingUp, ArrowRight, Wheat, Satellite, Users } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "AgriFi India — Crop-Collateralized Loans on Solana" },
      {
        name: "description",
        content:
          "Indian farmers unlock instant USDC loans backed by their future harvest. AI yield prediction, satellite monitoring, parametric insurance — all on Solana.",
      },
      { property: "og:title", content: "AgriFi India — Crop-Backed DeFi Lending" },
      {
        property: "og:description",
        content:
          "Tokenize your harvest. Borrow against it. Repay at sale. Built for Indian farmers on Solana.",
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, var(--color-primary) 0%, transparent 50%), radial-gradient(circle at 80% 80%, var(--color-gold) 0%, transparent 50%)",
            }}
          />
          <div className="container mx-auto px-4 py-16 md:py-24 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-xs font-medium text-primary mb-6">
                <Sprout className="h-3 w-3" />
                Built for Bharat · Powered by Solana
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
                Loans against your{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--gradient-hero)" }}
                >
                  next harvest
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Skip the moneylender. Tokenize your standing crop, borrow USDC
                instantly at fair rates, and repay when you sell at the mandi.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" asChild className="text-base">
                  <Link to="/onboarding">
                    Apply for a Loan <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-base">
                  <Link to="/lender">Lend & Earn Yield</Link>
                </Button>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-4 max-w-xl mx-auto">
                <Stat value="₹50K" label="Avg loan" />
                <Stat value="8-12%" label="Lender APY" />
                <Stat value="48 hrs" label="To disburse" />
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">How it works</h2>
            <p className="text-muted-foreground">
              From standing crop to USDC in your wallet
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <Step
              num="1"
              icon={<Wheat className="h-5 w-5" />}
              title="Register your crop"
              desc="Add land record, crop type, area, and expected harvest date."
            />
            <Step
              num="2"
              icon={<Satellite className="h-5 w-5" />}
              title="AI yield estimate"
              desc="Satellite NDVI + weather data predicts your yield and value."
            />
            <Step
              num="3"
              icon={<Coins className="h-5 w-5" />}
              title="Mint Crop-NFT"
              desc="Your future harvest becomes on-chain collateral on Solana."
            />
            <Step
              num="4"
              icon={<TrendingUp className="h-5 w-5" />}
              title="Borrow & repay"
              desc="Get up to 60% of crop value in USDC. Repay at harvest."
            />
          </div>
        </section>

        {/* Features */}
        <section className="bg-accent/30 py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6">
              <Feature
                icon={<ShieldCheck className="h-6 w-6 text-primary" />}
                title="Parametric insurance"
                desc="Drought, flood, or pest? Smart contracts pay out automatically based on weather indices."
              />
              <Feature
                icon={<Users className="h-6 w-6 text-primary" />}
                title="No middleman"
                desc="Lenders worldwide fund your loan directly. You keep more of every rupee."
              />
              <Feature
                icon={<Satellite className="h-6 w-6 text-primary" />}
                title="Verified by satellite"
                desc="Continuous NDVI monitoring proves your crop is healthy and on track."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-16 text-center">
          <Card className="p-8 md:p-12 max-w-3xl mx-auto" style={{ background: "var(--gradient-hero)" }}>
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
              Ready to grow with AgriFi?
            </h2>
            <p className="text-primary-foreground/90 mb-6">
              Connect your wallet and start your loan application in minutes.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/onboarding">Start Application</Link>
            </Button>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl md:text-3xl font-bold text-primary">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function Step({
  num,
  icon,
  title,
  desc,
}: {
  num: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Card className="p-6 relative hover:shadow-lg transition-shadow">
      <div className="absolute top-4 right-4 text-5xl font-bold text-accent opacity-50 leading-none">
        {num}
      </div>
      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </Card>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="text-center md:text-left">
      <div className="inline-flex p-3 rounded-lg bg-background mb-3">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
