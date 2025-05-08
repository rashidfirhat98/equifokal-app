import prisma from "@/lib/prisma";

type FollowId = {
  followerId: string;
  followingId: string;
};

export async function findIsFollowingByFollowId({
  followerId,
  followingId,
}: FollowId) {
  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  return !!follow;
}

export const insertFollowerByFollowId = async ({
  followerId,
  followingId,
}: FollowId) => {
  return prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  });
};

export const deleteFollowerByFollowId = async ({
  followerId,
  followingId,
}: FollowId) => {
  return prisma.follow.deleteMany({
    where: {
      followerId,
      followingId,
    },
  });
};

export const totalUserFollowers = async (userId: string) => {
  return prisma.follow.count({
    where: {
      followingId: userId,
    },
  });
};

export const totalUserFollowings = async (userId: string) => {
  return prisma.follow.count({
    where: {
      followerId: userId,
    },
  });
};

export const findFollowerListByUserId = async (
  userId: string,
  limit: number,
  cursor: string | null = null
) => {
  return prisma.follow.findMany({
    where: {
      followingId: userId,
      ...(cursor && {
        follower: {
          id: {
            lt: cursor, // assuming descending order
          },
        },
      }),
    },
    select: {
      follower: {
        select: {
          id: true,
          name: true,
          profilePic: true,
          bio: true,
        },
      },
    },
    orderBy: {
      follower: {
        id: "desc",
      },
    },
    take: limit + 1,
  });
};

export const findFollowingListByUserId = async (
  userId: string,
  limit: number,
  cursor: string | null = null
) => {
  return prisma.follow.findMany({
    where: {
      followerId: userId,
      ...(cursor && {
        following: {
          id: {
            lt: cursor, // assuming descending order
          },
        },
      }),
    },
    select: {
      following: {
        select: {
          id: true,
          name: true,
          profilePic: true,
          bio: true,
        },
      },
    },
    orderBy: {
      following: {
        id: "desc",
      },
    },
    take: limit + 1,
  });
};
