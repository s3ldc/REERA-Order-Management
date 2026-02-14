"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadAvatar = action({
  args: {
    userId: v.string(),
    file: v.string(), // base64 image
  },

  handler: async (ctx, args): Promise<string> => {
    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(args.file, {
      folder: "avatars",
      transformation: [
        { width: 400, height: 400, crop: "fill" },
        { quality: "auto" }
      ]
    });

    const imageUrl = uploadResult.secure_url;

    // Update user in Convex
    await ctx.runMutation(api.users.updateAvatar, {
      userId: args.userId,
      avatar: imageUrl,
    });

    return imageUrl;
  },
});