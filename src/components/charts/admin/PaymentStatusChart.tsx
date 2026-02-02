import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartCard } from "../../ui/chart-card";

interface Order {
  payment_status: "Paid" | "Unpaid";
}

interface Props {
  orders: Order[];
}

const COLORS = {
  Paid: "#22c55e",     // green
  Unpaid: "#ef4444",   // red
};

export default function PaymentStatusChart({ orders }: Props) {
  const data = [
    {
      name: "Paid",
      value: orders.filter((o) => o.payment_status === "Paid").length,
    },
    {
      name: "Unpaid",
      value: orders.filter((o) => o.payment_status === "Unpaid").length,
    },
  ];

  return (
    <ChartCard title="Payment Status">
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
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
      <div className="mt-4 flex justify-center gap-6 text-xs">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLORS[d.name as keyof typeof COLORS] }}
            />
            <span className="text-slate-600 font-medium">
              {d.name} ({d.value})
            </span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
