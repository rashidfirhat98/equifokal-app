import prisma from "@/lib/prisma";

type UpdateUser = {
  id: string;
  name: string;
  email: string;
  bio?: string;
  profilePicURL: string | null;
};

type InsertNewUser = {
  email: string;
  name: string;
  password: string;
};

export const updateUserById = async ({
  id,
  name,
  email,
  bio,
  profilePicURL,
}: UpdateUser) => {
  return prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      bio,
      profilePic: profilePicURL,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const insertNewUser = async ({
  email,
  name,
  password,
}: InsertNewUser) => {
  return prisma.user.create({
    data: { email, name, password: password },
  });
};

export async function findUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      bio: true,
      email: true,
      profilePic: true,
    },
  });
  return user;
}
