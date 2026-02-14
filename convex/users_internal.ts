import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const insertUser = internalMutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
    name: v.string(),
    role: v.union(
      v.literal("Admin"),
      v.literal("Salesperson"),
      v.literal("Distributor")
    ),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      email: args.email,
      passwordHash: args.passwordHash,
      name: args.name,
      role: args.role,
      avatar: args.avatar,
      verified: false,
      // createdAt: Date.now(),
    });
  },
});