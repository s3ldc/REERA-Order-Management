import { query } from "./_generated/server";
import { v } from "convex/values";

export const getByOrderId = query({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("order_events")
      .withIndex("by_order", (q) => q.eq("order_id", args.orderId))
      .order("desc")
      .collect();
  },
});
