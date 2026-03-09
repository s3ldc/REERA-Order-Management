import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

interface CreateOrderParams {
  spa_name: string;
  address: string;
  product_name: string;
  quantity: number;
  distributor_id: Id<"users">;
  actor_id: Id<"users">;
  actor_role: string;
}

export const useCreateOrder = () => {
  const createOrder = useMutation(api.orders.createOrder);

  const createNewOrder = async ({
    spa_name,
    address,
    product_name,
    quantity,
    distributor_id,
    actor_id,
    actor_role,
  }: CreateOrderParams) => {
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

  return { createNewOrder };
};