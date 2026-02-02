import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChartCard } from "@/components/ui/chart-card";
import { useOrderContext } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";

const COLORS = {
  Pending: "#F59E0B",      // amber
  Dispatched: "#3B82F6",   // blue
  Delivered: "#10B981",    // green
};

export default function OrdersByStatusChart() {
  const { orders } = useOrderContext();
  const { user } = useAuth();

  if (!user) return null;

  // 🔹 Filter orders assigned to this distributor
  const myOrders = orders.filter(
    (o) => o.distributor_id === user.id
  );

  const statusCount = myOrders.reduce<Record<string, number>>(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    },
    {}
  );

  const data = Object.entries(statusCount).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  if (data.length === 0) {
    return (
      <ChartCard title="Orders by Status">
        <p className="text-sm text-slate-400 text-center py-12">
          No orders assigned yet
        </p>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Orders by Status">
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-xs">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor:
                  COLORS[item.name as keyof typeof COLORS],
              }}
            />
            <span className="text-slate-600 font-medium">
              {item.name} ({item.value})
            </span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}