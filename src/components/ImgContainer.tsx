"use client";

import type { Photo } from "@/models/Images";
import Image from "next/image";
import Link from "next/link";

type Props = {
  photo: Photo;
};

export default function ImgContainer({ photo }: Props) {
  const widthHeightRatio = photo.height / photo.width;
  const galleryHeight = Math.ceil(250 * widthHeightRatio);
  const photoSpans = Math.ceil(galleryHeight / 10) + 1;

  return (
    <div
      className="w-[250] justify-self-center h-auto"
      style={{ gridRow: `span ${photoSpans}` }}
    >
      <Link
        href={`/photo/${photo.id}`}
        // target="_blank"
        className="grid place-content-center"
      >
        <div className=" overflow-hidden group cursor-pointer">
          <Image
            src={photo.src.large}
            alt={photo.alt}
            width={250}
            height={250}
            sizes="250px"
            placeholder="blur"
            blurDataURL={photo.blurredDataUrl}
            className="group-hover:opacity-75"
          />
        </div>
      </Link>
    </div>
  );
}
