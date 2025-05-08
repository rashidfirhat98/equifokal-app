import { profilePicURL } from "@/lib/utils/profilePic";
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
    <div
      className={`relative`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <Image
        src={profilePicIcon}
        alt={"profilePicIcon"}
        className="aspect-square object-cover rounded-full"
        fill
        sizes={`${width}px,`}
      />
    </div>
  );
}
