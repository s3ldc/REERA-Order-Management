import pb from "@/lib/pocketbase";

export const logOrderEvent = async ({
  orderId,
  type,
  actorId,
  actorRole,
  message,
}: {
  orderId: string;
  type: string;
  actorId: string;
  actorRole: string;
  message?: string;
}) => {
  await pb.collection("order_events").create({
    order_id: orderId,
    type,
    actor_id: actorId,
    actor_role: actorRole,
    message,
  });
};