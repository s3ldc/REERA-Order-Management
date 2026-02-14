import { mutation } from "./_generated/server";

export const seedProduction = mutation({
  handler: async (ctx) => {
    await ctx.db.insert("users", {
      name: "Admin",
      email: "admin@example.com",
      role: "Admin",
      verified: true,
      passwordHash: "$2b$10$irwdyA1lGigDfNJSMrPQ9e2zB66LC5dz9FE8rjQGx.I90mfbiIkP2",
    });
  },
});