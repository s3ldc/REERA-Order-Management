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
import { CreditCard } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import type { Doc, Id } from "../../../../convex/_generated/dataModel";

const COLORS = {
  Paid: "#10B981",
  Unpaid: "#F43F5E",
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
        cornerRadius={40}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="bg-card/90 backdrop-blur-xl border border-border/60 p-3 shadow-2xl rounded-2xl ring-1 ring-primary/10">
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

const PaymentStatusChart = () => {
  const orders: Doc<"orders">[] = useQuery(api.orders.getAllOrders) ?? [];

  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(-1);

  const myOrders: Doc<"orders">[] = user
    ? orders.filter(
        (o: Doc<"orders">) => o.salesperson_id === (user._id as Id<"users">),
      )
    : [];

  const total = myOrders.length;

  const data = [
    {
      name: "Paid",
      value: myOrders.filter((o: Doc<"orders">) => o.payment_status === "Paid")
        .length,
    },
    {
      name: "Unpaid",
      value: myOrders.filter(
        (o: Doc<"orders">) => o.payment_status === "Unpaid",
      ).length,
    },
  ].filter((d) => d.value > 0);

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(-1);

  return (
    <ChartCard title="Financial Health">
      <div className="relative h-[260px] w-full mt-2">
        {total === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <div className="bg-muted p-5 rounded-full mb-4 border border-border">
              <CreditCard className="w-10 h-10 text-muted-foreground/40 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-bold text-foreground tracking-tight">
              No Financial Data
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1 max-w-[180px] leading-relaxed">
              Revenue insights will populate once invoices are generated.
            </p>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                Total Orders
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
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  cornerRadius={40}
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
                      className="transition-all duration-300 outline-none cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} cursor={false} />
              </PieChart>
            </ResponsiveContainer>
          </>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {["Paid", "Unpaid"].map((status) => {
          const count = myOrders.filter(
            (o: Doc<"orders">) => o.payment_status === status,
          ).length;

          const isSelected = data[activeIndex]?.name === status;

          const color = COLORS[status as keyof typeof COLORS];

          return (
            <div
              key={status}
              className={`flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 ${
                isSelected
                  ? "bg-card border-border shadow-sm ring-1 ring-border"
                  : "bg-muted/30 border-border/40"
              }`}
            >
              <div
                className="h-1 w-6 rounded-full mb-2 opacity-80"
                style={{ backgroundColor: color }}
              />
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">
                {status}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-black text-foreground">
                  {count}
                </span>
                <span className="text-[9px] font-bold text-muted-foreground">
                  ({total > 0 ? ((count / total) * 100).toFixed(0) : 0}
                  %)
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
