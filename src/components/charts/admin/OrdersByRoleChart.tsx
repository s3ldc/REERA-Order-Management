import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ChartCard } from "../../ui/chart-card";

interface Order {
  salesperson_id?: string;
  distributor_id?: string;
}

interface Props {
  orders: Order[];
}

export default function OrdersByRoleChart({ orders }: Props) {
  const salespersonOrders = orders.filter(o => o.salesperson_id).length;
  const distributorOrders = orders.filter(o => o.distributor_id).length;

  const data = [
    { role: "Salesperson", count: salespersonOrders },
    { role: "Distributor", count: distributorOrders },
  ];

  return (
    <ChartCard title="Orders by Role">
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="role"
              tick={{ fontSize: 12 }}
              stroke="#94a3b8"
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11 }}
              stroke="#94a3b8"
            />
            <Tooltip />
            <Bar
              dataKey="count"
              radius={[6, 6, 0, 0]}
              fill="#22c55e"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
