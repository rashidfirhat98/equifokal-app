import { User } from "@prisma/client";

export type UserDetails = {
  name: string;
  id: string;
  email: string;
  profilePic: string | null;
  bio: string | null;
  followerCount: number;
  followingCount: number;
  postCount: number;
};

export type SessionUser =
  | {
      id: string;
      name?: string | null;
      email?: string | null;
      profilePic?: string | null;
      bio?: string | null;
      followerCount?: number;
      followingCount?: number;
      postCount?: number;
    }
  | undefined;

export type UserObj = User;
