import React from "react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Package,
  Calendar as CalendarIcon,
  Truck,
  CheckCircle,
} from "lucide-react";

import type { Doc, Id } from "../../../../convex/_generated/dataModel";
import { OrderStatus } from "../utils/orderHelpers";

interface Props {
  orders: Doc<"orders">[];
  onTimeline: (order: Doc<"orders">) => void;
  onMoveStatus: (orderId: Id<"orders">, status: any) => void;
  onTogglePayment: (orderId: Id<"orders">, payment: any) => void;
}

const MobileOrdersList: React.FC<Props> = ({
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

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return <Package className="w-5 h-5 text-amber-600" />;
      case "Dispatched":
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "Delivered":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      default:
        return <Package className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="md:hidden space-y-3 p-4">
      {orders.map((order) => (
        <Card
          key={order._id}
          className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="p-4 space-y-3">
            {/* TOP ROW */}
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-foreground">
                  {order.spa_name}
                </div>

                <div className="text-xs text-muted-foreground italic mt-1">
                  {order.product_name}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                <span className="text-xs font-bold text-foreground">
                  {order.status}
                </span>
              </div>
            </div>

            {/* QUANTITY + PAYMENT */}
            <div className="flex justify-between items-center text-sm">
              <div className="font-bold text-foreground">
                Qty: {order.quantity}
              </div>

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
            </div>

            {/* FOOTER */}
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onTimeline(order)}
                className="flex items-center gap-2 text-foreground/80 hover:text-foreground hover:bg-muted/60 rounded-lg px-3"
              >
                <CalendarIcon className="w-4 h-4" />
                <span className="text-xs font-medium">Timeline</span>
              </Button>

              <div className="text-xs font-bold text-foreground whitespace-nowrap">
                {new Date(order._creationTime).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-2 pt-2">
              {order.status !== "Delivered" && (
                <Button
                  size="sm"
                  onClick={() => onMoveStatus(order._id, order.status)}
                  className="w-full bg-primary text-primary-foreground rounded-lg"
                >
                  Move to {getNextStatus(order.status)}
                </Button>
              )}

              <Button
                size="sm"
                variant="outline"
                onClick={() => onTogglePayment(order._id, order.payment_status)}
                className={`h-9 px-4 rounded-lg font-bold transition-all border ${
                  order.payment_status === "Paid"
                    ? "border-emerald-500/40 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20"
                    : "border-muted-foreground/30 text-muted-foreground bg-muted/30 hover:bg-muted/50"
                }`}
              >
                {order.payment_status === "Paid" ? "Mark Unpaid" : "Mark Paid"}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MobileOrdersList;
