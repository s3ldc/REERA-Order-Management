import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Package, Calendar as CalendarIcon } from "lucide-react";

import type { Doc, Id } from "../../../../convex/_generated/dataModel";

interface Props {
  orders: Doc<"orders">[];
  onTimeline: (order: Doc<"orders">) => void;
  onMoveStatus: (orderId: Id<"orders">, status: any) => void;
  onTogglePayment: (orderId: Id<"orders">, payment: any) => void;
}

const OrdersTable: React.FC<Props> = ({
  orders,
  onTimeline,
  onMoveStatus,
  onTogglePayment,
}) => {
  const getNextStatus = (status: any) => {
    if (status === "Pending") return "Dispatched";
    if (status === "Dispatched") return "Delivered";
    return status;
  };

  const getStatusIcon = (status: any) => {
    if (status === "Pending")
      return <Package className="w-5 h-5 text-amber-600" />;
    if (status === "Dispatched")
      return <Package className="w-5 h-5 text-blue-600" />;
    if (status === "Delivered")
      return <Package className="w-5 h-5 text-emerald-600" />;
    return <Package className="w-5 h-5 text-muted-foreground" />;
  };

  return (
    <Card className="border border-border shadow-sm bg-card rounded-2xl overflow-hidden">
      <CardHeader className="bg-card border-b border-border p-8">
        <CardTitle className="text-xl font-bold text-foreground">
          Master Order Registry
        </CardTitle>

        <CardDescription className="text-muted-foreground font-medium">
          Cross-system oversight of all transactions
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              No results match your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground uppercase text-[11px] font-bold tracking-widest">
                  <th className="py-5 px-8">Account / Product</th>
                  <th className="py-5 px-4 text-center">Qty</th>
                  <th className="py-5 px-4">Status</th>
                  <th className="py-5 px-4">Payment</th>
                  <th className="py-5 px-4">Creation Date</th>
                  <th className="py-5 px-8 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-muted/80 transition-all"
                  >
                    <td className="py-6 px-8">
                      <div className="font-bold text-foreground">
                        {order.spa_name}
                      </div>

                      <div className="text-xs text-muted-foreground mt-1">
                        {order.product_name}
                      </div>
                    </td>

                    <td className="py-6 px-4 text-center font-bold">
                      {order.quantity}
                    </td>

                    <td className="py-6 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className="font-bold">{order.status}</span>
                      </div>
                    </td>

                    <td className="py-6 px-4">
                      <span
                        className={`text-xs font-bold uppercase
                        ${
                          order.payment_status === "Paid"
                            ? "text-emerald-500"
                            : "text-muted-foreground"
                        }
                      `}
                      >
                        {order.payment_status}
                      </span>
                    </td>

                    <td className="py-6 px-4 font-bold">
                      {new Date(order._creationTime).toLocaleDateString()}
                    </td>

                    <td className="py-6 px-8 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onTimeline(order)}
                        >
                          <CalendarIcon className="w-4 h-4" />
                        </Button>

                        {order.status !== "Delivered" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              onMoveStatus(order._id, order.status)
                            }
                            className="bg-primary/10 text-primary"
                          >
                            Move to {getNextStatus(order.status)}
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            onTogglePayment(order._id, order.payment_status)
                          }
                        >
                          {order.payment_status === "Paid"
                            ? "Mark Unpaid"
                            : "Mark Paid"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersTable;
