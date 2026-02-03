import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useOrderContext } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";

const COLORS = {
  Pending: "#f59e0b",     // amber
  Dispatched: "#3b82f6",  // blue
  Delivered: "#22c55e",   // green
};

const OrdersByStatusChart = () => {
  const { orders } = useOrderContext();
  const { user } = useAuth();

  // 🔹 Only orders created by this salesperson
  const myOrders =
    orders?.filter((o) => o.salesperson_id === user?.id) || [];

  const data = [
    {
      name: "Pending",
      value: myOrders.filter((o) => o.status === "Pending").length,
    },
    {
      name: "Dispatched",
      value: myOrders.filter((o) => o.status === "Dispatched").length,
    },
    {
      name: "Delivered",
      value: myOrders.filter((o) => o.status === "Delivered").length,
    },
  ];

  const hasData = data.some((d) => d.value > 0);

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase tracking-wide text-slate-700">
          Orders by Status
        </CardTitle>
      </CardHeader>

      <CardContent className="h-[300px] flex flex-col justify-center">
        {!hasData ? (
          <p className="text-center text-slate-400 text-sm">
            No orders available
          </p>
        ) : (
          <>
            {/* Chart */}
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                  >
                    {data.map((item) => (
                      <Cell
                        key={item.name}
                        fill={COLORS[item.name as keyof typeof COLORS]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersByStatusChart;