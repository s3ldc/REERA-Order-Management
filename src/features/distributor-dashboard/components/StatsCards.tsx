import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Clock, Truck, CheckCircle } from "lucide-react";
import type { Doc } from "../../../../convex/_generated/dataModel";

interface Props {
  orders: Doc<"orders">[];
}

const StatsCards: React.FC<Props> = ({ orders }) => {
  const stats = [
    {
      label: "Pending Orders",
      count: "Pending",
      color: "bg-amber-500",
      iconBg: "bg-amber-100 dark:bg-amber-900/40",
      icon: Clock,
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Active Dispatched",
      count: "Dispatched",
      color: "bg-blue-500",
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
      icon: Truck,
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Total Delivered",
      count: "Delivered",
      color: "bg-emerald-500",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
      icon: CheckCircle,
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;

        return (
          <Card
            key={i}
            className="bg-card border border-border rounded-2xl overflow-hidden relative group"
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${stat.color}`} />

            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </p>

                  <h3 className="text-3xl font-bold text-foreground mt-1">
                    {orders.filter((o) => o.status === stat.count).length}
                  </h3>
                </div>

                <div
                  className={`p-3 ${stat.iconBg} rounded-xl group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;