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

export const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "Pending":
      return "text-amber-600";
    case "Dispatched":
      return "text-blue-600";
    case "Delivered":
      return "text-emerald-600";
    default:
      return "text-muted-foreground";
  }
};