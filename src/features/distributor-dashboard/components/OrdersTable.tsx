import React from "react";
import { Button } from "../../../components/ui/button";
import { Package, MapPin, CheckCircle, Truck, Clock, Calendar } from "lucide-react";
import type { Doc, Id } from "../../../../convex/_generated/dataModel";

interface Props {
  orders: Doc<"orders">[];
  onTimeline: (order: Doc<"orders">) => void;
  onMoveStatus: (orderId: Id<"orders">, status: any) => void;
}

const OrdersTable: React.FC<Props> = ({
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
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-muted/40 text-muted-foreground uppercase text-[11px] font-bold tracking-widest">
            <th className="py-5 px-8">Destination (Spa)</th>
            <th className="py-5 px-4">Product</th>
            <th className="py-5 px-4 text-center">Qty</th>
            <th className="py-5 px-4">Status</th>
            <th className="py-5 px-4">Payment</th>
            <th className="py-5 px-4">Date Assigned</th>
            <th className="py-5 px-8 text-right">Action</th>
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
                        : "bg-muted-foreground/30"
                    }`}
                  />

                  <span
                    className={`text-xs font-bold uppercase ${
                      order.payment_status === "Paid"
                        ? "text-emerald-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {order.payment_status}
                  </span>
                </div>
              </td>

              <td className="py-6 px-4 text-sm font-bold text-foreground">
                {new Date(order._creationTime).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>

              <td className="py-6 px-8 text-right">
                <div className="flex items-center justify-end gap-2">

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onTimeline(order)}
                    className="group flex items-center gap-1 text-foreground/80 hover:text-foreground hover:bg-muted/60 rounded-lg px-3"
                  >
                    <Calendar className="w-4 h-4" />
                    <span className="hidden group-hover:inline text-xs font-medium">
                      Timeline
                    </span>
                  </Button>

                  {order.status !== "Delivered" ? (
                    <Button
                      size="sm"
                      onClick={() => onMoveStatus(order._id, order.status)}
                      className="bg-primary text-primary-foreground 
                                 hover:opacity-90
                                 shadow-lg shadow-primary/30
                                 rounded-lg h-9 px-4 font-bold transition-all"
                    >
                      Mark {getNextStatus(order.status)}
                    </Button>
                  ) : (
                    <div className="flex items-center text-emerald-500 gap-1 font-bold text-sm">
                      <CheckCircle className="w-4 h-4" /> Delivered
                    </div>
                  )}

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;