import { Card } from "./ui/card";
import { TrendingUp, TrendingDown, MapPin } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", price: 2100 },
  { name: "Feb", price: 2150 },
  { name: "Mar", price: 2300 },
  { name: "Apr", price: 2250 },
  { name: "May", price: 2400 },
  { name: "Jun", price: 2550 },
];

const mandiPrices = [
  { crop: "Wheat (गेहूं)", price: "₹2,275", change: "+2.4%", trend: "up", location: "Khanna, PB" },
  { crop: "Rice (चावल)", price: "₹3,150", change: "-0.8%", trend: "down", location: "Karnal, HR" },
  { crop: "Cotton (कपास)", price: "₹7,200", change: "+1.2%", trend: "up", location: "Rajkot, GJ" },
];

export function MarketInsights() {
  return (
    <div className="grid lg:grid-cols-3 gap-6 mb-8">
      <Card className="lg:col-span-2 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Wheat Price Trend</h3>
            <p className="text-sm text-muted-foreground">National average (INR/Quintal)</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold">₹2,550</span>
            <span className="ml-2 text-sm text-success font-medium">+12% (6mo)</span>
          </div>
        </div>

        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                domain={["dataMin - 100", "dataMax + 100"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  borderColor: "var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Live Mandi Prices</h3>
        <div className="space-y-4">
          {mandiPrices.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
              <div>
                <p className="font-medium text-sm">{item.crop}</p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {item.location}
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">{item.price}</p>
                <p
                  className={`text-[10px] flex items-center justify-end gap-0.5 ${
                    item.trend === "up" ? "text-success" : "text-destructive"
                  }`}
                >
                  {item.trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {item.change}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-6 text-xs text-primary font-medium hover:underline">
          View all market prices →
        </button>
      </Card>
    </div>
  );
}
