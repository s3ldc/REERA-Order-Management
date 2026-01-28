import React from "react";
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
import { Package, Truck, CheckCircle, Clock, MapPin, ArrowRightCircle, LayoutDashboard } from "lucide-react";
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

  const handleStatusUpdate = async (orderId: string, currentStatus: string) => {
    const nextStatus = getNextStatus(currentStatus);
    if (nextStatus !== currentStatus) {
      await updateOrderStatus(orderId, nextStatus as any);
      toast({
        title: "Status Updated",
        description: `Order successfully moved to ${nextStatus}`,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10 bg-[#FAFBFC] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Logistics Overview
          </h1>
          <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-500" />
            Welcome back, <span className="text-slate-900 font-bold">{user?.name || user?.email}</span>
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Pending Orders", count: "Pending", color: "bg-amber-400", iconBg: "bg-amber-50", icon: Clock, textColor: "text-amber-600" },
          { label: "Active Dispatched", count: "Dispatched", color: "bg-blue-500", iconBg: "bg-blue-50", icon: Truck, textColor: "text-blue-600" },
          { label: "Total Delivered", count: "Delivered", color: "bg-emerald-500", iconBg: "bg-emerald-50", icon: CheckCircle, textColor: "text-emerald-600" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-2xl overflow-hidden relative group">
            <div className={`absolute top-0 left-0 w-1 h-full ${stat.color}`} />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-1">
                    {assignedOrders.filter((o) => o.status === stat.count).length}
                  </h3>
                </div>
                <div className={`p-3 ${stat.iconBg} rounded-xl group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orders Table */}
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-2xl overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100 p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">Delivery Pipeline</CardTitle>
              <CardDescription className="text-slate-400 font-medium">Manage and track your assigned deliveries</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {assignedOrders.length === 0 ? (
            <div className="text-center py-24">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-slate-200" />
              </div>
              <p className="text-slate-900 font-bold text-lg">No assignments found</p>
              <p className="text-slate-400">New orders will appear here once assigned.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-widest">
                    <th className="py-5 px-8">Destination (Spa)</th>
                    <th className="py-5 px-4">Inventory Details</th>
                    <th className="py-5 px-4">Current Status</th>
                    <th className="py-5 px-4">Payment</th>
                    <th className="py-5 px-4">Date Assigned</th>
                    <th className="py-5 px-8 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {assignedOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-slate-50/80 transition-all duration-200">
                      <td className="py-6 px-8">
                        <div className="font-bold text-slate-900">{order.spa_name}</div>
                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-medium">
                          <MapPin className="w-3 h-3 text-slate-300" /> {order.address}
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <div className="text-sm font-semibold text-slate-700 bg-slate-100 rounded-md px-2.5 py-1 inline-flex items-center gap-2">
                          <Package className="w-3.5 h-3.5" /> {order.product_name}
                          <span className="text-slate-400 font-normal ml-1">x{order.quantity}</span>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                            {getStatusIcon(order.status)}
                          </div>
                          <span className="text-sm font-bold text-slate-700">{order.status}</span>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <Badge 
                          variant="outline"
                          className={`rounded-full px-3 py-0.5 font-bold border-none text-[10px] uppercase tracking-tighter ${
                            order.payment_status === "Paid" 
                              ? "bg-emerald-100 text-emerald-700" 
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {order.payment_status}
                        </Badge>
                      </td>
                      <td className="py-6 px-4 text-sm font-medium text-slate-500">
                        {new Date(order.created).toLocaleDateString()}
                      </td>
                      <td className="py-6 px-8 text-right">
                        {order.status !== "Delivered" ? (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(order.id, order.status)}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100 rounded-lg h-9 px-4 font-bold transition-all hover:scale-105"
                          >
                            Mark {getNextStatus(order.status)}
                            <ArrowRightCircle className="w-4 h-4 ml-2" />
                          </Button>
                        ) : (
                          <div className="flex items-center justify-end text-emerald-500 gap-1 font-bold text-sm">
                            <CheckCircle className="w-4 h-4" /> Delivered
                          </div>
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