import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const createEvent = mutation({
  args: {
    order_id: v.id("orders"),
    type: v.string(),
    message: v.string(),
    actor_id: v.id("users"),
    actor_role: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("order_events", args);
  },
});

export const getByOrderId = query({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("order_events")
      .withIndex("by_order", (q) =>
        q.eq("order_id", args.orderId)
      )
      .order("desc")
      .collect();

    // Manual join with users table
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
