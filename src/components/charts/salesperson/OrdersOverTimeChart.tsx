import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartCard } from "@/components/ui/chart-card";
import { useOrderContext } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import dayjs from "dayjs";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200 p-3 shadow-xl rounded-xl">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-900">
          {payload[0].value} <span className="text-slate-400 font-medium text-xs">Total Orders</span>
        </p>
      </div>
    );
  }
  return null;
};

const OrdersOverTimeChart = () => {
  const { orders } = useOrderContext();
  const { user } = useAuth();

  const myOrders = orders?.filter((o) => o.salesperson_id === user?.id) || [];

  const ordersByDate = myOrders.reduce<Record<string, number>>((acc, order) => {
    const date = dayjs(order.created).format("DD MMM");
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(ordersByDate).map(([date, count]) => ({
    date,
    orders: count,
  }));

  return (
    <ChartCard 
      title="Sales Velocity" 
      // subtitle="Order generation trends over the current period"
    >
      <div className="h-[300px] w-full mt-4 -ml-4">
        {data.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="bg-slate-50 p-4 rounded-full mb-3 text-2xl">📈</div>
            <p className="text-xs text-slate-400 font-medium tracking-tight">
              No order activity recorded yet
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
                dy={10}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
                dx={-10}
              />

              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: "#e2e8f0", strokeWidth: 2 }} 
              />

              <Area
                type="monotone"
                dataKey="orders"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorOrders)"
                animationDuration={1500}
                activeDot={{ 
                  r: 6, 
                  fill: "#6366f1", 
                  stroke: "#fff", 
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartCard>
  );
};

export default OrdersOverTimeChart;