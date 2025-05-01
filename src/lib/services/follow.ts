import { findIsFollowingByFollowId } from "../db/follow";

export const getIsFollowing = async (
  followerId: string,
  followingId: string
) => {
  const isFollowing = await findIsFollowingByFollowId({
    followerId,
    followingId,
  });

  return isFollowing;
};
