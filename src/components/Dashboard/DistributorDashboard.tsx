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
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  ArrowRightCircle,
  Calendar,
} from "lucide-react";
import { useToast } from "../../hooks/useToast";
import OrdersByStatusChart from "../charts/distributor/OrdersByStatusChart";
import PaymentStatusChart from "../charts/distributor/PaymentStatusChart";
import DeliveriesOverTimeChart from "../charts/distributor/DeliveriesOverTimeChart";
import DistributorOrderTimelineDrawer from "../orders/DistributorOrderTimelineDrawer";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const DistributorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const updateOrderStatus = useMutation(api.orders.updateOrderStatus);

  const assignedOrders =
    useQuery(
      api.orders.getOrdersByDistributor,
      user ? { distributor_id: user.id as any } : "skip",
    ) || [];

  const [activeOrder, setActiveOrder] = React.useState<any | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-5 h-5 text-amber-600" />;
      case "Dispatched":
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "Delivered":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      default:
        return <Package className="w-5 h-5 text-slate-500" />;
    }
  };

  const getNextStatus = (currentStatus: string) => {
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
    currentStatus: string,
  ) => {
    const nextStatus = getNextStatus(currentStatus);

    if (nextStatus !== currentStatus) {
      await updateOrderStatus({
        orderId,
        status: nextStatus,
      });

      toast({
        title: "Status Updated",
        description: `Order moved to ${nextStatus}`,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10 bg-[#FAFBFC] min-h-screen">
      {/* Header */}
      <div className="pb-2 border-b border-gray-100">
        <h1 className="text-4xl font-extrabold text-slate-900">
          Logistics Overview
        </h1>
        <p className="text-slate-500 mt-2">
          Welcome back,{" "}
          <span className="font-bold">
            {user?.name || user?.email}
          </span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Pending", "Dispatched", "Delivered"].map((status) => (
          <Card key={status} className="bg-white rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-slate-500 uppercase">
                {status} Orders
              </h3>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {
                  assignedOrders.filter((o) => o.status === status)
                    .length
                }
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersByStatusChart />
        <PaymentStatusChart />
      </div>

      <DeliveriesOverTimeChart />

      {/* Orders Table */}
      <Card className="bg-white rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Delivery Pipeline</CardTitle>
          <CardDescription>
            Manage assigned deliveries
          </CardDescription>
        </CardHeader>

        <CardContent>
          {assignedOrders.length === 0 ? (
            <p className="text-slate-400 py-10 text-center">
              No assignments found
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs uppercase text-slate-500">
                    <th className="py-3">Destination</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedOrders.map((order) => (
                    <tr key={order._id}>
                      <td>{order.spa_name}</td>
                      <td>{order.product_name}</td>
                      <td>{order.quantity}</td>
                      <td>{order.status}</td>
                      <td>
                        {new Date(
                          order._creationTime,
                        ).toLocaleDateString()}
                      </td>
                      <td className="text-right">
                        {order.status !== "Delivered" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(
                                order._id,
                                order.status,
                              )
                            }
                          >
                            Mark {getNextStatus(order.status)}
                          </Button>
                        )}
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