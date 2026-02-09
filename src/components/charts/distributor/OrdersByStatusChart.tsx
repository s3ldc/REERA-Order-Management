import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
} from "recharts";
import { ChartCard } from "@/components/ui/chart-card";
import { useOrderContext } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";

const COLORS = {
  Pending: "#F59E0B",   // amber-500
  Dispatched: "#3B82F6", // blue-500
  Delivered: "#10B981",  // emerald-500
};

// --- Custom Active Shape for SaaS Tactile Feel ---
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={12}
      />
    </g>
  );
};

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

export default function OrdersByStatusChart() {
  const { orders } = useOrderContext();
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(-1);

  if (!user) return null;

  const myOrders = orders.filter((o) => o.distributor_id === user.id);
  const total = myOrders.length;

  const statusCount = myOrders.reduce<Record<string, number>>((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(statusCount).map(([status, count]) => ({
    name: status,
    value: count,
  })).filter(d => d.value > 0);

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(-1);

  if (total === 0) {
    return (
      <ChartCard title="Logistics Distribution">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-slate-50 p-6 rounded-full mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">No Orders Found</h3>
          <p className="text-xs text-slate-400 max-w-[200px] mt-1">Assignments will appear here once processed by the system.</p>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard 
      title="Logistics Distribution" 
      // subtitle="Overview of assigned shipment lifecycle"
    >
      <div className="relative h-[280px] w-full mt-4">
        {/* Metric Centerpiece: The "Big Number" */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Assigned</span>
          <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{total}</span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={8}
              cornerRadius={12}
              stroke="none"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              animationDuration={1000}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                  className="transition-all duration-300 outline-none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={false} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Modern SaaS Legend Grid with Percentages */}
      <div className="mt-6 grid grid-cols-3 gap-2">
        {["Pending", "Dispatched", "Delivered"].map((status, index) => {
          const count = statusCount[status] || 0;
          const isSelected = data[activeIndex]?.name === status;
          
          return (
            <div 
              key={status} 
              className={`flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 ${
                isSelected ? 'bg-white border-slate-200 shadow-sm ring-1 ring-slate-100' : 'bg-slate-50/50 border-transparent'
              }`}
            >
              <div 
                className="h-1.5 w-8 rounded-full mb-2" 
                style={{ backgroundColor: COLORS[status as keyof typeof COLORS] }}
              />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                {status}
              </span>
              <span className="text-sm font-black text-slate-800">
                {total > 0 ? ((count / total) * 100).toFixed(0) : 0}%
              </span>
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}