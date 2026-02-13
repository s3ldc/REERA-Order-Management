import { action } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";
import { api } from "./_generated/api";


export const createUser = action({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    role: v.union(
      v.literal("Admin"),
      v.literal("Salesperson"),
      v.literal("Distributor")
    ),
    avatar: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    // ✅ Check if user already exists
    const existing = await ctx.runQuery(api.users.getUserByEmail, {
      email: args.email,
    });

    if (existing) {
      throw new Error("User already exists");
    }

    // ✅ Hash password
    const passwordHash = await bcrypt.hash(args.password, 10);

    // ✅ Insert using internal mutation
    return await ctx.runMutation(
      api.users_internal.insertUser,
      {
        email: args.email,
        passwordHash,
        name: args.name,
        role: args.role,
        avatar: args.avatar,
      }
    );
  },
});

export const login = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<{
    _id: string;
    name: string;
    email: string;
    role: "Admin" | "Salesperson" | "Distributor";
    avatar?: string;
  } | null> => {

    const user = await ctx.runQuery(api.users.getUserByEmail, {
      email: args.email,
    });

    if (!user) return null;

    const isValid = await bcrypt.compare(args.password, user.passwordHash);

    if (!isValid) return null;

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };
  },
});