import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
} from "recharts";
import { ChartCard } from "../../ui/chart-card";

interface Order {
  status: "Pending" | "Dispatched" | "Delivered";
}

interface Props {
  orders: Order[];
}

const COLORS = {
  Pending: "#f59e0b",    // amber-500
  Dispatched: "#3b82f6",  // blue-500
  Delivered: "#10b981",   // emerald-500
};

// --- Premium Tooltip Component ---
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200 p-3 shadow-xl rounded-xl">
        <div className="flex items-center gap-2 mb-1">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: COLORS[data.name as keyof typeof COLORS] }}
          />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {data.name}
          </span>
        </div>
        <p className="text-sm font-bold text-slate-900">
          {data.value} <span className="text-slate-400 font-medium text-xs">Orders</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function OrdersByStatusChart({ orders }: Props) {
  const total = orders.length;
  
  const data = [
    { name: "Pending", value: orders.filter((o) => o.status === "Pending").length },
    { name: "Dispatched", value: orders.filter((o) => o.status === "Dispatched").length },
    { name: "Delivered", value: orders.filter((o) => o.status === "Delivered").length },
  ].filter(d => d.value > 0); // Hide empty segments for cleaner look

  return (
    <ChartCard title="Logistics Distribution">
      <div className="relative h-[280px] w-full mt-4">
        {/* Center Label for Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total Assets</span>
          <span className="text-3xl font-black text-slate-900 leading-none">{total}</span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={8}
              cornerRadius={12} // Smooth SaaS corners
              stroke="none"
              animationBegin={0}
              animationDuration={1200}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                  className="hover:opacity-80 transition-opacity outline-none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={false} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Modern Grid Legend */}
      <div className="mt-6 grid grid-cols-3 gap-2">
        {data.map((d) => (
          <div 
            key={d.name} 
            className="group flex flex-col items-center p-3 rounded-2xl bg-slate-50/50 border border-transparent hover:border-slate-200 transition-all"
          >
            <div 
              className="h-1.5 w-8 rounded-full mb-2" 
              style={{ backgroundColor: COLORS[d.name as keyof typeof COLORS] }}
            />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              {d.name}
            </span>
            <span className="text-sm font-black text-slate-800">
              {((d.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}