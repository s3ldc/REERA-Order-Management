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

export const getUserById = query({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getDistributors = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "Distributor"))
      .collect();
  },
});

export const updateAvatar = mutation({
  args: {
    userId: v.id("users"),
    avatar: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      avatar: args.avatar,
    });
  },
});

export const getAllNonAdminUsers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .filter((q) =>
        q.or(
          q.eq(q.field("role"), "Salesperson"),
          q.eq(q.field("role"), "Distributor")
        )
      )
      .collect();
  },
});

export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.userId);
  },
});