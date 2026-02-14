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

export const updateAvatar = mutation({
  args: {
    userId: v.string(),
    avatar: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId as any, {
      avatar: args.avatar,
    });
  },
});