import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  // Removed Defs and LinearGradient from here
} from "recharts";
import { ChartCard } from "../../ui/chart-card";
import type { Doc } from "../../../../convex/_generated/dataModel";

type Order = Doc<"orders">;

interface Props {
  orders: Order[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border p-3 shadow-xl rounded-xl">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
          {new Date(label).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="text-sm font-bold text-foreground">
          {payload[0].value}{" "}
          <span className="text-muted-foreground font-medium text-xs">
            Total Orders
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export default function OrdersOverTimeChart({ orders }: Props) {
  const grouped = orders.reduce<Record<string, number>>((acc, order) => {
    const date = new Date(order._creationTime).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(grouped)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <ChartCard
      title="Demand Velocity"
      // subtitle="Order volume trends over current period"
    >
      <div className="h-[300px] w-full mt-4 -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            {/* Standard SVG tags used directly without Recharts import */}
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.25}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tickFormatter={(str) => {
                const date = new Date(str);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
              tick={{
                fontSize: 10,
                fontWeight: 600,
                fill: "hsl(var(--muted-foreground))",
              }}
              dy={10}
            />

            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
              dx={-10}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "hsl(var(--border))",
                strokeWidth: 2,
              }}
            />

            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCount)"
              animationDuration={1500}
              activeDot={{
                r: 6,
                fill: "hsl(var(--primary))",
                stroke: "hsl(var(--background))",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
