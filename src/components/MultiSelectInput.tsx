"use client";

import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Photo } from "@/models/Images";
import Image from "next/image";

type Props = {
  photos: Photo[];
  selectedPhotos: number[];
  setSelectedPhotos: (ids: number[]) => void;
};

export default function MultiSelectInput({
  photos,
  selectedPhotos = [],
  setSelectedPhotos,
}: Props) {
  const [open, setOpen] = useState(false);

  const handleSelect = (photo: Photo) => {
    const updatedPhotos = selectedPhotos.includes(photo.id)
      ? selectedPhotos.filter((id) => id !== photo.id)
      : [...selectedPhotos, photo.id];

    setSelectedPhotos(updatedPhotos);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between flex flex-wrap items-center gap-3 px-3 py-2 h-auto min-h-[56px]"
        >
          {selectedPhotos.length > 0 ? (
            <div className="flex gap-3 flex-wrap overflow-hidden max-w-full">
              {selectedPhotos.map((id) => {
                const photo = photos.find((p) => p.id === id);
                return (
                  photo && (
                    <div
                      key={photo.id}
                      className="flex flex-col items-center relative max-w-10"
                    >
                      <Image
                        src={photo.src.large}
                        alt={photo.alt}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover w-full h-full"
                      />
                      <p className="text-xs text-center mt-1 truncate w-full">
                        {photo.alt}
                      </p>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(photo);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-[4px] text-xs leading-none cursor-pointer"
                      >
                        <X size={14} />
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          ) : (
            <span className="text-gray-500">Select images...</span>
          )}
          <ChevronsUpDown className="ml-auto opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] max-h-[300px]"
      >
        <Command>
          <CommandInput placeholder="Search photos..." className="h-9" />
          <CommandList>
            <CommandEmpty>No images found.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto">
              {photos.map((photo) => {
                const isSelected = selectedPhotos.includes(photo.id);
                return (
                  <CommandItem
                    key={photo.id}
                    onSelect={() => handleSelect(photo)}
                    className="flex items-center gap-2 p-2"
                  >
                    <Image
                      src={photo.src.large}
                      alt={photo.alt}
                      width={48}
                      height={48}
                      className="rounded-md object-cover"
                    />
                    <span className="text-sm truncate">{photo.alt}</span>
                    <Check
                      className={cn(
                        "ml-auto",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
