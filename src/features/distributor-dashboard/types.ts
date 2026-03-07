import type { Id } from "../../../convex/_generated/dataModel";

export type OrderStatus = "Pending" | "Dispatched" | "Delivered";

export interface DistributorOrder {
  _id: Id<"orders">;
  _creationTime: number;

  spa_name: string;
  address: string;

  product_name: string;
  quantity: number;

  status: OrderStatus;
  payment_status: "Paid" | "Unpaid";
}