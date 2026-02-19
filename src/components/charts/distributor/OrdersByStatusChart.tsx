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
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Doc, Id } from "../../../../convex/_generated/dataModel";

const COLORS = {
  Pending: "#F59E0B",
  Dispatched: "#3B82F6",
  Delivered: "#10B981",
} as const;

type OrderStatus = keyof typeof COLORS;

// --- Custom Active Shape ---
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;

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
      <div className="bg-card/95 backdrop-blur-sm border border-border p-3 shadow-xl rounded-xl">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor:
                COLORS[data.name as OrderStatus],
            }}
          />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {data.name}
          </span>
        </div>
        <p className="text-sm font-bold text-foreground">
          {data.value}{" "}
          <span className="text-muted-foreground font-medium text-xs">
            Orders
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export default function OrdersByStatusChart() {
  const { user } = useAuth();
  const orders: Doc<"orders">[] =
    useQuery(api.orders.getAllOrders) ?? [];

  const [activeIndex, setActiveIndex] = useState(-1);

  if (!user) return null;

  const myOrders: Doc<"orders">[] =
    orders.filter(
      (o: Doc<"orders">) =>
        o.distributor_id === (user._id as Id<"users">)
    );

  const total = myOrders.length;

  const statusCount = myOrders.reduce<
    Record<OrderStatus, number>
  >(
    (acc, order) => {
      acc[order.status as OrderStatus] =
        (acc[order.status as OrderStatus] || 0) + 1;
      return acc;
    },
    {
      Pending: 0,
      Dispatched: 0,
      Delivered: 0,
    }
  );

  const data = (
    Object.entries(statusCount) as [
      OrderStatus,
      number
    ][]
  )
    .map(([status, count]) => ({
      name: status,
      value: count,
    }))
    .filter((d) => d.value > 0);

  const onPieEnter = (_: any, index: number) =>
    setActiveIndex(index);

  const onPieLeave = () => setActiveIndex(-1);

  if (total === 0) {
    return (
      <ChartCard title="Logistics Distribution">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-muted p-6 rounded-full mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <h3 className="text-sm font-bold text-foreground">
            No Orders Found
          </h3>
          <p className="text-xs text-muted-foreground max-w-[200px] mt-1">
            Assignments will appear here once processed by the system.
          </p>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Logistics Distribution">
      <div className="relative h-[280px] w-full mt-4">
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-1">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">
            Total Assigned
          </span>
          <span className="text-3xl font-black text-foreground tracking-tighter leading-none">
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
                  fill={COLORS[entry.name]}
                  className="transition-all duration-300 outline-none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={false} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        {(Object.keys(COLORS) as OrderStatus[]).map(
          (status) => {
            const count = statusCount[status];
            const isSelected =
              data[activeIndex]?.name === status;

            return (
              <div
                key={status}
                className={`flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 ${
                  isSelected
  ? "bg-card border-border shadow-sm ring-1 ring-border/50"
  : "bg-muted/50 border-transparent"
                }`}
              >
                <div
                  className="h-1.5 w-8 rounded-full mb-2"
                  style={{
                    backgroundColor: COLORS[status],
                  }}
                />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                  {status}
                </span>
                <span className="text-sm font-black text-foreground">
                  {(
                    (count / total) *
                    100
                  ).toFixed(0)}
                  %
                </span>
              </div>
            );
          }
        )}
      </div>
    </ChartCard>
  );
}