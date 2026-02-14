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
    return await ctx.db.insert("orders", args);
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