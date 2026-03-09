import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "../../../context/AuthContext";

export const useSalespersonOrders = () => {
  const { user } = useAuth();

  const createOrder = useMutation(api.orders.createOrder);

  const distributors = useQuery(api.users.getDistributors) || [];

  const myOrders =
    useQuery(
      api.orders.getOrdersBySalesperson,
      user ? { salesperson_id: user._id as any } : "skip"
    ) || [];

  return {
    createOrder,
    distributors,
    myOrders,
    user,
  };
};