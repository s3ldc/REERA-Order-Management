import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { BarChart3, Clock, DollarSign, CheckCircle } from "lucide-react";
import type { Doc } from "../../../../convex/_generated/dataModel";

interface Props {
  orders: Doc<"orders">[];
}

const StatsCards: React.FC<Props> = ({ orders }) => {
  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: BarChart3,
      iconBg: "bg-muted",
      textColor: "text-foreground",
    },
    {
      label: "Awaiting Action",
      value: orders.filter((o) => o.status === "Pending").length,
      icon: Clock,
      iconBg: "bg-amber-500/10",
      textColor: "text-amber-500",
    },
    {
      label: "Total Revenue (Paid)",
      value: orders.filter((o) => o.payment_status === "Paid").length,
      icon: DollarSign,
      iconBg: "bg-emerald-500/10",
      textColor: "text-emerald-500",
    },
    {
      label: "Completed Cycles",
      value: orders.filter((o) => o.status === "Delivered").length,
      icon: CheckCircle,
      iconBg: "bg-blue-500/10",
      textColor: "text-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <Card
          key={i}
          className="bg-card border border-border rounded-2xl overflow-hidden relative group"
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </p>

                <h3 className="text-3xl font-bold text-foreground mt-1">
                  {stat.value}
                </h3>
              </div>

              <div className={`p-3 ${stat.iconBg} rounded-xl`}>
                <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
