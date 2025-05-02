import {
  findFollowerListByUserId,
  findFollowingListByUserId,
  findIsFollowingByFollowId,
} from "../db/follow";

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

export async function getFollowerList(userId: string) {
  const followerList = await findFollowerListByUserId(userId);

  if (!followerList) {
    throw new Error("Follower list not found");
  }

  return followerList;
}

export async function getFollowingList(userId: string) {
  const followingList = await findFollowingListByUserId(userId);

  if (!followingList) {
    throw new Error("Follower list not found");
  }

  return followingList;
}
