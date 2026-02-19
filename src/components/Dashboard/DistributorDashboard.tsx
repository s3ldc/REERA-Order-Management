import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  ArrowRightCircle,
  LayoutDashboard,
} from "lucide-react";
import { useToast } from "../../hooks/useToast";
import OrdersByStatusChart from "../charts/distributor/OrdersByStatusChart";
import PaymentStatusChart from "../charts/distributor/PaymentStatusChart";
import DeliveriesOverTimeChart from "../charts/distributor/DeliveriesOverTimeChart";
import { Calendar } from "lucide-react";
import DistributorOrderTimelineDrawer from "../orders/DistributorOrderTimelineDrawer";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";

const DistributorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const updateOrderStatus = useMutation(api.orders.updateOrderStatus);
  type OrderStatus = "Pending" | "Dispatched" | "Delivered";

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

  const assignedOrders =
    useQuery(
      api.orders.getOrdersByDistributor,
      user ? { distributor_id: user._id as Id<"users"> } : "skip",
    ) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
  return <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
case "Dispatched":
  return <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
case "Delivered":
  return <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  const [activeOrder, setActiveOrder] = React.useState<Doc<"orders"> | null>(
    null,
  );

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus => {
    switch (currentStatus) {
      case "Pending":
        return "Dispatched";
      case "Dispatched":
        return "Delivered";
      default:
        return currentStatus;
    }
  };

  const handleStatusUpdate = async (
    orderId: any,
    currentStatus: OrderStatus,
  ) => {
    const nextStatus = getNextStatus(currentStatus);

    if (nextStatus !== currentStatus) {
      await updateOrderStatus({
        orderId,
        status: nextStatus,
        actor_id: user?._id as Id<"users">,
        actor_role: user?.role || "Distributor",
      });

      toast({
        title: "Status Updated",
        description: `Order moved to ${nextStatus}`,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10 bg-background text-foreground min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-border">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Logistics Overview
          </h1>
          <p className="text-muted-foreground font-medium mt-2 flex items-center gap-2">
            <Truck className="w-4 h-4 text-primary" />
            Welcome back,{" "}
            <span className="text-foreground font-bold">
              {user?.name || user?.email}
            </span>
          </p>
        </div>
      </div>

      {/* Stats Cards */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;

          return (
            <Card
              key={i}
              className="bg-card border border-border rounded-2xl overflow-hidden relative group"
            >
              <div
                className={`absolute top-0 left-0 w-1 h-full ${stat.color}`}
              />

              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      {stat.label}
                    </p>

                    <h3 className="text-3xl font-bold text-foreground mt-1">
                      {
                        assignedOrders.filter((o) => o.status === stat.count)
                          .length
                      }
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

      {/* Charts Section */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersByStatusChart />
        <PaymentStatusChart />
      </div>
      <div className="mt-6">
        <DeliveriesOverTimeChart />
      </div>

      {/* Orders Table */}
      <Card className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <CardHeader className="bg-card border-b border-border p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                Delivery Pipeline
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium">
                Manage and track your assigned deliveries
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {assignedOrders.length === 0 ? (
            <div className="text-center py-24">
              <Package className="w-10 h-10 text-muted-foreground/40" />
              <p className="text-foreground font-bold text-lg">
                No assignments found
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground uppercase text-[11px] font-bold tracking-widest">
                    <th className="py-5 px-8">Destination (Spa)</th>
                    <th className="py-5 px-4">Product Specs</th>

                    {/* NEW COLUMN HEADER */}
                    <th className="py-5 px-4 text-center">QTY</th>
                    <th className="py-5 px-4">Status</th>
                    <th className="py-5 px-4">Payment</th>
                    <th className="py-5 px-4">Date Assigned</th>
                    <th className="py-5 px-8 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {assignedOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="group hover:bg-muted/40 transition-all duration-200"
                    >
                      <td className="py-6 px-8">
                        <div className="font-bold text-foreground">
                          {order.spa_name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-medium italic">
                          <MapPin className="w-3 h-3" /> {order.address}
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <div className="text-sm font-semibold text-foreground bg-muted rounded-md px-2.5 py-1 inline-flex items-center gap-2">
                          <Package className="w-3.5 h-3.5" />{" "}
                          {order.product_name}
                        </div>
                      </td>

                      {/* NEW SEPARATE QUANTITY COLUMN */}
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
                        {new Date(order._creationTime).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </td>
                      <td className="py-6 px-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setActiveOrder(order as any)}
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
                              onClick={() =>
                                handleStatusUpdate(order._id, order.status)
                              }
                              className="bg-primary text-primary-foreground 
               hover:opacity-90
               shadow-lg shadow-primary/30
               rounded-lg h-9 px-4 font-bold transition-all"
                            >
                              Mark {getNextStatus(order.status)}
                              <ArrowRightCircle className="w-4 h-4 ml-2" />
                            </Button>
                          ) : (
                            <div className="flex items-center justify-end text-emerald-500 gap-1 font-bold text-sm">
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
          )}
        </CardContent>
      </Card>
      {activeOrder && (
        <DistributorOrderTimelineDrawer
          order={activeOrder}
          onClose={() => setActiveOrder(null)}
        />
      )}
    </div>
  );
};
export default DistributorDashboard;
