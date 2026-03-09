import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { ShoppingBag, Clock, CheckCircle2 } from "lucide-react";
import type { Doc } from "../../../../convex/_generated/dataModel";

interface Props {
  orders: Doc<"orders">[];
}

const StatsCards: React.FC<Props> = ({ orders }) => {
  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "bg-primary",
      iconBg: "bg-primary/10",
      textColor: "text-primary",
    },
    {
      label: "Pending Fulfillment",
      value: orders.filter((o) => o.status === "Pending").length,
      icon: Clock,
      color: "bg-amber-500",
      iconBg: "bg-amber-500/10",
      textColor: "text-amber-500",
    },
    {
      label: "Payments Received",
      value: orders.filter((o) => o.payment_status === "Paid").length,
      icon: CheckCircle2,
      color: "bg-emerald-500",
      iconBg: "bg-emerald-500/10",
      textColor: "text-emerald-500",
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
                    {stat.value}
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