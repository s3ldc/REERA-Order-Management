import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useOrderContext } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import dayjs from "dayjs";

const OrdersOverTimeChart = () => {
  const { orders } = useOrderContext();
  const { user } = useAuth();

  const myOrders =
    orders?.filter((o) => o.salesperson_id === user?.id) || [];

  // Group orders by date
  const ordersByDate = myOrders.reduce<Record<string, number>>(
    (acc, order) => {
      const date = dayjs(order.created).format("DD MMM");
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {}
  );

  const data = Object.entries(ordersByDate).map(([date, count]) => ({
    date,
    orders: count,
  }));

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase tracking-wide text-slate-700">
          Orders Over Time
        </CardTitle>
      </CardHeader>

      <CardContent className="h-[300px]">
        {data.length === 0 ? (
          <p className="text-center text-slate-400 text-sm mt-20">
            No order activity yet
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                stroke="#94a3b8"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                stroke="#94a3b8"
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersOverTimeChart;