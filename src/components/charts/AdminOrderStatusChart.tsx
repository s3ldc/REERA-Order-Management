import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartCard } from "../ui/chart-card";

const COLORS = ["#6366F1", "#10B981", "#F59E0B"];

export function AdminOrderStatusChart({ orders }: { orders: any[] }) {
  const data = [
    {
      name: "Pending",
      value: orders.filter(o => o.status === "Pending").length,
    },
    {
      name: "Dispatched",
      value: orders.filter(o => o.status === "Dispatched").length,
    },
    {
      name: "Delivered",
      value: orders.filter(o => o.status === "Delivered").length,
    },
  ];

  return (
    <ChartCard title="Orders by Status">
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={55}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
