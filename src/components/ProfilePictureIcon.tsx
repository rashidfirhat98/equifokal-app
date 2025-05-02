import { profilePicURL } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type Props = {
  profilePic: string | null;
  width: number;
  height: number;
};

export default function ProfilePictureIcon({
  profilePic,
  width,
  height,
}: Props) {
  const profilePicIcon = profilePicURL(profilePic);
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
