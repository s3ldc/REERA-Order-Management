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

const DeliveriesOverTimeChart = () => {
  const { orders } = useOrderContext();
  const { user } = useAuth();

  // 1️⃣ Only delivered orders for this distributor
  const deliveredOrders =
    orders?.filter(
      (o) =>
        o.distributor_id === user?.id &&
        o.status === "Delivered"
    ) || [];

  // 2️⃣ Group by date
  const groupedByDate: Record<string, number> = {};

  deliveredOrders.forEach((order) => {
    const date = dayjs(order.created).format("YYYY-MM-DD");
    groupedByDate[date] = (groupedByDate[date] || 0) + 1;
  });

  // 3️⃣ Convert to chart data
  const data = Object.keys(groupedByDate)
    .sort()
    .map((date) => ({
      date,
      deliveries: groupedByDate[date],
    }));

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase tracking-wide text-slate-700">
          Deliveries Over Time
        </CardTitle>
      </CardHeader>

      <CardContent className="h-[300px]">
        {data.length === 0 ? (
          <p className="text-center text-slate-400 text-sm mt-16">
            No delivery history available
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
                dataKey="deliveries"
                stroke="#6366f1"
                strokeWidth={2.5}
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

export default DeliveriesOverTimeChart;