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
    createdAt: v.number(),
  }).index("by_email", ["email"]),
});