import pb from "./pocketbase";

export const getAvatarUrl = (
  userId: string,
  avatar?: string,
  size = 128
) => {
  if (!avatar) return null;

  return pb.files.getUrl(
    { id: userId, collectionId: "users" } as any,
    avatar,
    { thumb: `${size}x${size}` }
  );
};
