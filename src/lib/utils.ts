import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import profilePic from "@/assets/images/EQFKL_logo.jpg";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function profilePicURL(url: string | null) {
  const defaultProfilePicURL = profilePic;
  const profilePicURL = url || defaultProfilePicURL;
  return profilePicURL;
}
