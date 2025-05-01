import bcrypt from "bcrypt";
import { insertNewUser, updateUserById } from "../db/user";

type EditUserDetailsArg = {
  userId: string;
  name: string;
  email: string;
  bio?: string;
  profilePicURL: string | null;
};

type CreateNewUserArgs = {
  email: string;
  name: string;
  password: string;
};

async function hashPassword(password: string) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export const editUserDetails = async ({
  userId,
  name,
  email,
  bio,
  profilePicURL,
}: EditUserDetailsArg) => {
  const updatedUser = updateUserById({
    id: userId,
    name,
    email,
    bio,
    profilePicURL,
  });

  return { updatedUser };
};

export const createNewUser = async ({
  email,
  name,
  password,
}: CreateNewUserArgs) => {
  const hashedPassword = await hashPassword(password);
  if (!hashedPassword) {
    throw new Error("Error creating hashed password");
  }
  const user = await insertNewUser({ email, name, password: hashedPassword });

  if (!user) {
    throw new Error("Error creating user");
  }

  return user;
};
