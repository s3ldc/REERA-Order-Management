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
  Paid: "#22c55e",    // green
  Unpaid: "#ef4444",  // red
};

const PaymentStatusChart = () => {
  const { orders } = useOrderContext();
  const { user } = useAuth();

  const myOrders =
    orders?.filter((o) => o.salesperson_id === user?.id) || [];

  const paid = myOrders.filter(o => o.payment_status === "Paid").length;
  const unpaid = myOrders.filter(o => o.payment_status === "Unpaid").length;

  const data = [
    { name: "Paid", value: paid },
    { name: "Unpaid", value: unpaid },
  ];

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase tracking-wide text-slate-700">
          Payment Status
        </CardTitle>
      </CardHeader>

      <CardContent className="h-[300px] flex flex-col justify-center">
        {myOrders.length === 0 ? (
          <p className="text-center text-slate-400 text-sm">
            No payment data available
          </p>
        ) : (
          <>
            {/* Chart */}
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentStatusChart;