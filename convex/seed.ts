import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedProduction = mutation({
  handler: async (ctx) => {
    // ----------------------------
    // 1️⃣ Check if already seeded
    // ----------------------------
    const existingAdmin = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), "admin@company.com"))
      .first();

    if (existingAdmin) {
      return "Production already seeded.";
    }

    // ----------------------------
    // 2️⃣ Insert Users
    // ----------------------------

    const adminId = await ctx.db.insert("users", {
      name: "Super Admin",
      email: "admin@company.com",
      passwordHash:
        "$2b$10$irwdyA1lGigDfNJSMrPQ9e2zB66LC5dz9FE8rjQGx.I90mfbiIkP2",
      role: "Admin",
      verified: true,
      avatar: "",
    });

    const salespersonId = await ctx.db.insert("users", {
      name: "Sunil Biriya",
      email: "sunil@gmail.com",
      passwordHash:
        "$2b$10$irwdyA1lGigDfNJSMrPQ9e2zB66LC5dz9FE8rjQGx.I90mfbiIkP2",
      role: "Salesperson",
      verified: true,
      avatar: "",
    });

    const distributorId = await ctx.db.insert("users", {
      name: "Karan Mane",
      email: "karan@gmail.com",
      passwordHash:
        "$2b$10$irwdyA1lGigDfNJSMrPQ9e2zB66LC5dz9FE8rjQGx.I90mfbiIkP2",
      role: "Distributor",
      verified: true,
      avatar: "",
    });

    // ----------------------------
    // 3️⃣ Insert Orders
    // ----------------------------

    await ctx.db.insert("orders", {
      spa_name: "Titan Spa",
      address: "Vasco, Goa",
      product_name: "Matches",
      quantity: 100,
      status: "Dispatched",
      payment_status: "Unpaid",
      salesperson_id: salespersonId,
      distributor_id: distributorId,
    });

    await ctx.db.insert("orders", {
      spa_name: "Maiden Farm",
      address: "New York, US",
      product_name: "Peanut Butter",
      quantity: 1500,
      status: "Delivered",
      payment_status: "Paid",
      salesperson_id: salespersonId,
      distributor_id: distributorId,
    });

    return "Production seeded successfully.";
  },
});