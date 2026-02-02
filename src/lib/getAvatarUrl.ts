// lib/getAvatarUrl.ts
import pb from "./pocketbase";

interface AvatarUser {
  id: string;
  avatar?: string;
}

export const getAvatarUrl = (user: AvatarUser, size = 160) => {
  if (!user.avatar) return "";

  return `${pb.baseUrl}/api/files/users/${user.id}/${user.avatar}?thumb=${size}x${size}`;
};
