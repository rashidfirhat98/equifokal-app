"use client";

import { Photo } from "@/models/Images";
import { CircleCheck, Loader2, PencilIcon, Trash2, X } from "lucide-react";
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
import { useSession } from "next-auth/react";
import { Switch } from "./ui/switch";

type Props = {
  userId: string;
};

type DeletedPhoto = {
  id: number;
  fileName: string;
  url: string;
}[];

type UsedPhoto = {
  id: number;
  fileName: string;
  portfolio: string;
  url: string;
  articles: { id: number; title: string }[];
  galleries: { id: number; title: string }[];
};

export default function PhotoList({ userId }: Props) {
  const { data: session, update } = useSession(); // const session = useSessionContext();
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
  const [usedPhotos, setUsedPhotos] = useState<UsedPhoto[]>([]);
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
      const res = await fetch(`/api/user/photos/${editPhoto.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: editAlt,
          isPortfolio: addToPortfolio,
          isProfilePic: makeProfilePicture,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update photo");
      }

      const data = await res.json();
      if (data.changedProfilePic) {
        await update();
        toast({
          title: "Profile picture updated",
          description: `Photo ${editPhoto.alt} has been set as your profile picture.`,
        });
      }

      toast({
        title: "Photo updated",
        description: `Photo ${editPhoto.alt} has been updated.`,
      });

      setPhotos((prev) =>
        prev.map((p) =>
          p.id === editPhoto.id
            ? {
                ...p,
                alt: editAlt,
                portfolio: addToPortfolio,
                profilePic: makeProfilePicture,
              }
            : p
        )
      );
      setEditDialogOpen(false);
      setEditPhoto(null);
      setSelectedPhotos(new Set());
    } catch (err) {
      console.error("Failed to update photo:", err);
      toast({
        title: "Error",
        description: "Failed to update photo.",
        variant: "destructive",
      });
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
      console.log(deletedPhotos);
      setPhotos((prev) =>
        prev.filter((photo) => !selectedPhotos.has(photo.id))
      );
      setSelectedPhotos(new Set());
      setConfirmDialogOpen(false);
      if (data.clearedProfilePic && session) {
        await update();
      }
      const MAX_INDIVIDUAL = 5;
      const delay = 300;

      const individualPhotos = deletedPhotos.slice(0, MAX_INDIVIDUAL);
      const remainingCount = deletedPhotos.length - individualPhotos.length;

      individualPhotos.forEach((photo, index) => {
        setTimeout(() => {
          toast({
            title: "Photo deleted",
            description: `Photo ${photo.fileName} has been deleted.`,
          });
        }, index * delay);
      });

      if (remainingCount > 0) {
        setTimeout(() => {
          toast({
            title: "Photos deleted",
            description: `And ${remainingCount} more photo${
              remainingCount > 1 ? "s" : ""
            } were deleted.`,
          });
        }, individualPhotos.length * delay);
      }
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
  }, [editPhoto, user]);

  return (
    <div className="space-y-4">
      <div className="bg-muted min-h-14 rounded-md">
        <div className="flex items-center gap-4 py-3 px-4">
          {onSelect ? (
            <>
              <Button
                variant="destructive"
                disabled={selectedPhotos.size < 1 || isCheckingUsage}
                onClick={confirmDelete}
                size="sm"
                className="gap-1"
              >
                {isCheckingUsage && <Loader2 className="animate-spin" />}
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
                disabled
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
              Modify photo details like title.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center mb-4">
            {editPhoto && (
              <div className="flex justify-center items-center">
                <Image
                  src={editPhoto.src.large}
                  alt={editPhoto.alt}
                  width={300}
                  height={300}
                />
              </div>
            )}
          </div>
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
              <Switch
                id="portfolio"
                checked={addToPortfolio}
                onCheckedChange={(v) => setAddToPortfolio(!!v)}
              />
              <Label htmlFor="portfolio">Add to Portfolio</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
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

            {usedPhotos.length > 0 ? (
              <>
                <DialogDescription>
                  Some selected photos are in use:
                </DialogDescription>
                <div className="space-y-4 text-sm p-2 text-red-600">
                  {usedPhotos
                    .filter((photo) => selectedPhotos.has(photo.id))
                    .map((photo) => {
                      return (
                        <div
                          key={photo.id}
                          className="relative bg-muted p-3 rounded-lg flex items-start gap-4"
                        >
                          <button
                            onClick={() =>
                              setSelectedPhotos((prev) => {
                                const updated = new Set(prev);
                                updated.delete(photo.id);
                                return updated;
                              })
                            }
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
                                    {photo.articles
                                      .map((a) => a.title)
                                      .join(", ")}
                                  </span>
                                </li>
                              )}
                              {photo.galleries.length > 0 && (
                                <li>
                                  In galleries:{" "}
                                  <span className="font-semibold">
                                    {photo.galleries
                                      .map((g) => g.title)
                                      .join(", ")}
                                  </span>
                                </li>
                              )}
                              {photo.url === user?.profilePic && (
                                <li>Used as profile picture</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      );
                    })}

                  <p className="mt-2">
                    Deleting these photos may break links or remove them from
                    published content.
                  </p>
                </div>
              </>
            ) : (
              <DialogDescription>
                This action cannot be undone. Are you sure you want to
                permanently delete the selected photos?
              </DialogDescription>
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
