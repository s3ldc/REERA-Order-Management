import pb from "../src/lib/pocketbase";

async function backfillOrderTimeline() {
  const orders = await pb.collection("orders").getFullList();

  for (const order of orders) {
    const existingEvents = await pb
      .collection("order_events")
      .getList(1, 1, {
        filter: `order_id="${order.id}"`,
      });

    if (existingEvents.totalItems > 0) {
      continue; // already has timeline
    }

    await pb.collection("order_events").create({
      order_id: order.id,
      type: "created",
      message: "Order created (backfilled)",
      actor_role: "system",
      actor_id: null,
    });

    console.log(`Backfilled order ${order.id}`);
  }

  console.log("✅ Timeline backfill complete");
}

backfillOrderTimeline();