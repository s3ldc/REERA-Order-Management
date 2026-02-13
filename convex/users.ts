import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";

// GET ALL USERS
export const getUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// CREATE USER (SIGNUP)
export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("Admin"),
      v.literal("Salesperson"),
      v.literal("Distributor")
    ),
    password: v.string(),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const passwordHash = await bcrypt.hash(args.password, 10);

    return await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      role: args.role,
      avatar: args.avatar ?? "",
      passwordHash,
      verified: false,
      createdAt: Date.now(),
    });
  },
});