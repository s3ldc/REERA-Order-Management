import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Package,
  MapPin,
  Clock,
  Truck,
  CheckCircle,
  Calendar,
} from "lucide-react";

import type { Doc } from "../../../../convex/_generated/dataModel";
import MobileOrdersList from "./MobileOrdersList";

interface Props {
  orders: Doc<"orders">[];
  onTimeline: (order: Doc<"orders">) => void;
}

const OrdersTable: React.FC<Props> = ({ orders, onTimeline }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-5 h-5 text-amber-600" />;
      case "Dispatched":
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "Delivered":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      default:
        return <Package className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <Card className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <CardHeader className="bg-card border-b border-border p-8">
        <CardTitle className="text-xl font-bold text-foreground">
          Recent Activity
        </CardTitle>

        <CardDescription className="text-muted-foreground font-medium">
          Tracking your most recent order submissions
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {orders.length === 0 ? (
          <div className="text-center py-12 sm:py-24">
            <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-muted-foreground/40" />
            </div>

            <p className="text-foreground font-bold text-lg">No orders found</p>

            <p className="text-muted-foreground">
              Start by creating a new order above.
            </p>
          </div>
        ) : (
          <>
            {/* MOBILE */}
            <MobileOrdersList orders={orders} onTimeline={onTimeline} />

            {/* DESKTOP */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground uppercase text-[11px] font-bold tracking-widest">
                    <th className="py-5 px-8">Client & Location</th>
                    <th className="py-5 px-4">Product Specs</th>
                    <th className="py-5 px-4 text-center">Qty</th>
                    <th className="py-5 px-4">Status</th>
                    <th className="py-5 px-4">Payment</th>
                    <th className="py-5 px-8 text-right">Date Created</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="group hover:bg-muted/40 transition-all duration-200"
                    >
                      <td className="py-6 px-8">
                        <div className="font-bold text-foreground">
                          {order.spa_name}
                        </div>

                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-medium italic">
                          <MapPin className="w-3 h-3" />
                          {order.address}
                        </div>
                      </td>

                      <td className="py-6 px-4">
                        <div className="text-sm font-semibold text-foreground bg-muted rounded-md px-2.5 py-1 inline-flex items-center gap-2">
                          <Package className="w-3.5 h-3.5" />
                          {order.product_name}
                        </div>
                      </td>

                      <td className="py-6 px-4 text-center font-bold text-foreground">
                        {order.quantity}
                      </td>

                      <td className="py-6 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}

                          <span className="text-sm font-bold text-foreground">
                            {order.status}
                          </span>
                        </div>
                      </td>

                      <td className="py-6 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              order.payment_status === "Paid"
                                ? "bg-emerald-500"
                                : "bg-muted-foreground/40"
                            }`}
                          />

                          <span
                            className={`text-xs font-bold uppercase ${
                              order.payment_status === "Paid"
                                ? "text-emerald-500"
                                : "text-muted-foreground"
                            }`}
                          >
                            {order.payment_status}
                          </span>
                        </div>
                      </td>

                      <td className="py-6 px-8 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onTimeline(order)}
                            className="group flex items-center gap-2 text-foreground/80 hover:text-foreground hover:bg-muted/60 rounded-lg px-3"
                          >
                            <Calendar className="w-4 h-4" />
                            <span className="hidden group-hover:inline text-xs font-medium">
                              Timeline
                            </span>
                          </Button>

                          <div className="text-sm font-bold text-foreground whitespace-nowrap">
                            {new Date(order._creationTime).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersTable;
