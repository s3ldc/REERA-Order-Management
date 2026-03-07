import React from "react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Package,
  MapPin,
  Calendar,
  Clock,
  Truck,
  CheckCircle,
  ArrowRightCircle,
} from "lucide-react";

import type { Doc, Id } from "../../../../convex/_generated/dataModel";

interface Props {
  orders: Doc<"orders">[];
  onTimeline: (order: Doc<"orders">) => void;
  onMoveStatus: (orderId: Id<"orders">, status: any) => void;
}

const MobileOrdersList: React.FC<Props> = ({
  orders,
  onTimeline,
  onMoveStatus,
}) => {

  const getNextStatus = (status: any) => {
    if (status === "Pending") return "Dispatched";
    if (status === "Dispatched") return "Delivered";
    return status;
  };

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
    <div className="md:hidden space-y-3 p-4">
      {orders.map((order) => (
        <Card
          key={order._id}
          className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="p-4 space-y-3">

            {/* Top Row */}
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-foreground">
                  {order.spa_name}
                </div>

                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1 italic">
                  <MapPin className="w-3 h-3" />
                  {order.address}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                <span className="text-xs font-bold text-foreground">
                  {order.status}
                </span>
              </div>
            </div>

            {/* Product Badge */}
            <div className="text-sm font-semibold text-foreground bg-muted rounded-md px-2.5 py-1 inline-flex items-center gap-2">
              <Package className="w-3.5 h-3.5" />
              {order.product_name}
            </div>

            {/* Qty + Payment */}
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

            {/* Footer */}
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onTimeline(order)}
                className="flex items-center gap-2 text-foreground/80 hover:text-foreground hover:bg-muted/60 rounded-lg px-3"
              >
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium">Timeline</span>
              </Button>

              <div className="text-xs font-bold text-foreground">
                {new Date(order._creationTime).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            {/* Status Button */}
            {order.status !== "Delivered" && (
              <Button
                size="sm"
                onClick={() => onMoveStatus(order._id, order.status)}
                className="w-full bg-primary text-primary-foreground 
                           hover:opacity-90 shadow-lg shadow-primary/30
                           rounded-lg h-9 font-bold transition-all"
              >
                Mark {getNextStatus(order.status)}
                <ArrowRightCircle className="w-4 h-4 ml-2" />
              </Button>
            )}

          </div>
        </Card>
      ))}
    </div>
  );
};

export default MobileOrdersList;