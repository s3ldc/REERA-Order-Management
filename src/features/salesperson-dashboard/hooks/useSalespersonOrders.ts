import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export const useSalespersonOrders = (userId?: Id<"users">) => {
  const createOrder = useMutation(api.orders.createOrder);
  const distributors = useQuery(api.users.getDistributors) || [];

  const orders =
    useQuery(
      api.orders.getOrdersBySalesperson,
      userId ? { salesperson_id: userId } : "skip",
    ) || [];

  const createNewOrder = async ({
    spa_name,
    address,
    product_name,
    quantity,
    distributor_id,
    actor_id,
    actor_role,
  }: {
    spa_name: string;
    address: string;
    product_name: string;
    quantity: number;
    distributor_id: Id<"users">;
    actor_id: Id<"users">;
    actor_role: string;
  }) => {
    return await createOrder({
      spa_name,
      address,
      product_name,
      quantity,
      status: "Pending",
      payment_status: "Unpaid",
      salesperson_id: actor_id,
      distributor_id,
      actor_id,
      actor_role,
    });
  };

  return {
    orders,
    distributors,
    createNewOrder,
  };
};