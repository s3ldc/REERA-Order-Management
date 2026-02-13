import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
  },
});

export const insertUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("Salesperson"),
      v.literal("Distributor"),
      v.literal("Admin")
    ),
    avatar: v.optional(v.string()),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existing) {
      throw new Error("User already exists");
    }

    return await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      role: args.role,
      avatar: args.avatar,
      passwordHash: args.passwordHash,
      verified: false,
      createdAt: Date.now(),
    });
  },
});