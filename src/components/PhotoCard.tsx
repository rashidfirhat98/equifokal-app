"use client";

import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Photo } from "@/models/Images";

type Props = {
  photo: Photo;
  isSelected: boolean;
  onSelect?: boolean;
  toggleSelect: (id: number) => void;
  setEditPhoto: (photo: Photo) => void;
  setEditDialogOpen: (open: boolean) => void;
};

export default function PhotoCard({
  photo,
  isSelected,
  onSelect,
  toggleSelect,
  setEditPhoto,
  setEditDialogOpen,
}: Props) {
  return (
    <Card
      key={photo.id}
      onClick={() => {
        if (onSelect) {
          toggleSelect(photo.id);
        } else {
          setEditPhoto(photo);
          setEditDialogOpen(true);
        }
      }}
      className={`relative border cursor-pointer transition-colors hover:border-black/50
                  isSelected ? "border-black/50" : "border-transparent"`}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square w-full  group">
          <Image
            src={photo.src.large}
            alt={photo.alt}
            fill
            sizes="(max-width: 768px) 30vw, (max-width: 1200px) 10vw, 200px"
            className="object-cover rounded-md p-1"
          />

          <div className="absolute inset-0 bg-transparent rounded-md group-hover:bg-black/15 transition-colors pointer-events-none" />

          {onSelect && (
            <div
              className="absolute top-2 left-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                onClick={() => toggleSelect(photo.id)}
                className={`w-5 h-5 flex items-center justify-center rounded-full border-2 border-spacing-2 border-white bg-white transition-colors ${
                  isSelected ? "bg-blue-500/75" : "bg-white/60"
                }`}
              ></div>
            </div>
          )}
        </div>
      </CardContent>
      <div className="p-2 text-center text-xs text-muted-foreground truncate">
        {photo.alt || "Untitled"}
      </div>
    </Card>
  );
}
