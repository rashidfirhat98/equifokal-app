import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import env from "@/lib/env";
import { findUserByEmail } from "./db/user";
import { getUserDetails } from "./services/user";
import convertToCDNUrl from "./utils/convertToCDNUrl";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email or password is missing");
        }

        const user = await findUserByEmail(credentials.email);

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          throw new Error("Invalid email or password");
        }

        // ✅ Ensure we return only required fields for NextAuth
        return {
          id: String(user.id), // NextAuth requires an `id`
          name: user.name,
          email: user.email,
          image: user.profilePic, // Optional, but expected by NextAuth
        };
      },
    }),
  ],
  debug: process.env.NODE_ENV !== "production",
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
    updateAge: 0,
  },
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const dbUser = await getUserDetails(user.id);
        token.id = dbUser.id;
        token.email = dbUser.email;
        token.name = dbUser.name;
        token.image = convertToCDNUrl(dbUser?.profilePic || undefined);
        token.bio = dbUser.bio || undefined;

        token.followerCount = dbUser.followerCount;
        token.followingCount = dbUser.followingCount;
        token.postCount = dbUser.postCount;
      }

      if (trigger === "update") {
        const dbUser = await getUserDetails(token.id);
        token.image = convertToCDNUrl(dbUser?.profilePic || undefined);
        token.email = dbUser.email;
        token.name = dbUser.name;
        token.image = convertToCDNUrl(dbUser?.profilePic || undefined);
        token.bio = dbUser.bio || undefined;
        token.followerCount = dbUser.followerCount;
        token.followingCount = dbUser.followingCount;
        token.postCount = dbUser.postCount;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.profilePic = token.image as string;
        session.user.bio = token.bio as string;

        session.user.followerCount = token.followerCount as number;
        session.user.followingCount = token.followingCount as number;
        session.user.postCount = token.postCount as number;
      }
      return session;
    },
  },
};
