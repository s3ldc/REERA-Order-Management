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
import type { Order } from "../../context/OrderContext";

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

  const [activeOrder, setActiveOrder] = React.useState<Order | null>(null);

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
            Welcome back,{" "}
            <span className="text-slate-900 font-bold">
              {user?.name || user?.email}
            </span>
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Pending Orders",
            count: "Pending",
            color: "bg-amber-400",
            iconBg: "bg-amber-50",
            icon: Clock,
            textColor: "text-amber-600",
          },
          {
            label: "Active Dispatched",
            count: "Dispatched",
            color: "bg-blue-500",
            iconBg: "bg-blue-50",
            icon: Truck,
            textColor: "text-blue-600",
          },
          {
            label: "Total Delivered",
            count: "Delivered",
            color: "bg-emerald-500",
            iconBg: "bg-emerald-50",
            icon: CheckCircle,
            textColor: "text-emerald-600",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-2xl overflow-hidden relative group"
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${stat.color}`} />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-1">
                    {
                      assignedOrders.filter((o) => o.status === stat.count)
                        .length
                    }
                  </h3>
                </div>
                <div
                  className={`p-3 ${stat.iconBg} rounded-xl group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
      <Card className="border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-10 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 rounded-2xl"><Boxes className="w-6 h-6 text-white" /></div>
            <div>
                <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Master Order Registry</CardTitle>
                <CardDescription className="text-slate-400 font-medium mt-1">Cross-system oversight of all transactions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {assignedOrders.length === 0 ? (
            <div className="py-32 text-center">
              <Package className="w-16 h-16 text-slate-100 mx-auto mb-4" />
              <p className="text-slate-400 font-bold">No active shipments in your queue</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    <th className="py-6 px-10 text-left">Destination (Spa)</th>
                    <th className="py-6 px-6 text-left">Product Details</th>
                    {/* NEW COLUMN HEADER */}
                    <th className="py-6 px-6 text-center">QTY</th>
                    <th className="py-6 px-6 text-left">Current Status</th>
                    <th className="py-6 px-6 text-left">Finance</th>
                    <th className="py-6 px-6 text-left">Date Assigned</th>
                    <th className="py-6 px-10 text-right pr-12">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {assignedOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-slate-50/40 transition-colors">
                      <td className="py-8 px-10">
                        <p className="font-black text-slate-900 leading-none mb-1.5">{order.spa_name}</p>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 italic">
                          <MapPin className="w-3 h-3 text-slate-300" /> {order.address}
                        </div>
                      </td>
                      
                      <td className="py-8 px-6">
                        <div className="text-sm font-semibold text-slate-700 bg-slate-100 rounded-md px-2.5 py-1.5 inline-flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-slate-400" />
                          {order.product_name}
                        </div>
                      </td>

                      {/* NEW QUANTITY COLUMN */}
                      <td className="py-8 px-6 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="text-lg font-black text-slate-900">{order.quantity}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Units</span>
                        </div>
                      </td>

                      <td className="py-8 px-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                             {getStatusIcon(order.status)}
                          </div>
                          <span className="text-sm font-black text-slate-700">{order.status}</span>
                        </div>
                      </td>

                      <td className="py-8 px-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${order.payment_status === "Paid" ? "bg-emerald-500" : "bg-slate-300"}`} />
                          <span className={`text-[10px] font-black uppercase tracking-tight ${
                            order.payment_status === "Paid" ? "text-emerald-600" : "text-slate-400"
                          }`}>
                            {order.payment_status}
                          </span>
                        </div>
                      </td>

                      <td className="py-8 px-6">
                        <div className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">
                          {new Date(order.created).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric"
                          })}
                        </div>
                      </td>

                      <td className="py-8 px-10 text-right pr-12">
                        <div className="flex items-center justify-end gap-3">
                          <Button variant="outline" size="icon" onClick={() => setActiveOrder(order)} className="rounded-xl h-10 w-10 hover:bg-white hover:border-slate-200">
                            <Calendar className="w-4 h-4 text-slate-400" />
                          </Button>

                          {order.status !== "Delivered" ? (
                            <Button 
                              size="sm" 
                              onClick={() => handleStatusUpdate(order.id, order.status)} 
                              className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/10 rounded-xl h-10 px-6 font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                            >
                              Ship To {getNextStatus(order.status)}
                              <ArrowRightCircle className="w-3.5 h-3.5 ml-2" />
                            </Button>
                          ) : (
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest border border-emerald-100/50">
                              <CheckCircle className="w-3.5 h-3.5" /> Order Complete
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
