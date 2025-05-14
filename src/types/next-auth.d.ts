import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      profilePic?: string | null;
      bio?: string | null;
      followerCount?: number;
      followingCount?: number;
      postCount?: number;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    image?: string;
    bio?: string;
    followerCount?: number;
    followingCount?: number;
    postCount?: number;
  }
}
