import type { Doc, Id } from "../../../convex/_generated/dataModel";

export type Order = Doc<"orders">;
export type OrderId = Id<"orders">;

export type OrderStatus = "Pending" | "Dispatched" | "Delivered";
export type PaymentStatus = "Paid" | "Unpaid";

export interface OrdersTableProps {
  orders: Order[];
  onTimeline: (order: Order) => void;
}

export interface MobileOrdersListProps {
  orders: Order[];
  onTimeline: (order: Order) => void;
}

export interface StatsCardsProps {
  orders: Order[];
}

export interface DashboardHeaderProps {
  user: Doc<"users"> | null;
  onCreateOrder: () => void;
}