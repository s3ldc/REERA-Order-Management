export type OrderStatus = "Pending" | "Dispatched" | "Delivered";

export type PaymentStatus = "Paid" | "Unpaid";

/**
 * Determine the next order status in workflow
 */
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

/**
 * Toggle payment state
 */
export const togglePaymentStatus = (
  payment: PaymentStatus,
): PaymentStatus => {
  return payment === "Paid" ? "Unpaid" : "Paid";
};