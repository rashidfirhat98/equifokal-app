import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Photo } from "@/models/Images";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photos: Photo[];
  selectedPhotos: Set<number>;
  toggleSelect: (id: number) => void;
  onSave: () => void;
};

export function ManagePortfolioDialog({
  open,
  onOpenChange,
  photos,
  selectedPhotos,
  toggleSelect,
  onSave,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Manage Portfolio</DialogTitle>
          <DialogDescription>
            Select the photos you want in your portfolio.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
          {photos.map((photo) => {
            const isSelected = selectedPhotos.has(photo.id);
            return (
              <div
                key={photo.id}
                className={cn(
                  "relative cursor-pointer rounded overflow-hidden border-2",
                  isSelected ? "border-blue-600" : "border-transparent"
                )}
                onClick={() => toggleSelect(photo.id)}
              >
                <Image
                  src={photo.src.large}
                  alt=""
                  width={300}
                  height={200}
                  className="object-cover w-full h-48"
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 text-xs rounded">
                    Selected
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
