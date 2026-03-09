import {
  Package,
  Clock,
  Truck,
  CheckCircle,
} from "lucide-react";

export type OrderStatus = "Pending" | "Dispatched" | "Delivered";

export const getNextStatus = (status: OrderStatus): OrderStatus => {
  switch (status) {
    case "Pending":
      return "Dispatched";
    case "Dispatched":
      return "Delivered";
    default:
      return status;
  }
};

export const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case "Pending":
      return Clock;
    case "Dispatched":
      return Truck;
    case "Delivered":
      return CheckCircle;
    default:
      return Package;
  }
};