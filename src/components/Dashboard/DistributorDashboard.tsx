import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useOrderContext } from "../../context/OrderContext";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Package, Truck, CheckCircle } from "lucide-react";
import { useToast } from "../../hooks/useToast";

const DistributorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useOrderContext();
  const { toast } = useToast();

  const assignedOrders =
    orders?.filter((o) => o.distributor_id === user?.id) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Package className="w-4 h-4" />;
      case "Dispatched":
        return <Truck className="w-4 h-4" />;
      case "Delivered":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
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

  const handleStatusUpdate = async (orderId: string, currentStatus: string) => {
    const nextStatus = getNextStatus(currentStatus);
    if (nextStatus !== currentStatus) {
      await updateOrderStatus(orderId, nextStatus as any);
      toast({
        title: "Success",
        description: `Order status updated to ${nextStatus}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Distributor Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Orders assigned to you for delivery
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border border-yellow-200 bg-yellow-50/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">
              Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-700">
              {assignedOrders.filter((o) => o.status === "Pending").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-blue-200 bg-blue-50/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Dispatched</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">
              {assignedOrders.filter((o) => o.status === "Dispatched").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-green-200 bg-green-50/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">
              {assignedOrders.filter((o) => o.status === "Delivered").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card className="border-2 border-gray-200 shadow-md">
        <CardHeader className="bg-gray-50 rounded-t-lg">
          <CardTitle>Orders to Deliver</CardTitle>
          <CardDescription>
            Update delivery status for assigned orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assignedOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No orders assigned</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-sm text-gray-600">
                    <th className="py-2 px-3">Spa</th>
                    <th className="py-2 px-3">Product</th>
                    <th className="py-2 px-3">Qty</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Payment</th>
                    <th className="py-2 px-3">Created</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3 font-medium">
                        {order.spa_name}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-600">
                        {order.product_name}
                      </td>
                      <td className="py-2 px-3">{order.quantity}</td>
                      <td className="py-2 px-3">
                        <Badge
                          variant={
                            order.status === "Pending" ? "secondary" : "default"
                          }
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-2 px-3">
                        <Badge
                          variant={
                            order.payment_status === "Paid"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {order.payment_status}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-500">
                        {new Date(order.created).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-3 text-right">
                        {order.status !== "Delivered" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(order.id, order.status)
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
    </div>
  );
};

export default DistributorDashboard;
