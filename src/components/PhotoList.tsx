"use client";

import { Photo } from "@/models/Images";
import { CircleCheck, Loader2, PencilIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "./ui/checkbox";
import { useSessionContext } from "./SessionContext";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type Props = {
  userId: string;
};

type DeletedPhoto = {
  id: number;
  fileName: string;
  url: string;
}[];

export default function PhotoList({ userId }: Props) {
  const session = useSessionContext();
  const user = session?.user;
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<number>>(new Set());
  const [onSelect, setOnSelect] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editPhoto, setEditPhoto] = useState<Photo | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [addToPortfolio, setAddToPortfolio] = useState(false);
  const [makeProfilePicture, setMakeProfilePicture] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [usedPhotos, setUsedPhotos] = useState<any[]>([]);
  const [isCheckingUsage, setIsCheckingUsage] = useState(false);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const didMountRef = useRef(false);
  const isFetchingRef = useRef(false);
  const hasFetched = useRef(false);

  const { toast } = useToast();

  const fetchMoreImages = useCallback(async () => {
    if (isFetchingRef.current || (hasLoaded && !nextCursor)) return;

    isFetchingRef.current = true;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/user/photos?userId=${userId}&cursor=${nextCursor ?? ""}&limit=10`
      );
      const data = await res.json();

      setPhotos((prev) => [...prev, ...data.photos]);
      console.log(photos);
      setNextCursor(data.nextCursor);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
      setHasLoaded(true);
      isFetchingRef.current = false;
    }
  }, [nextCursor, hasLoaded, userId]);

  const handleSavePortfolioChanges = async () => {
    const selectedIds = Array.from(selectedPhotos);
    try {
      await fetch("/api/user/photos/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoIds: selectedIds }),
      });

      setPhotos((prev) =>
        prev.map((photo) => ({
          ...photo,
          portfolio: selectedPhotos.has(photo.id),
        }))
      );

      setIsPortfolioModalOpen(false);
    } catch (error) {
      console.error("Failed to update portfolio photos:", error);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchMoreImages();
      hasFetched.current = true;
    }
  }, [fetchMoreImages]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && nextCursor) {
          fetchMoreImages();
        }
      },
      { threshold: 1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    didMountRef.current = true;

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [loading, fetchMoreImages, nextCursor]);

  useEffect(() => {
    if (isPortfolioModalOpen) {
      const initial = new Set(
        photos.filter((p) => p.portfolio).map((p) => p.id)
      );
      setSelectedPhotos(initial);
    }
  }, [isPortfolioModalOpen, photos]);

  const toggleOnSelect = () => {
    setOnSelect(!onSelect);
    setSelectedPhotos(new Set());
  };

  const toggleSelect = (id: number) => {
    setSelectedPhotos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const editSelected = async () => {
    if (!editPhoto) return;
    try {
      await fetch(`/api/user/photos/${editPhoto.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alt: editAlt,
          isPortfolio: addToPortfolio,
          isProfilePic: makeProfilePicture,
        }),
      });

      setPhotos((prev) =>
        prev.map((p) =>
          p.id === editPhoto.id
            ? {
                ...p,
                alt: editAlt,
                isPortfolio: addToPortfolio,
                isProfilePic: makeProfilePicture,
              }
            : p
        )
      );
      setEditDialogOpen(false);
      setEditPhoto(null);
      setSelectedPhotos(new Set());
    } catch (err) {
      console.error("Failed to update photo:", err);
    }
  };

  const confirmDelete = async () => {
    const ids = Array.from(selectedPhotos);
    if (ids.length === 0) return;

    setIsCheckingUsage(true);
    try {
      const res = await fetch(`/api/user/photos/check-usage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoIds: ids }),
      });

      const data = await res.json();
      setUsedPhotos(data.usedPhotos || []);
      setConfirmDialogOpen(true);
    } catch (err) {
      console.error("Failed to check photo usage", err);
    } finally {
      setIsCheckingUsage(false);
    }
  };

  const deleteSelected = async () => {
    const ids = Array.from(selectedPhotos);
    if (ids.length === 0) return;

    try {
      const res = await fetch(`/api/user/photos/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoIds: ids }),
      });

      const data = await res.json();
      const deletedPhotos: DeletedPhoto = data.deletedPhotos || [];

      setPhotos((prev) =>
        prev.filter((photo) => !selectedPhotos.has(photo.id))
      );
      setSelectedPhotos(new Set());
      setConfirmDialogOpen(false);

      deletedPhotos.forEach((photo) => {
        toast({
          title: "Photo deleted",
          description: `Photo ${photo.fileName} has been deleted.`,
          variant: "default",
        });
      });
    } catch (err) {
      console.error("Failed to delete photos", err);
      toast({
        title: "Error",
        description: "Failed to delete photos.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (editPhoto && user) {
      console.log(editPhoto);
      setEditAlt(editPhoto.alt ?? "");
      setAddToPortfolio(editPhoto.portfolio ?? false);
      setMakeProfilePicture(
        editPhoto.src.large === user.profilePic ? true : false
      );
    }
  }, [editPhoto]);

  return (
    <div className="space-y-4">
      <div className="bg-muted min-h-14 rounded-md">
        <div className="flex items-center gap-4 py-3 px-4">
          {onSelect ? (
            <>
              <Button
                variant="destructive"
                disabled={selectedPhotos.size < 1}
                onClick={confirmDelete}
                size="sm"
                className="gap-1"
              >
                <Trash2 size={16} /> Delete
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={selectedPhotos.size !== 1}
                className="gap-1"
                onClick={() => {
                  const id = Array.from(selectedPhotos)[0];
                  const photo = photos.find((p) => p.id === id);
                  if (photo) {
                    setEditPhoto(photo);
                    setEditDialogOpen(true);
                  }
                }}
              >
                <PencilIcon size={16} /> Edit
              </Button>

              <Button
                onClick={() => setIsPortfolioModalOpen(true)}
                variant="default"
                size="sm"
              >
                Manage Portfolio
              </Button>

              <span className="text-sm text-muted-foreground ml-auto">
                {selectedPhotos.size} selected
              </span>
              <Button
                variant="outline"
                onClick={toggleOnSelect}
                size="sm"
                className="gap-1"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={toggleOnSelect}
              size="sm"
              className="gap-1 ml-auto"
            >
              <CircleCheck size={16} /> Select
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {!hasLoaded ? (
          <div className="col-span-full text-center py-8">
            <Loader2 className="animate-spin text-gray-500 w-8 h-8 mx-auto" />
          </div>
        ) : (
          photos.map((photo) => {
            const isSelected = selectedPhotos.has(photo.id);

            return (
              <Card
                key={photo.id}
                onClick={() => onSelect && toggleSelect(photo.id)}
                className={`relative border cursor-pointer transition-colors ${
                  isSelected ? "border-black/50" : "border-transparent"
                } ${onSelect ? "hover:border-black/50" : ""}`}
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

                    {onSelect && (
                      <div className="absolute inset-0 bg-transparent rounded-md group-hover:bg-black/15 transition-colors pointer-events-none" />
                    )}
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
          })
        )}

        <div
          ref={loaderRef}
          className="col-span-full flex items-center justify-center py-4"
        >
          {loading && hasLoaded && (
            <Loader2 className="animate-spin text-gray-500 w-8 h-8 mx-auto" />
          )}
        </div>
      </div>
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Photo</DialogTitle>
            <DialogDescription>
              Modify photo metadata like title or caption.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="alt">Photo Title</Label>
              <Input
                id="alt"
                value={editAlt}
                onChange={(e) => setEditAlt(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="portfolio"
                checked={addToPortfolio}
                onCheckedChange={(v) => setAddToPortfolio(!!v)}
              />
              <Label htmlFor="portfolio">Add to Portfolio</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="profile"
                checked={makeProfilePicture}
                onCheckedChange={(v) => setMakeProfilePicture(!!v)}
              />
              <Label htmlFor="profile">Set as Profile Picture</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setEditPhoto(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={editSelected}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedPhotos.size} photo(s)?</DialogTitle>
            <DialogDescription></DialogDescription>
            {usedPhotos.length > 0 ? (
              <div className="space-y-2 text-sm p-2 text-red-600">
                <p>Some selected photos are in use:</p>
                <ul className="list-disc list-inside">
                  {usedPhotos.map((photo) => (
                    <li key={photo.id}>
                      {photo.portfolio && "In portfolio"}
                      {photo.Article.length > 0 &&
                        `Cover of article: ${photo.Article.map(
                          (a: any) => a.title
                        ).join(", ")}`}
                      {photo.galleries.length > 0 &&
                        `In galleries: ${photo.galleries
                          .map((g: any) => g.gallery.title)
                          .join(", ")}`}
                      {photo.url === user?.profilePic &&
                        "Used as profile picture"}
                    </li>
                  ))}
                </ul>
                <p className="mt-2">
                  Deleting these photos may break links or remove them from
                  published content.
                </p>
              </div>
            ) : (
              "This action cannot be undone. Are you sure you want to permanently delete the selected photos?"
            )}
          </DialogHeader>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteSelected}>
              Yes, Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isPortfolioModalOpen}
        onOpenChange={setIsPortfolioModalOpen}
      >
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
            <Button onClick={handleSavePortfolioChanges}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
