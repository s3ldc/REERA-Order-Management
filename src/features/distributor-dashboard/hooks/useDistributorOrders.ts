import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Doc, Id } from "../../../../convex/_generated/dataModel";

export type OrderStatus = "Pending" | "Dispatched" | "Delivered";

export const useDistributorOrders = (distributorId?: Id<"users">) => {
  const orders =
    useQuery(
      api.orders.getOrdersByDistributor,
      distributorId ? { distributor_id: distributorId } : "skip",
    ) || [];

  const updateOrderStatus = useMutation(api.orders.updateOrderStatus);

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus => {
    switch (currentStatus) {
      case "Pending":
        return "Dispatched";
      case "Dispatched":
        return "Delivered";
      default:
        return currentStatus;
    }
  };

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

    return nextStatus;
  };

  return {
    orders: orders as Doc<"orders">[],
    moveOrderStatus,
    getNextStatus,
  };
};