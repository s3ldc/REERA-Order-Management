import { action } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";
import { api } from "./_generated/api";

export const login = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // call query properly
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