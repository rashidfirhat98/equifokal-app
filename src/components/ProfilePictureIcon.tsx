import Image from "next/image";
import React from "react";
import profilePic from "@/assets/images/EQFKL_logo.jpg";

type Props = {
  profilePicURL: string | null;
  width: number;
  height: number;
};

export default function ProfilePictureIcon({
  profilePicURL,
  width,
  height,
}: Props) {
  const defaultProfilePic = "@/assets/images/EQFKL_logo.jpg";
  const profilePic = profilePicURL || defaultProfilePic;
  return (
    <Image
      src={profilePic}
      alt={profilePic}
      loading="lazy"
      width={width}
      height={height}
      className="aspect-square object-cover rounded-full"
    />
  );
}
