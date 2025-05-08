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

export async function getFollowerList(
  userId: string,
  limit: number,
  cursor: string | null = null
) {
  const followerRes = await findFollowerListByUserId(userId, limit, cursor);
  if (!followerRes) {
    throw new Error("Follower list not found");
  }

  const hasNextPage = followerRes.length > limit;
  const trimmedFollower = hasNextPage ? followerRes.slice(0, -1) : followerRes;
  const nextCursor = hasNextPage
    ? trimmedFollower[trimmedFollower.length - 1].follower.id
    : null;

  const followers = trimmedFollower.map(({ follower }) => ({
    id: follower.id,
    name: follower.name,
    profilePic: follower.profilePic,
    bio: follower.bio,
  }));

  return {
    followers,
    nextCursor,
  };
}

export async function getFollowingList(
  userId: string,
  limit: number,
  cursor: string | null = null
) {
  const followingRes = await findFollowingListByUserId(userId, limit, cursor);
  if (!followingRes) {
    throw new Error("Follower list not found");
  }

  const hasNextPage = followingRes.length > limit;
  const trimmedFollower = hasNextPage
    ? followingRes.slice(0, -1)
    : followingRes;
  const nextCursor = hasNextPage
    ? trimmedFollower[trimmedFollower.length - 1].following.id
    : null;

  const followings = trimmedFollower.map(({ following }) => ({
    id: following.id,
    name: following.name,
    profilePic: following.profilePic,
    bio: following.bio,
  }));

  return {
    followings,
    nextCursor,
  };
}
