import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import pb from "../lib/pocketbase";
import { useAuth } from "./AuthContext";

interface Order {
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

  // 🔹 PocketBase expand support
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

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user, loading } = useAuth();

  // 🔹 Fetch orders from PocketBase on load
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

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setOrders([]);
      return;
    }

    fetchOrders();

    // 🔥 REALTIME SUBSCRIPTION
    const subscribe = async () => {
      await pb.collection("orders").subscribe("*", (e) => {
        if (e.action === "create") {
          const normalize = (r: any) => ({
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

          setOrders((prev) => [normalize(e.record), ...prev]);
        }

        if (e.action === "update") {
          const normalize = (r: any) => ({
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

          setOrders((prev) =>
            prev.map((o) => (o.id === e.record.id ? normalize(e.record) : o)),
          );
        }

        if (e.action === "delete") {
          setOrders((prev) => prev.filter((o) => o.id !== e.record.id));
        }
      });
    };

    subscribe();

    return () => {
      pb.collection("orders").unsubscribe("*");
    };
  }, [loading, user]);

  // 🔹 Create order in PocketBase
  const createOrder = async (orderData: Omit<Order, "id" | "created">) => {
    try {
      await pb.collection("orders").create({
        spa_name: orderData.spa_name,
        address: orderData.address,
        product_name: orderData.product_name,
        quantity: orderData.quantity,
        status: orderData.status,
        payment_status: orderData.payment_status,
        salesperson_id: orderData.salesperson_id,
        distributor_id: orderData.distributor_id || null,
      });

      await fetchOrders(); // refresh list after create
    } catch (err) {
      console.error("Failed to create order", err);
      throw err;
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    status: Order["status"],
  ) => {
    try {
      await pb.collection("orders").update(orderId, {
        status,
      });

      await fetchOrders();
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  const updatePaymentStatus = async (
    orderId: string,
    paymentStatus: Order["payment_status"],
  ) => {
    try {
      await pb.collection("orders").update(orderId, {
        payment_status: paymentStatus,
      });

      await fetchOrders();
    } catch (err) {
      console.error("Failed to update payment status", err);
    }
  };

  return (
    <OrderContext.Provider
      value={{ orders, createOrder, updateOrderStatus, updatePaymentStatus }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
};
