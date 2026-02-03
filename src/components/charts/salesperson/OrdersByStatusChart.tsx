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
  Pending: "#f59e0b",   // amber-500
  Dispatched: "#3b82f6", // blue-500
  Delivered: "#10b981",  // emerald-500
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
        outerRadius={outerRadius + 6} // Expands segment on hover
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

const OrdersByStatusChart = () => {
  const { orders } = useOrderContext();
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(-1);

  // 🔹 Only orders created by this salesperson
  const myOrders = orders?.filter((o) => o.salesperson_id === user?.id) || [];
  const total = myOrders.length;

  const data = [
    { name: "Pending", value: myOrders.filter((o) => o.status === "Pending").length },
    { name: "Dispatched", value: myOrders.filter((o) => o.status === "Dispatched").length },
    { name: "Delivered", value: myOrders.filter((o) => o.status === "Delivered").length },
  ].filter(d => d.value > 0);

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(-1);

  return (
    <ChartCard 
      title="Order Distribution" 
      // subtitle="Lifecycle breakdown of your generated sales"
    >
      <div className="relative h-[280px] w-full mt-4">
        {total === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="bg-slate-50 p-4 rounded-full mb-3 text-2xl">📊</div>
            <p className="text-xs text-slate-400 font-medium">No sales orders generated yet</p>
          </div>
        ) : (
          <>
            {/* Center Label for Donut Hole */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total Created</span>
              <span className="text-3xl font-black text-slate-900 leading-none">{total}</span>
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
                      className="transition-all duration-300 outline-none hover:opacity-90"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} cursor={false} />
              </PieChart>
            </ResponsiveContainer>
          </>
        )}
      </div>

      {/* Synchronized Legend Grid */}
      <div className="mt-6 grid grid-cols-3 gap-2">
        {["Pending", "Dispatched", "Delivered"].map((status, index) => {
          const count = myOrders.filter(o => o.status === status).length;
          const isSelected = data[activeIndex]?.name === status;
          
          return (
            <div 
              key={status} 
              className={`flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 ${
                isSelected 
                  ? 'bg-white border-slate-200 shadow-sm ring-1 ring-slate-100' 
                  : 'bg-slate-50/50 border-transparent'
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
};

export default OrdersByStatusChart;