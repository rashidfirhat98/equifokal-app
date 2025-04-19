import { z } from "zod";
import { BasicPhotoSchema } from "./Images";

export const UserDetailsSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.string(),
  //   profilePic: BasicPhotoSchema,
  bio: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type UserDetails = z.infer<typeof UserDetailsSchema>;
