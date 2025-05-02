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
  const followerRes = await findFollowerListByUserId(userId);

  if (!followerRes) {
    throw new Error("Follower list not found");
  }

  const followerList = followerRes.map((following) => {
    return following.follower;
  });

  return followerList;
}

export async function getFollowingList(userId: string) {
  const followingRes = await findFollowingListByUserId(userId);

  if (!followingRes) {
    throw new Error("Following list not found");
  }

  const followingList = followingRes.map((following) => {
    return following.following;
  });

  return followingList;
}
