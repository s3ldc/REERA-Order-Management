import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Doc, Id } from "../../../../convex/_generated/dataModel";

import {
  getNextStatus,
  togglePaymentStatus,
  OrderStatus,
  PaymentStatus,
} from "../utils/orderHelpers";

export const useAdminOrders = () => {
  const orders = (useQuery(api.orders.getAllOrders) ?? []) as Doc<"orders">[];

  const updateOrderStatus = useMutation(api.orders.updateOrderStatus);
  const updatePaymentStatus = useMutation(api.orders.updatePaymentStatus);

  const moveOrderStatus = async (
    orderId: Id<"orders">,
    currentStatus: OrderStatus,
    actorId: Id<"users">,
    actorRole: string,
  ) => {
    const nextStatus = getNextStatus(currentStatus);

    if (nextStatus === currentStatus) return;

    await updateOrderStatus({
      orderId,
      status: nextStatus,
      actor_id: actorId,
      actor_role: actorRole,
    });
  };

  const togglePayment = async (
    orderId: Id<"orders">,
    paymentStatus: PaymentStatus,
    actorId: Id<"users">,
    actorRole: string,
  ) => {
    const newStatus = togglePaymentStatus(paymentStatus);

    await updatePaymentStatus({
      orderId,
      payment_status: newStatus,
      actor_id: actorId,
      actor_role: actorRole,
    });
  };

  return {
    orders,
    moveOrderStatus,
    togglePayment,
  };
};