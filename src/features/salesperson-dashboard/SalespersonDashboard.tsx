import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";

import DashboardHeader from "./components/DashboardHeader";
import StatsCards from "./components/StatsCards";
import OrdersTable from "./components/OrdersTable";

import OrdersByStatusChart from "../../components/charts/salesperson/OrdersByStatusChart";
import PaymentStatusChart from "../../components/charts/salesperson/PaymentStatusChart";
import OrdersOverTimeChart from "../../components/charts/salesperson/OrdersOverTimeChart";

import SalespersonOrderTimelineDrawer from "../../components/orders/SalespersonOrderTimelineDrawer";

import { useSalespersonOrders } from "./hooks/useSalespersonOrders";
import { useCreateOrder } from "./hooks/useCreateOrder";
import CreateOrderModal from "./components/CreateOrderModal";

const SalespersonDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Orders hook
  const { orders: myOrders, distributors } = useSalespersonOrders(user?._id);

  // Create order hook
  const { createNewOrder } = useCreateOrder();

  const [showForm, setShowForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    spa_name: "",
    address: "",
    product_name: "",
    quantity: 1,
    distributor_id: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createNewOrder({
        ...formData,
        distributor_id: formData.distributor_id as any,
        actor_id: user._id,
        actor_role: user.role,
      });

      setFormData({
        spa_name: "",
        address: "",
        product_name: "",
        quantity: 1,
        distributor_id: "",
      });

      setShowForm(false);

      toast({
        title: "Success",
        description: "Order created successfully",
      });
    } catch (err: any) {
      toast({
        title: "Order Creation Failed",
        description: err?.message || "Backend rejected order",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 space-y-8 min-h-screen text-foreground">
      {/* Header */}
      <DashboardHeader user={user} onCreateOrder={() => setShowForm(true)} />

      {/* Stats */}
      <StatsCards orders={myOrders} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <OrdersByStatusChart />
        <PaymentStatusChart />
      </div>

      <div className="mt-6">
        <OrdersOverTimeChart />
      </div>

      {/* Orders Table */}
      <OrdersTable
        orders={myOrders}
        onTimeline={(order) => setSelectedOrder(order)}
      />

      {showForm && (
        <CreateOrderModal
          distributors={distributors}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Timeline Drawer */}
      {selectedOrder && (
        <SalespersonOrderTimelineDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default SalespersonDashboard;
