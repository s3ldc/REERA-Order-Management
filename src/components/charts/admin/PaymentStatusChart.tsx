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
import { CreditCard } from "lucide-react";

interface Order {
  payment_status: "Paid" | "Unpaid";
}

interface Props {
  orders: Order[];
}

const COLORS = {
  Paid: "#10b981", // emerald-500
  Unpaid: "#f43f5e", // rose-500
} as const;

type PaymentStatus = keyof typeof COLORS;

// --- Custom Active Shape for premium interaction ---
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
            Invoices
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export default function PaymentStatusChart({ orders }: Props) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const total = orders.length;

const paymentCount = {
  Paid: orders.filter((o) => o.payment_status === "Paid").length,
  Unpaid: orders.filter((o) => o.payment_status === "Unpaid").length,
};

const data = (Object.entries(paymentCount) as [
  "Paid" | "Unpaid",
  number
][])
  .map(([name, value]) => ({ name, value }))
  .filter((d) => d.value > 0);

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(-1);

  return (
    <ChartCard title="Revenue Health">
      <div className="relative h-[280px] w-full mt-4">
        {total === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <div className="bg-muted p-5 rounded-full mb-4 border border-border">
              <CreditCard className="w-10 h-10 text-muted-foreground/40 stroke-[1.5]" />
            </div>

            <h3 className="text-sm font-bold text-foreground tracking-tight">
              No revenue data available
            </h3>

            <p className="text-[11px] text-muted-foreground mt-1 max-w-[200px] leading-relaxed">
              Payment distribution insights will appear once transactions are
              recorded across the system.
            </p>
          </div>
        ) : (
          <>
            {/* Center Metric */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-1">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
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
                      fill={COLORS[entry.name as PaymentStatus]}
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

      {/* Legend Grid */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {data.map((d, index) => (
          <div
            key={d.name}
            className={`flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 ${
              activeIndex === index
                ? "bg-card border-border shadow-sm ring-1 ring-primary/20"
                : "bg-muted/40 border border-border/40"
            }`}
          >
            <div
              className="h-1.5 w-6 rounded-full mb-2 opacity-80"
              style={{ backgroundColor: COLORS[d.name as keyof typeof COLORS] }}
            />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
              {d.name}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-black text-foreground">
                {d.value}
              </span>
              <span className="text-[9px] font-bold text-muted-foreground">
                ({total > 0 ? ((d.value / total) * 100).toFixed(0) : 0}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
