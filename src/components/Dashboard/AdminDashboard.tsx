import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
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
  Filter,
  BarChart3,
  Search,
  ArrowRight,
  Clock,
  RotateCcw,
} from "lucide-react";
import UserManagementModal from "../UserManagementModal";
import { useToast } from "../../hooks/useToast";
import OrdersByStatusChart from "../charts/admin/OrdersByStatusChart";
import PaymentStatusChart from "../charts/admin/PaymentStatusChart";
import OrdersOverTimeChart from "../charts/admin/OrdersOverTimeChart";
// import OrdersByRoleChart from "../charts/admin/OrdersByRoleChart";
import OrderTimelineDrawer from "../orders/AdminOrderTimelineDrawer";
import { useMutation, useQuery } from "convex/react";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const orders = (useQuery(api.orders.getAllOrders) ?? []) as Doc<"orders">[];
  const updateOrderStatus = useMutation(api.orders.updateOrderStatus);
  const updatePaymentStatus = useMutation(api.orders.updatePaymentStatus);
  const { toast } = useToast();
  const [showUserModal, setShowUserModal] = useState(false);
  const [filters, setFilters] = useState<{
    status: string;
    dateFrom?: Date;
    dateTo?: Date;
  }>({
    status: "all",
  });
  const [activeOrder, setActiveOrder] = useState<Doc<"orders"> | null>(null);
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  type OrderStatus = "Pending" | "Dispatched" | "Delivered";
  type PaymentStatus = "Paid" | "Unpaid";

  const initialFilters = {
    status: "all",
    dateFrom: undefined,
    dateTo: undefined,
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  const filteredOrders =
    orders?.filter((order) => {
      if (filters.status !== "all" && order.status !== filters.status)
        return false;

      const orderDate = new Date(order._creationTime);

      if (filters.dateFrom && orderDate < filters.dateFrom) return false;

      if (filters.dateTo) {
        const endOfDay = new Date(filters.dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        if (orderDate > endOfDay) return false;
      }

      return true;
    }) || [];

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
    orderId: Id<"orders">,
    currentStatus: OrderStatus,
  ) => {
    const nextStatus = getNextStatus(currentStatus);
    if (nextStatus !== currentStatus) {
      await updateOrderStatus({
        orderId,
        status: nextStatus,
        actor_id: user?._id as Id<"users">,
        actor_role: user?.role || "Admin",
      });
      toast({
        title: "Status Synchronized",
        description: `Order successfully updated to ${nextStatus}`,
      });
    }
  };

  const handlePaymentToggle = async (
    orderId: Id<"orders">,
    currentStatus: PaymentStatus,
  ) => {
    const newStatus: PaymentStatus =
      currentStatus === "Paid" ? "Unpaid" : "Paid";

    await updatePaymentStatus({
      orderId,
      payment_status: newStatus,
      actor_id: user?._id as Id<"users">,
      actor_role: user?.role || "Admin",
    });

    toast({
      title: "Finance Record Updated",
      description: `Payment status toggled to ${newStatus}`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10 bg-background text-foreground min-h-screen">
      {/* Header Section */}
      <section id="overview">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-border">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            System Control
          </h1>
          <p className="text-muted-foreground font-medium mt-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" />
            Administrator:{" "}
            <span className="text-foreground font-bold">
              {user?.name || user?.email}
            </span>
          </p>
        </div>

        <Button
          onClick={() => setShowUserModal(true)}
          className="
    bg-primary 
    text-primary-foreground 
    hover:bg-primary/90
    shadow-lg
    shadow-primary/25
    transition-all 
    hover:scale-[1.02] 
    active:scale-[0.98] 
    h-11 
    px-6 
    rounded-xl 
    flex 
    items-center 
    gap-2
  "
        >
          <Users className="w-5 h-5" />
          Manage User Access
        </Button>
      </div>

      {/* High-Level Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Orders",
            value: orders?.length || 0,
            icon: BarChart3,
            iconBg: "bg-muted",
            textColor: "text-foreground",
          },
          {
            label: "Awaiting Action",
            value: orders?.filter((o) => o.status === "Pending").length || 0,
            icon: Clock,
            iconBg: "bg-amber-500/10",
            textColor: "text-amber-500",
          },
          {
            label: "Total Revenue (Paid)",
            value:
              orders?.filter((o) => o.payment_status === "Paid").length || 0,
            icon: DollarSign,
            textColor: "text-emerald-500",
            iconBg: "bg-emerald-500/10",
          },
          {
            label: "Completed Cycles",
            value: orders?.filter((o) => o.status === "Delivered").length || 0,
            textColor: "text-blue-500",
            icon: CheckCircle,
            iconBg: "bg-blue-500/10",
          },
        ].map((stat, i) => (
          <Card key={i} className="bg-card border border-border rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    {stat.label}
                  </p>
                  <h3 className="text-3xl font-bold text-foreground mt-1">
                    {stat.value}
                  </h3>
                </div>
                <div
                  className={`p-3 ${stat.iconBg} rounded-xl transition-colors`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      </section>

      {/* Charts Section */}
      <section id="analytics">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <OrdersByStatusChart orders={orders} />
        <PaymentStatusChart orders={orders} />
      </div>

      <div className="mt-6">
        <OrdersOverTimeChart orders={orders} />
        {/* <OrdersByRoleChart orders={orders} /> */}
      </div>
      </section>

      {/* Advanced Filters */}
      <section id="filters">
      <Card className="border border-border shadow-sm bg-card rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border py-5 px-8 bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground font-bold">
              <Filter className="w-4 h-4 text-indigo-500" />
              <span className="tracking-tight">Global Filters</span>
            </div>

            {/* CLEAR FILTER BUTTON */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-8 px-3 text-[11px] font-black uppercase tracking-widest 
             text-muted-foreground 
             hover:text-destructive hover:bg-destructive/10
             focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none
             rounded-lg transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-3 h-3" />
              Clear All
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Fulfillment Status
              </Label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full h-11 px-4 border border-border rounded-xl bg-muted text-sm font-medium text-foreground focus:ring-2 focus:ring-indigo-500 focus:bg-background outline-none transition-all cursor-pointer appearance-none"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Start Date
              </Label>

              <Popover open={fromOpen} onOpenChange={setFromOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-11 justify-between rounded-xl bg-muted border-border text-foreground font-medium"
                  >
                    {filters.dateFrom
                      ? format(filters.dateFrom, "dd-MM-yyyy")
                      : "dd-mm-yyyy"}
                    <CalendarIcon className="h-4 w-4 opacity-60" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0 bg-card border-border">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => {
                      setFilters({ ...filters, dateFrom: date });
                      setFromOpen(false); // ✅ CLOSES CALENDAR
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                End Date
              </Label>

              <Popover open={toOpen} onOpenChange={setToOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-11 justify-between rounded-xl bg-muted border-border text-foreground font-medium"
                  >
                    {filters.dateTo
                      ? format(filters.dateTo, "dd-MM-yyyy")
                      : "dd-mm-yyyy"}
                    <CalendarIcon className="h-4 w-4 opacity-60" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0 bg-card border-border">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => {
                      setFilters({ ...filters, dateTo: date });
                      setToOpen(false); // ✅ CLOSES
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>
      </section>

      {/* Order Management Table */}
      <section id="orders">
      <Card className="border border-border shadow-sm bg-card rounded-2xl overflow-hidden">
        <CardHeader className="bg-card border-b border-border p-8">
          <CardTitle className="text-xl font-bold text-foreground">
            Master Order Registry
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            Cross-system oversight of all transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">
                No results match your current filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground uppercase text-[11px] font-bold tracking-widest">
                    <th className="py-5 px-8">Account / Product</th>
                    <th className="py-5 px-4 text-center">Qty</th>
                    <th className="py-5 px-4">Status</th>
                    <th className="py-5 px-4">Payment</th>
                    <th className="py-5 px-4">Creation Date</th>
                    <th className="py-5 px-8 text-right">
                      Operational Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="group hover:bg-muted/80 transition-all duration-200"
                    >
                      <td className="py-6 px-8">
                        <div className="font-bold text-foreground">
                          {order.spa_name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 font-medium">
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
                                : "bg-muted-foreground/40"
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
                          undefined,
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
                            title="View order timeline"
                            size="sm"
                            variant="ghost"
                            onClick={() => setActiveOrder(order)}
                            className="group flex items-center gap-1 text-foreground/80 hover:text-foreground hover:bg-muted/60 rounded-lg px-3"
                          >
                            <CalendarIcon className="w-4 h-4" />
                            <span className="hidden group-hover:inline text-xs font-medium">
                              Timeline
                            </span>
                          </Button>
                          {order.status !== "Delivered" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleStatusUpdate(order._id, order.status)
                              }
                              className="h-9 px-4 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all font-bold border-none"
                            >
                              Move to {getNextStatus(order.status)}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handlePaymentToggle(
                                order._id,
                                order.payment_status,
                              )
                            }
                            className={`h-9 px-4 rounded-lg font-bold transition-all border ${
                              order.payment_status === "Paid"
                                ? "border-emerald-500/40 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20"
                                : "border-muted-foreground/30 text-muted-foreground bg-muted/30 hover:bg-muted/50"
                            }`}
                          >
                            {order.payment_status === "Paid"
                              ? "Mark Unpaid"
                              : "Mark Paid"}
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
      </section>

      {/* User Management Modal */}
      {showUserModal && (
        <UserManagementModal onClose={() => setShowUserModal(false)} />
      )}

      {activeOrder && (
        <OrderTimelineDrawer
          order={activeOrder}
          onClose={() => setActiveOrder(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
