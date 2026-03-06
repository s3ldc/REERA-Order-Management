import React from "react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Package, Calendar as CalendarIcon } from "lucide-react";

import type { Doc, Id } from "../../../../convex/_generated/dataModel";

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

              <span className="text-xs font-bold">{order.status}</span>
            </div>

            {/* QUANTITY + PAYMENT */}
            <div className="flex justify-between items-center text-sm">
              <div className="font-bold">Qty: {order.quantity}</div>

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

            {/* FOOTER */}
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onTimeline(order)}
                className="flex items-center gap-2"
              >
                <CalendarIcon className="w-4 h-4" />
                <span className="text-xs">Timeline</span>
              </Button>

              <div className="text-xs font-bold">
                {new Date(order._creationTime).toLocaleDateString()}
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
