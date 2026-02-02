// lib/getAvatarUrl.ts
import pb from "./pocketbase";

export const getAvatarUrl = (user: { id: string; avatar?: string }) => {
  if (!user.avatar) return "";
  return pb.files.getUrl(
    { id: user.id, avatar: user.avatar },
    user.avatar,
    { thumb: "100x100" }
  );
};
