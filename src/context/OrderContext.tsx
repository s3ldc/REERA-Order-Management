import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { generateUUID } from "../utils/uuid";

interface Order {
  id: string;
  spa_name: string;
  address: string;
  product_name: string;
  quantity: number;
  status: "Pending" | "Dispatched" | "Delivered";
  payment_status: "Unpaid" | "Paid";
  salesperson_id: string;
  distributor_id?: number;
  created_at: string;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (order: Omit<Order, "id" | "created_at">) => Promise<void>;
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

  const createOrder = async (orderData: Omit<Order, "id" | "created_at">) => {
    const newOrder: Order = {
      ...orderData,
      id: generateUUID(),
      created_at: new Date().toISOString(),
    };

    setOrders((prev) => [...prev, newOrder]);
  };

  const updateOrderStatus = async (
    orderId: string,
    status: Order["status"],
  ) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    );
  };

  const updatePaymentStatus = async (
    orderId: string,
    paymentStatus: Order["payment_status"],
  ) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, payment_status: paymentStatus }
          : order,
      ),
    );
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
  if (context === undefined) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
};
