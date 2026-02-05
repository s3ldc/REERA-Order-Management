import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import pb from "../lib/pocketbase";
import { useAuth } from "./AuthContext";
import { logOrderEvent } from "@/lib/logOrderEvent";

/* -------------------- Types -------------------- */

export interface Order {
  id: string;
  spa_name: string;
  address: string;
  product_name: string;
  quantity: number;
  status: "Pending" | "Dispatched" | "Delivered";
  payment_status: "Unpaid" | "Paid";
  salesperson_id: string;
  distributor_id?: string;
  created: string;

  expand?: {
    distributor_id?: {
      id: string;
      name?: string;
      email?: string;
    };
    salesperson_id?: {
      id: string;
      name?: string;
      email?: string;
    };
  };
}

interface OrderContextType {
  orders: Order[];
  createOrder: (order: Omit<Order, "id" | "created">) => Promise<void>;
  updateOrderStatus: (
    orderId: string,
    status: Order["status"],
  ) => Promise<void>;
  updatePaymentStatus: (
    orderId: string,
    paymentStatus: Order["payment_status"],
  ) => Promise<void>;
}

/* -------------------- Context -------------------- */

const OrderContext = createContext<OrderContextType | undefined>(undefined);

/* -------------------- Provider -------------------- */

export const OrderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user, loading } = useAuth();

  /* ---------- Initial Fetch ---------- */

  const fetchOrders = async () => {
    try {
      const records = await pb.collection("orders").getFullList({
        sort: "-created",
        expand: "salesperson_id,distributor_id",
      });

      const mapped: Order[] = records.map((r: any) => ({
        id: r.id,
        spa_name: r.spa_name,
        address: r.address,
        product_name: r.product_name,
        quantity: r.quantity,
        status: r.status,
        payment_status: r.payment_status,
        salesperson_id: r.salesperson_id,
        distributor_id: r.distributor_id,
        created: r.created,
        expand: r.expand,
      }));

      setOrders(mapped);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  /* ---------- Lifecycle + Realtime ---------- */

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setOrders([]);
      return;
    }

    fetchOrders();

    const unsubscribe = pb.collection("orders").subscribe("*", (e) => {
      const normalize = (r: any): Order => ({
        id: r.id,
        spa_name: r.spa_name,
        address: r.address,
        product_name: r.product_name,
        quantity: r.quantity,
        status: r.status,
        payment_status: r.payment_status,
        salesperson_id: r.salesperson_id,
        distributor_id: r.distributor_id,
        created: r.created,
      });

      if (e.action === "create") {
        setOrders((prev) => [normalize(e.record), ...prev]);
      }

      if (e.action === "update") {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === e.record.id ? normalize(e.record) : o,
          ),
        );
      }

      if (e.action === "delete") {
        setOrders((prev) => prev.filter((o) => o.id !== e.record.id));
      }
    });

    return () => {
      pb.collection("orders").unsubscribe("*");
    };
  }, [loading, user]);

  /* ---------- Actions ---------- */

  const createOrder = async (
    orderData: Omit<Order, "id" | "created">,
  ) => {
    if (!user) return;

    try {
      const created = await pb.collection("orders").create({
        spa_name: orderData.spa_name,
        address: orderData.address,
        product_name: orderData.product_name,
        quantity: orderData.quantity,
        status: orderData.status,
        payment_status: orderData.payment_status,
        salesperson_id: orderData.salesperson_id,
        distributor_id: orderData.distributor_id || null,
      });

      await logOrderEvent({
        orderId: created.id,
        type: "created",
        actorId: user.id,
        actorRole: user.role,
        message: "Order created",
      });
    } catch (err) {
      console.error("Failed to create order", err);
      throw err;
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    status: Order["status"],
  ) => {
    if (!user) return;

    try {
      await pb.collection("orders").update(orderId, { status });

      await logOrderEvent({
        orderId,
        type: "status_updated",
        actorId: user.id,
        actorRole: user.role,
        message: `Status changed to ${status}`,
      });
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  const updatePaymentStatus = async (
    orderId: string,
    paymentStatus: Order["payment_status"],
  ) => {
    if (!user) return;

    try {
      await pb.collection("orders").update(orderId, {
        payment_status: paymentStatus,
      });

      await logOrderEvent({
        orderId,
        type: "payment_updated",
        actorId: user.id,
        actorRole: user.role,
        message: `Payment marked ${paymentStatus}`,
      });
    } catch (err) {
      console.error("Failed to update payment status", err);
    }
  };

  /* ---------- Provider ---------- */

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

/* -------------------- Hook -------------------- */

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
};