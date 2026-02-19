import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartCard } from "@/components/ui/chart-card";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import type { Doc, Id } from "../../../../convex/_generated/dataModel";
import { useAuth } from "@/context/AuthContext";
import dayjs from "dayjs";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border p-3 shadow-xl rounded-xl">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
          {dayjs(label).format("MMM DD, YYYY")}
        </p>
        <p className="text-sm font-bold text-foreground">
          {payload[0].value}{" "}
          <span className="text-muted-foreground font-medium text-xs">
            Deliveries
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const DeliveriesOverTimeChart = () => {
  const orders: Doc<"orders">[] = useQuery(api.orders.getAllOrders) ?? [];

  const { user } = useAuth();

  const deliveredOrders: Doc<"orders">[] = user
    ? orders.filter(
        (o: Doc<"orders">) =>
          o.distributor_id === (user._id as Id<"users">) &&
          o.status === "Delivered",
      )
    : [];

  const groupedByDate: Record<string, number> = {};

  deliveredOrders.forEach((order) => {
    const dateKey = dayjs(order._creationTime).format("YYYY-MM-DD");
    groupedByDate[dateKey] = (groupedByDate[dateKey] || 0) + 1;
  });

  const data = Object.keys(groupedByDate)
    .sort((a, b) => dayjs(a).unix() - dayjs(b).unix())
    .map((date) => ({
      date,
      deliveries: groupedByDate[date],
    }));

  return (
    <ChartCard title="Performance Trends">
      <div className="h-[300px] w-full mt-4 -ml-4">
        {data.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <span className="text-2xl mb-2">📈</span>
            <p className="text-xs text-muted-foreground font-medium tracking-tight">
              No delivery history available
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id="colorDeliveries"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.15}
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
                tickFormatter={(str) => dayjs(str).format("MMM DD")}
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
                tick={{
                  fontSize: 10,
                  fontWeight: 600,
                  fill: "hsl(var(--muted-foreground))",
                }}
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
                dataKey="deliveries"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorDeliveries)"
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
        )}
      </div>
    </ChartCard>
  );
};

export default DeliveriesOverTimeChart;
