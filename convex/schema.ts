import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("Admin"),
      v.literal("Salesperson"),
      v.literal("Distributor")
    ),
    avatar: v.optional(v.string()),
    verified: v.boolean(),
    passwordHash: v.string(),
  }).index("by_email", ["email"]),

  orders: defineTable({
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
  })
    .index("by_salesperson", ["salesperson_id"])
    .index("by_distributor", ["distributor_id"]),
});