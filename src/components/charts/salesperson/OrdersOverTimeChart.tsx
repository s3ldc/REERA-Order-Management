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
import type { Doc } from "../../../../convex/_generated/dataModel";
import { useAuth } from "@/context/AuthContext";
import { Activity } from "lucide-react";
import dayjs from "dayjs";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import type { Id } from "../../../../convex/_generated/dataModel";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200 p-3 shadow-xl rounded-xl">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-900">
          {payload[0].value}{" "}
          <span className="text-slate-400 font-medium text-xs">
            Total Orders
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const OrdersOverTimeChart = () => {
  const orders: Doc<"orders">[] = useQuery(api.orders.getAllOrders) ?? [];
  const { user } = useAuth();

const myOrders: Doc<"orders">[] =
  user
    ? orders.filter(
        (o) => o.salesperson_id === (user.id as Id<"users">)
      )
    : [];

const ordersByDate = myOrders.reduce<Record<string, number>>((acc, order) => {
  const dateKey = dayjs(order._creationTime).format("YYYY-MM-DD");
  acc[dateKey] = (acc[dateKey] || 0) + 1;
  return acc;
}, {});

  const data = Object.entries(ordersByDate)
    .sort(([a], [b]) => dayjs(a).unix() - dayjs(b).unix())
    .map(([date, count]) => ({
      date: dayjs(date).format("DD MMM"),
      orders: count,
    }));

  return (
    <ChartCard title="Sales Velocity">
      <div className="h-[300px] w-full mt-4 -ml-4">
        {data.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 -ml-4">
            {/* Optimized Placeholder following image_755f65.png style */}
            <div className="bg-slate-50 p-5 rounded-full mb-4 shadow-sm border border-slate-100/50">
              <Activity className="w-10 h-10 text-slate-200 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              No activity recorded yet
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">
              Fulfillment velocity and order trends will populate once shipments
              are processed.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
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
                cursor={{ stroke: "#e2e8f0", strokeWidth: 2 }}
              />

              <Area
                type="monotone"
                dataKey="orders"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorOrders)"
                animationDuration={1500}
                activeDot={{
                  r: 6,
                  fill: "#6366f1",
                  stroke: "#fff",
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

export default OrdersOverTimeChart;
