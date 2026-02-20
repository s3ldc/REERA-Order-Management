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
import { BarChart3, Package } from "lucide-react";

interface Order {
  status: "Pending" | "Dispatched" | "Delivered";
}

interface Props {
  orders: Order[];
}

const COLORS = {
  Pending: "#f59e0b",
  Dispatched: "#3b82f6",
  Delivered: "#10b981",
};

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
        cornerRadius={40} // Fully rounded ends for premium SaaS look
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
          <span className="text-muted-foreground font-medium text-xs">
            Orders
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export default function OrdersByStatusChart({ orders }: Props) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const total = orders.length;

  // 1. Full dataset for the Legend (Always shows all 3)
  const allStatuses = ["Pending", "Dispatched", "Delivered"] as const;

  // 2. Filtered dataset for the Pie Chart (Prevents empty slice errors)
  const chartData = allStatuses
    .map((status) => ({
      name: status,
      value: orders.filter((o) => o.status === status).length,
    }))
    .filter((d) => d.value > 0);

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(-1);

  return (
    <ChartCard title="Logistics Distribution">
      <div className="relative h-[280px] w-full mt-4">
  {total === 0 ? (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
      <div className="bg-muted p-5 rounded-full mb-4">
        <Package className="w-8 h-8 text-muted-foreground/40" />
      </div>

      <h3 className="text-sm font-bold text-foreground">
        No order distribution available
      </h3>

      <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">
        Status segmentation will appear once orders are created across the platform.
      </p>
    </div>
  ) : (
    <>
      {/* Center Metric */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-1">
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          Total Orders
        </span>
        <span className="text-3xl font-black text-foreground leading-none tracking-tighter">
          {total}
        </span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={chartData}
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
            {chartData.map((entry) => (
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

      {/* 3. Static Legend Grid: Now always shows all 3 options */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {allStatuses.map((status) => {
          const count = orders.filter((o) => o.status === status).length;
          const percentage = total > 0 ? ((count / total) * 100).toFixed(0) : 0;

          // Match active index from chartData to highlight the legend
          const isSelected = chartData[activeIndex]?.name === status;

          return (
            <div
              key={status}
              className={`flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 ${
                isSelected
                  ? "bg-card border-border shadow-sm ring-1 ring-primary/20"
                  : "bg-muted/40 border border-border/40"
              }`}
            >
              <div
                className="h-1.5 w-6 rounded-full mb-2"
                style={{ backgroundColor: COLORS[status] }}
              />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                {status}
              </span>
              <span className="text-sm font-black text-foreground">
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}
