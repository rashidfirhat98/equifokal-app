import { User } from "@prisma/client";

export type UserDetails = User & {
  followerCount: number;
  followingCount: number;
  postCount: number;
};

export type UserObj = User;
