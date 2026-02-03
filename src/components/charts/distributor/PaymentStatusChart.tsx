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
  Paid: "#10B981",   // Emerald-500
  Unpaid: "#F43F5E", // Rose-500
};

// --- Custom Active Shape for Interactive Feel ---
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

const PaymentStatusChart = () => {
  const { orders } = useOrderContext();
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(-1);

  const assignedOrders = orders?.filter((o) => o.distributor_id === user?.id) || [];
  const total = assignedOrders.length;

  const data = [
    { name: "Paid", value: assignedOrders.filter((o) => o.payment_status === "Paid").length },
    { name: "Unpaid", value: assignedOrders.filter((o) => o.payment_status === "Unpaid").length },
  ].filter(d => d.value > 0);

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(-1);

  return (
    <ChartCard title="Revenue Health">
      <div className="relative h-[280px] w-full mt-4">
        {total === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl mb-2">💳</span>
            <p className="text-xs text-slate-400 font-medium">No payment data available</p>
          </div>
        ) : (
          <>
            {/* Donut Centerpiece */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total Orders</span>
              <span className="text-3xl font-black text-slate-900 leading-none">{total}</span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={data}
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={10}
                  cornerRadius={12}
                  dataKey="value"
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
          </>
        )}
      </div>

      {/* Legend Grid with Integrated Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {["Paid", "Unpaid"].map((status, index) => {
          const count = assignedOrders.filter(o => o.payment_status === status).length;
          const isSelected = data[activeIndex]?.name === status;
          const color = COLORS[status as keyof typeof COLORS];

          return (
            <div 
              key={status} 
              className={`flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 ${
                isSelected ? 'bg-white border-slate-200 shadow-sm ring-1 ring-slate-100' : 'bg-slate-50/50 border-slate-100'
              }`}
            >
              <div 
                className="h-1.5 w-full rounded-full mb-2 opacity-80" 
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                {status}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-black text-slate-800">{count}</span>
                <span className="text-[9px] font-bold text-slate-400">
                  ({total > 0 ? ((count / total) * 100).toFixed(0) : 0}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
};

export default PaymentStatusChart;