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
    actor_id: v.id("users"),
    actor_role: v.string(),
  },

  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", {
      spa_name: args.spa_name,
      address: args.address,
      product_name: args.product_name,
      quantity: args.quantity,
      status: args.status,
      payment_status: args.payment_status,
      salesperson_id: args.salesperson_id,
      distributor_id: args.distributor_id,
    });

    await ctx.db.insert("order_events", {
      order_id: orderId,
      type: "created",
      message: "Order created",
      actor_id: args.actor_id,
      actor_role: args.actor_role,
    });

    return orderId;
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
    actor_id: v.id("users"), // 🔥 added
    actor_role: v.string(),  // 🔥 added
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      status: args.status,
    });

    await ctx.db.insert("order_events", {
      order_id: args.orderId,
      type: "status_updated",
      message: `Status changed to ${args.status}`,
      actor_id: args.actor_id,
      actor_role: args.actor_role,
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
    actor_id: v.id("users"), // 🔥 added
    actor_role: v.string(),  // 🔥 added
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      payment_status: args.payment_status,
    });

    await ctx.db.insert("order_events", {
      order_id: args.orderId,
      type: "payment_updated",
      message: `Payment marked ${args.payment_status}`,
      actor_id: args.actor_id,
      actor_role: args.actor_role,
    });
  },
});

/* =========================
   QUERIES (unchanged)
========================= */
export const getAllOrders = query({
  handler: async (ctx) => {
    return await ctx.db.query("orders").collect();
  },
});

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