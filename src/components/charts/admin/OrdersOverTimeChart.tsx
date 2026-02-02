import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ChartCard } from "../../ui/chart-card";

interface Order {
  created: string; // ISO date
}

interface Props {
  orders: Order[];
}

export default function OrdersOverTimeChart({ orders }: Props) {
  // Group orders by date (YYYY-MM-DD)
  const grouped = orders.reduce<Record<string, number>>((acc, order) => {
    const date = new Date(order.created).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Convert to chart-friendly array
  const data = Object.entries(grouped)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <ChartCard title="Orders Over Time">
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              stroke="#94a3b8"
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11 }}
              stroke="#94a3b8"
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#6366f1"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
