import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useOrderContext } from "../../context/OrderContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
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
  DollarSign,
  Users,
  Calendar,
  Filter,
  BarChart3,
  Search,
  ArrowRight,
  Clock
} from "lucide-react";
import UserManagementModal from "../UserManagementModal";
import { useToast } from "../../hooks/useToast";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { orders, updateOrderStatus, updatePaymentStatus } = useOrderContext();
  const { toast } = useToast();
  const [showUserModal, setShowUserModal] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    dateFrom: "",
    dateTo: "",
  });

  const filteredOrders =
    orders?.filter((order) => {
      if (filters.status !== "all" && order.status !== filters.status)
        return false;
      if (
        filters.dateFrom &&
        new Date(order.created) < new Date(filters.dateFrom)
      )
        return false;
      if (filters.dateTo && new Date(order.created) > new Date(filters.dateTo))
        return false;
      return true;
    }) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Package className="w-4 h-4 text-amber-500" />;
      case "Dispatched":
        return <Truck className="w-4 h-4 text-blue-500" />;
      case "Delivered":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      default:
        return <Package className="w-4 h-4 text-slate-400" />;
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
        title: "Status Synchronized",
        description: `Order successfully updated to ${nextStatus}`,
      });
    }
  };

  const handlePaymentToggle = async (
    orderId: string,
    currentStatus: string,
  ) => {
    const newStatus = currentStatus === "Paid" ? "Unpaid" : "Paid";
    await updatePaymentStatus(orderId, newStatus as any);
    toast({
      title: "Finance Record Updated",
      description: `Payment status toggled to ${newStatus}`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10 bg-[#FAFBFC] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            System Control
          </h1>
          <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" />
            Administrator: <span className="text-slate-900 font-bold">{user?.name || user?.email}</span>
          </p>
        </div>

        <Button
          onClick={() => setShowUserModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98] h-11 px-6 rounded-xl flex items-center gap-2"
        >
          <Users className="w-5 h-5" />
          Manage User Access
        </Button>
      </div>

      {/* High-Level Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Orders", value: orders?.length || 0, color: "bg-slate-900", icon: BarChart3, iconBg: "bg-slate-100" },
          { label: "Awaiting Action", value: orders?.filter(o => o.status === "Pending").length || 0, color: "bg-amber-500", icon: Clock, iconBg: "bg-amber-50" },
          { label: "Total Revenue (Paid)", value: orders?.filter(o => o.payment_status === "Paid").length || 0, color: "bg-emerald-500", icon: DollarSign, iconBg: "bg-emerald-50" },
          { label: "Completed Cycles", value: orders?.filter(o => o.status === "Delivered").length || 0, color: "bg-blue-500", icon: CheckCircle, iconBg: "bg-blue-50" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-2xl overflow-hidden group hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                </div>
                <div className={`p-3 ${stat.iconBg} rounded-xl transition-colors`}>
                  <stat.icon className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Advanced Filters */}
      <Card className="border-none shadow-sm bg-white rounded-2xl">
        <CardHeader className="border-b border-slate-50 py-4 px-8">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Filter className="w-4 h-4" />
                <span>Global Filters</span>
            </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">Fulfillment Status</Label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">Start Date</Label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="h-11 rounded-xl border-slate-200 bg-slate-50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">End Date</Label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="h-11 rounded-xl border-slate-200 bg-slate-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Management Table */}
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-100 p-8">
            <CardTitle className="text-xl font-bold text-slate-900">Master Order Registry</CardTitle>
            <CardDescription className="text-slate-400 font-medium">Cross-system oversight of all transactions</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No results match your current filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-widest">
                    <th className="py-5 px-8">Account / Product</th>
                    <th className="py-5 px-4 text-center">Qty</th>
                    <th className="py-5 px-4">Status</th>
                    <th className="py-5 px-4">Finance</th>
                    <th className="py-5 px-4">Creation Date</th>
                    <th className="py-5 px-8 text-right">Operational Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-slate-50/80 transition-all duration-200">
                      <td className="py-6 px-8">
                        <div className="font-bold text-slate-900">{order.spa_name}</div>
                        <div className="text-xs text-slate-400 mt-1 font-medium">{order.product_name}</div>
                      </td>
                      <td className="py-6 px-4 text-center font-bold text-slate-700">{order.quantity}</td>
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className="text-sm font-bold text-slate-700">{order.status}</span>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <Badge 
                          className={`rounded-full px-3 py-1 font-bold border-none shadow-sm ${
                            order.payment_status === "Paid" 
                              ? "bg-emerald-500 text-white" 
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {order.payment_status}
                        </Badge>
                      </td>
                      <td className="py-6 px-4 text-sm font-medium text-slate-500">
                        {new Date(order.created).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-6 px-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {order.status !== "Delivered" && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(order.id, order.status)}
                              className="h-9 px-4 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all font-bold border-none"
                            >
                              Move to {getNextStatus(order.status)}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePaymentToggle(order.id, order.payment_status)}
                            className="h-9 px-4 rounded-lg border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-all"
                          >
                            Toggle Payment
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

      {/* User Management Modal */}
      {showUserModal && (
        <UserManagementModal onClose={() => setShowUserModal(false)} />
      )}
    </div>
  );
};

export default AdminDashboard;