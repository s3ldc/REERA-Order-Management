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
import { CreditCard } from "lucide-react"; // The relevant icon for Finance

const COLORS = {
  Paid: "#10B981", // Emerald-500
  Unpaid: "#F43F5E", // Rose-500
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
        cornerRadius={40} // Consistent fully rounded ends
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
            style={{
              backgroundColor: COLORS[data.name as keyof typeof COLORS],
            }}
          />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {data.name}
          </span>
        </div>
        <p className="text-sm font-bold text-slate-900">
          {data.value}{" "}
          <span className="text-slate-400 font-medium text-xs">Invoices</span>
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

  const myOrders = orders?.filter((o) => o.salesperson_id === user?.id) || [];
  const total = myOrders.length;

  const data = [
    {
      name: "Paid",
      value: myOrders.filter((o) => o.payment_status === "Paid").length,
    },
    {
      name: "Unpaid",
      value: myOrders.filter((o) => o.payment_status === "Unpaid").length,
    },
  ].filter((d) => d.value > 0);

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(-1);

  return (
    <ChartCard title="Financial Health">
      <div className="relative h-[260px] w-full mt-2">
        {total === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <div className="bg-slate-50 p-5 rounded-full mb-4 shadow-sm border border-slate-100/50">
              <CreditCard className="w-10 h-10 text-slate-200 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              No Financial Data
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[180px] leading-relaxed">
              Revenue insights will populate once invoices are generated.
            </p>
          </div>
        ) : (
          <>
            {/* Center Content: Icon + Count + Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-1">
              {/* <CreditCard className="w-5 h-5 text-slate-300 mb-1" /> */}
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
                  innerRadius={70} // Sleek thin ring geometry
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

      {/* Modern SaaS Legend Grid */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {["Paid", "Unpaid"].map((status) => {
          const count = myOrders.filter(
            (o) => o.payment_status === status,
          ).length;
          const isSelected = data[activeIndex]?.name === status;
          const color = COLORS[status as keyof typeof COLORS];

          return (
            <div
              key={status}
              className={`flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 ${
                isSelected
                  ? "bg-white border-slate-200 shadow-sm ring-1 ring-slate-100"
                  : "bg-slate-50/50 border-slate-100"
              }`}
            >
              <div
                className="h-1 w-full rounded-full mb-2 opacity-80"
                style={{ backgroundColor: color }}
              />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                {status}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-black text-slate-800">
                  {count}
                </span>
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
