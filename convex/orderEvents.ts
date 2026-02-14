import { query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const getByOrderId = query({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("order_events")
      .withIndex("by_order_id", (q) =>
        q.eq("order_id", args.orderId)
      )
      .order("desc")
      .collect();

    // 🔥 Manual join with users table
    const enriched = await Promise.all(
      events.map(async (event) => {
        const actor = await ctx.db.get(event.actor_id);

        return {
          ...event,
          actor, // attach full user document
        };
      })
    );

    return enriched;
  },
});