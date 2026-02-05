import pb from "../src/lib/pocketbase";

await pb.admins.authWithPassword("admin@example.com", "12345678");

const SYSTEM_USER_ID = "cbu9q9qqnctrq1m";

async function backfillOrderTimeline() {
  const orders = await pb.collection("orders").getFullList();

  for (const order of orders) {
    await pb.collection("order_events").create({
      order_id: order.id,
      type: "created",
      message: "Order created",
      actor_id: SYSTEM_USER_ID,
      actor_role: "Admin",
      created: order.created, // ✅ works ONLY on create
    });

    console.log(`Backfilled order ${order.id}`);
  }

  console.log("✅ Timeline backfill complete");
}

backfillOrderTimeline();