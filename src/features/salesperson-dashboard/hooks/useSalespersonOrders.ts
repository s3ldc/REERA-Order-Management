import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export const useSalespersonOrders = (userId?: Id<"users">) => {
  const distributors = useQuery(api.users.getDistributors) || [];

  const orders =
    useQuery(
      api.orders.getOrdersBySalesperson,
      userId ? { salesperson_id: userId } : "skip",
    ) || [];

  return {
    orders,
    distributors,
  };
};