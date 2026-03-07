import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";

import DashboardHeader from "./components/DashboardHeader";
import StatsCards from "./components/StatsCards";
import OrdersTable from "./components/OrdersTable";

import OrdersByStatusChart from "../../components/charts/distributor/OrdersByStatusChart";
import PaymentStatusChart from "../../components/charts/distributor/PaymentStatusChart";
import DeliveriesOverTimeChart from "../../components/charts/distributor/DeliveriesOverTimeChart";

import DistributorOrderTimelineDrawer from "../../components/orders/DistributorOrderTimelineDrawer";

import { useDistributorOrders } from "./hooks/useDistributorOrders";

import type { Doc, Id } from "../../../convex/_generated/dataModel";
import type { OrderStatus } from "./types";

const DistributorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { orders: assignedOrders, moveOrderStatus } = useDistributorOrders(
    user?._id as Id<"users">,
  );

  const [activeOrder, setActiveOrder] = useState<Doc<"orders"> | null>(null);

  const handleStatusUpdate = async (
    orderId: Id<"orders">,
    status: OrderStatus,
  ) => {
    const nextStatus = await moveOrderStatus(
      orderId,
      status,
      user!._id as Id<"users">,
      user?.role || "Distributor",
    );

    if (!nextStatus) return;

    toast({
      title: "Status Updated",
      description: `Order moved to ${nextStatus}`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-6 space-y-8 min-h-screen bg-background text-foreground">
      <DashboardHeader user={user} />

      <StatsCards orders={assignedOrders} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersByStatusChart />
        <PaymentStatusChart />
      </div>

      <DeliveriesOverTimeChart />

      {/* Orders Section */}
      <div className="space-y-4">
        {/* Mobile */}

        {/* Desktop */}
        <OrdersTable
          orders={assignedOrders}
          onTimeline={(o) => setActiveOrder(o)}
          onMoveStatus={handleStatusUpdate}
        />
      </div>

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
