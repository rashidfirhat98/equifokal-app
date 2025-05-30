import { X } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { SessionUser, UserDetails } from "@/models/User";

interface PhotoUsage {
  id: number;
  fileName: string;
  url: string;
  portfolio?: boolean;
  articles: { title: string }[];
  galleries: { title: string }[];
}
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPhotos: Set<number>;
  usedPhotos: PhotoUsage[];
  user?: SessionUser | null;
  onDelete: () => void;
  onDeselectPhoto: (id: number) => void;
};

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  selectedPhotos,
  usedPhotos,
  user,
  onDelete,
  onDeselectPhoto,
}: Props) {
  const photosInUse = usedPhotos.filter((photo) =>
    selectedPhotos.has(photo.id)
  );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {selectedPhotos.size} photo(s)?</DialogTitle>

          {usedPhotos.length > 0 ? (
            <>
              <DialogDescription>
                Some selected photos are in use:
              </DialogDescription>
              <div className="space-y-4 text-sm p-2 text-red-600">
                {photosInUse.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative bg-muted p-3 rounded-lg flex items-start gap-4"
                  >
                    <button
                      onClick={() => onDeselectPhoto(photo.id)}
                      className="absolute top-2 right-2 text-muted-foreground hover:text-red-500 transition-colors"
                      aria-label="Remove photo from selection"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="relative aspect-square w-20 h-20 shrink-0">
                      <Image
                        src={photo.url}
                        alt={photo.fileName}
                        fill
                        sizes="(max-width: 768px) 30vw, (max-width: 1200px) 10vw, 200px"
                        className="object-cover rounded-md"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-red-700">
                        {photo.fileName}
                      </span>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        {photo.portfolio && <li>In portfolio</li>}
                        {photo.articles.length > 0 && (
                          <li>
                            Cover of article:{" "}
                            <span className="font-semibold">
                              {photo.articles.map((a) => a.title).join(", ")}
                            </span>
                          </li>
                        )}
                        {photo.galleries.length > 0 && (
                          <li>
                            In galleries:{" "}
                            <span className="font-semibold">
                              {photo.galleries.map((g) => g.title).join(", ")}
                            </span>
                          </li>
                        )}
                        {photo.url === user?.profilePic && (
                          <li>Used as profile picture</li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}

                <p className="mt-2">
                  Deleting these photos may break links or remove them from
                  published content.
                </p>
              </div>
            </>
          ) : (
            <DialogDescription>
              This action cannot be undone. Are you sure you want to permanently
              delete the selected photos?
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Yes, Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
