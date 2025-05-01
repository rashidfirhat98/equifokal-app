import { User } from "@prisma/client";

export type UserDetails = User & {
  followerCount: number;
  followingCount: number;
};
