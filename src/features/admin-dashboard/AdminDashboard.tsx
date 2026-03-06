import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import { useAdminOrders } from "./hooks/useAdminOrders";

import DashboardHeader from "./components/DashboardHeader";
import StatsCards from "./components/StatsCards";
import FiltersPanel from "./components/FiltersPanel";
import OrdersTable from "./components/OrdersTable";
import MobileOrdersList from "./components/MobileOrdersList";

import OrdersByStatusChart from "../../components/charts/admin/OrdersByStatusChart";
import PaymentStatusChart from "../../components/charts/admin/PaymentStatusChart";
import OrdersOverTimeChart from "../../components/charts/admin/OrdersOverTimeChart";

import UserManagementModal from "../../components/UserManagementModal";
import OrderTimelineDrawer from "../../components/orders/AdminOrderTimelineDrawer";

import type { Doc } from "../../../convex/_generated/dataModel";
import type { Id } from "../../../convex/_generated/dataModel";

import { useToast } from "../../hooks/useToast";

import type { OrderStatus, PaymentStatus } from "./utils/orderHelpers";
import type { Filters } from "./types";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { orders, moveOrderStatus, togglePayment } = useAdminOrders();

  const [filters, setFilters] = useState<Filters>({
    status: "all",
  });

  const [showUserModal, setShowUserModal] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Doc<"orders"> | null>(null);

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

  const handleMoveStatus = async (
    orderId: Id<"orders">,
    status: OrderStatus,
  ) => {
    await moveOrderStatus(
      orderId,
      status,
      user!._id as Id<"users">,
      user?.role || "Admin",
    );

    toast({
      title: "Status Updated",
      description: "Order moved to next stage",
    });
  };

  const handleTogglePayment = async (
    orderId: Id<"orders">,
    payment: PaymentStatus,
  ) => {
    await togglePayment(
      orderId,
      payment,
      user!._id as Id<"users">,
      user?.role || "Admin",
    );

    toast({
      title: "Payment Updated",
      description: "Payment status updated successfully",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <DashboardHeader
        user={user}
        onManageUsers={() => setShowUserModal(true)}
      />

      <StatsCards orders={orders} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OrdersByStatusChart orders={orders} />
        <PaymentStatusChart orders={orders} />
      </div>

      <OrdersOverTimeChart orders={orders} />

      <FiltersPanel filters={filters} setFilters={setFilters} />

      <MobileOrdersList
        orders={filteredOrders}
        onTimeline={(o) => setActiveOrder(o)}
        onMoveStatus={handleMoveStatus}
        onTogglePayment={handleTogglePayment}
      />

      <OrdersTable
        orders={filteredOrders}
        onTimeline={(o) => setActiveOrder(o)}
        onMoveStatus={handleMoveStatus}
        onTogglePayment={handleTogglePayment}
      />

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
