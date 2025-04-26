import prisma from "@/lib/prisma";

export async function getIsFollowing(
  currentUserId: string,
  profileUserId: string
) {
  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: profileUserId,
      },
    },
  });

  return !!follow;
}
