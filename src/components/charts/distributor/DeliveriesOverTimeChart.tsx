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
import { useOrderContext } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import dayjs from "dayjs";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200 p-3 shadow-xl rounded-xl">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
          {dayjs(label).format("MMM DD, YYYY")}
        </p>
        <p className="text-sm font-bold text-slate-900">
          {payload[0].value} <span className="text-slate-400 font-medium text-xs">Deliveries</span>
        </p>
      </div>
    );
  }
  return null;
};

const DeliveriesOverTimeChart = () => {
  const { orders } = useOrderContext();
  const { user } = useAuth();

  const deliveredOrders = orders?.filter(
    (o) => o.distributor_id === user?.id && o.status === "Delivered"
  ) || [];

  const groupedByDate: Record<string, number> = {};
  deliveredOrders.forEach((order) => {
    const date = dayjs(order.created).format("YYYY-MM-DD");
    groupedByDate[date] = (groupedByDate[date] || 0) + 1;
  });

  const data = Object.keys(groupedByDate)
    .sort()
    .map((date) => ({
      date,
      deliveries: groupedByDate[date],
    }));

  return (
    <ChartCard 
      title="Performance Trends" 
      // subtitle="Historical delivery volume and growth"
    >
      <div className="h-[300px] w-full mt-4 -ml-4">
        {data.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <span className="text-2xl mb-2">📈</span>
            <p className="text-xs text-slate-400 font-medium tracking-tight">
              No delivery history available
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorDeliveries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tickFormatter={(str) => dayjs(str).format("MMM DD")}
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
                dataKey="deliveries"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorDeliveries)"
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

export default DeliveriesOverTimeChart;