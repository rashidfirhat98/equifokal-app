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
  const defaultProfilePic = profilePic;
  const profilePicIcon = profilePicURL || defaultProfilePic;
  return (
    <Image
      src={profilePicIcon}
      alt={"profilePicIcon"}
      width={width}
      height={height}
      className="aspect-square object-cover rounded-full"
    />
  );
}
