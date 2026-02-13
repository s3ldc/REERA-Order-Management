import { query } from "./_generated/server";
import { v } from "convex/values";

export const login = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .unique();

    return user;
  },
});