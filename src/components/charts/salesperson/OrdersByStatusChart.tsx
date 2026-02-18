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
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Doc } from "../../../../convex/_generated/dataModel";
import { useAuth } from "@/context/AuthContext";
import { Package } from "lucide-react"; // Import for the center icon

const COLORS = {
  Pending: "#f59e0b", // Amber-500
  Dispatched: "#4f46e5", // Indigo-600
  Delivered: "#10b981", // Emerald-500
};

// --- Custom Active Shape for High-Fidelity UI ---
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 4}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={40} // Fully rounded ends as per image_cf7a7e.png
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border p-3 shadow-xl rounded-xl">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: COLORS[data.name as keyof typeof COLORS],
            }}
          />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {data.name}
          </span>
        </div>
        <p className="text-sm font-bold text-foreground">
          {data.value}{" "}
          <span className="text-slate-400 font-medium text-xs">Orders</span>
        </p>
      </div>
    );
  }
  return null;
};

const OrdersByStatusChart = () => {
  const orders = useQuery(api.orders.getAllOrders) ?? [];
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(-1);

  const myOrders = user
    ? orders.filter((o) => o.salesperson_id === user._id)
    : [];
  const total = myOrders.length;

  const data = [
    {
      name: "Pending",
      value: myOrders.filter((o) => o.status === "Pending").length,
    },
    {
      name: "Dispatched",
      value: myOrders.filter((o) => o.status === "Dispatched").length,
    },
    {
      name: "Delivered",
      value: myOrders.filter((o) => o.status === "Delivered").length,
    },
  ].filter((d) => d.value > 0);

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(-1);

  return (
    <ChartCard title="Order Distribution">
      <div className="relative h-[260px] w-full mt-2">
        {total === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {/* Matches placeholder style in image_755f65.png */}
            <div className="bg-slate-50 p-5 rounded-full mb-4">
              <Package className="w-8 h-8 text-slate-200" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              No orders found
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Start by creating a new order above.
            </p>
          </div>
        ) : (
          <>
            {/* Center Content: Icon + Count + Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-1">
              {/* <Package className="w-5 h-5 text-slate-300 mb-1" /> */}
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Total Orders
              </span>
              <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
                {total}
              </span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70} // Matches thin ring in image_cf7a7e.png
                  outerRadius={95}
                  paddingAngle={8} // Subtle gap between segments
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
                      className="transition-all duration-300 outline-none cursor-pointer hover:opacity-90"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} cursor={false} />
              </PieChart>
            </ResponsiveContainer>
          </>
        )}
      </div>

      {/* Legend Grid Matching the Card Style */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {["Pending", "Dispatched", "Delivered"].map((status) => {
          const count = myOrders.filter((o) => o.status === status).length;
          const percentage = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
          const isSelected = data[activeIndex]?.name === status;

          return (
            <div
              key={status}
              className={`flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 ${
                isSelected
                  ? "bg-white border-slate-200 shadow-sm ring-1 ring-slate-100"
                  : "bg-slate-50/50 border-transparent"
              }`}
            >
              <div
                className="h-1 w-6 rounded-full mb-2"
                style={{
                  backgroundColor: COLORS[status as keyof typeof COLORS],
                }}
              />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                {status}
              </span>
              <span className="text-xs font-black text-slate-800">
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
};

export default OrdersByStatusChart;
