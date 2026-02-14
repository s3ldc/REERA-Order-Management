import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* =========================
   CREATE ORDER
========================= */
export const createOrder = mutation({
  args: {
    spa_name: v.string(),
    address: v.string(),
    product_name: v.string(),
    quantity: v.number(),
    status: v.union(
      v.literal("Pending"),
      v.literal("Dispatched"),
      v.literal("Delivered")
    ),
    payment_status: v.union(
      v.literal("Unpaid"),
      v.literal("Paid")
    ),
    salesperson_id: v.id("users"),
    distributor_id: v.id("users"),
  },

  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", args);

    // 🔥 Log timeline event
    await ctx.db.insert("order_events", {
      order_id: orderId,
      type: "created",
      message: "Order created",
      actor_id: args.salesperson_id,
      actor_role: "Salesperson",
    });

    return orderId;
  },
});

/* =========================
   GET ALL ORDERS
========================= */
export const getAllOrders = query({
  handler: async (ctx) => {
    return await ctx.db.query("orders").collect();
  },
});

/* =========================
   GET ORDERS BY SALESPERSON
========================= */
export const getOrdersBySalesperson = query({
  args: {
    salesperson_id: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_salesperson", (q) =>
        q.eq("salesperson_id", args.salesperson_id)
      )
      .collect();
  },
});

/* =========================
   GET ORDERS BY DISTRIBUTOR
========================= */
export const getOrdersByDistributor = query({
  args: {
    distributor_id: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_distributor", (q) =>
        q.eq("distributor_id", args.distributor_id)
      )
      .collect();
  },
});

/* =========================
   UPDATE ORDER STATUS
========================= */
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("Pending"),
      v.literal("Dispatched"),
      v.literal("Delivered")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      status: args.status,
    });

    // 🔥 Log status change event
    await ctx.db.insert("order_events", {
      order_id: args.orderId,
      type: "status_updated",
      message: `Status changed to ${args.status}`,
      actor_id: args.orderId, // temporary placeholder
      actor_role: "System",
    });
  },
});

/* =========================
   UPDATE PAYMENT STATUS
========================= */
export const updatePaymentStatus = mutation({
  args: {
    orderId: v.id("orders"),
    payment_status: v.union(
      v.literal("Unpaid"),
      v.literal("Paid")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      payment_status: args.payment_status,
    });

    // 🔥 Log payment event
    await ctx.db.insert("order_events", {
      order_id: args.orderId,
      type: "payment_updated",
      message: `Payment marked ${args.payment_status}`,
      actor_id: args.orderId, // temporary placeholder
      actor_role: "System",
    });
  },
});