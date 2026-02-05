import pb from "../src/lib/pocketbase";

await pb.admins.authWithPassword(
  "admin@example.com",
  "12345678"
);

const SYSTEM_USER_ID = "cbu9q9qqnctrq1m";

async function backfillOrderTimeline() {
  const orders = await pb.collection("orders").getFullList();

  for (const order of orders) {
    const existing = await pb
      .collection("order_events")
      .getList(1, 1, {
        filter: `order_id="${order.id}"`,
      });

    if (existing.totalItems > 0) continue;

    await pb.collection("order_events").create({
      order_id: order.id,
      type: "created",
      message: "Order created (backfilled)",
      actor_id: SYSTEM_USER_ID,
      actor_role: "Admin",
    });

    console.log(`Backfilled order ${order.id}`);
  }

  console.log("✅ Timeline backfill complete");
}

backfillOrderTimeline();