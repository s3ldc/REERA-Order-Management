import React, { useState } from "react";
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
  payment_status: "Paid" | "Unpaid";
}

interface Props {
  orders: Order[];
}

const COLORS = {
  Paid: "#10b981",   // emerald-500
  Unpaid: "#f43f5e", // rose-500
};

// --- Custom Active Shape for premium interaction ---
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
          {data.value} <span className="text-slate-400 font-medium text-xs">Invoices</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function PaymentStatusChart({ orders }: Props) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const total = orders.length;

  const data = [
    { name: "Paid", value: orders.filter((o) => o.payment_status === "Paid").length },
    { name: "Unpaid", value: orders.filter((o) => o.payment_status === "Unpaid").length },
  ].filter(d => d.value > 0);

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(-1);

  return (
    <ChartCard title="Revenue Health">
      <div className="relative h-[280px] w-full mt-4">
        {/* Metric Centerpiece */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Orders</span>
          <span className="text-3xl font-black text-slate-900 leading-none tracking-tighter">{total}</span>
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
              paddingAngle={10}
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

      {/* Legend Grid */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {data.map((d, index) => (
          <div 
            key={d.name} 
            className={`flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 ${
              activeIndex === index 
                ? 'bg-white border-slate-200 shadow-sm ring-1 ring-slate-100' 
                : 'bg-slate-50/50 border-slate-100'
            }`}
          >
            <div 
              className="h-1.5 w-full rounded-full mb-2 opacity-80" 
              style={{ backgroundColor: COLORS[d.name as keyof typeof COLORS] }}
            />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              {d.name}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-black text-slate-800">{d.value}</span>
              <span className="text-[9px] font-bold text-slate-400">
                ({total > 0 ? ((d.value / total) * 100).toFixed(0) : 0}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}