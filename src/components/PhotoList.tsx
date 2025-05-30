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
import PhotoCard from "./PhotoCard";
import { EditPhotoDialog } from "./EditPhotoDialog";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { ManagePortfolioDialog } from "./ManagePortfolioDialog";

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
  portfolio: boolean;
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

      const { changedProfilePic, removedProfilePic } = await res.json();
      if (changedProfilePic) {
        await update();
        toast({
          title: "Profile picture updated",
          description: `Photo ${editPhoto.alt} has been set as your profile picture.`,
        });
      } else if (removedProfilePic) {
        await update();
        toast({
          title: "Profile picture removed",
          description: `Photo ${editPhoto.alt} has been removed as your profile picture.`,
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
            return (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isSelected={selectedPhotos.has(photo.id)}
                onSelect={!!onSelect}
                toggleSelect={toggleSelect}
                setEditPhoto={setEditPhoto}
                setEditDialogOpen={setEditDialogOpen}
              />
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
      <EditPhotoDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        editPhoto={editPhoto}
        editAlt={editAlt}
        setEditAlt={setEditAlt}
        addToPortfolio={addToPortfolio}
        setAddToPortfolio={setAddToPortfolio}
        makeProfilePicture={makeProfilePicture}
        setMakeProfilePicture={setMakeProfilePicture}
        onSave={editSelected}
      />
      <ConfirmDeleteDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        selectedPhotos={selectedPhotos}
        usedPhotos={usedPhotos}
        user={user}
        onDelete={deleteSelected}
        onDeselectPhoto={(id) =>
          setSelectedPhotos((prev) => {
            const updated = new Set(prev);
            updated.delete(id);
            return updated;
          })
        }
      />
      <ManagePortfolioDialog
        open={isPortfolioModalOpen}
        onOpenChange={setIsPortfolioModalOpen}
        photos={photos}
        selectedPhotos={selectedPhotos}
        toggleSelect={toggleSelect}
        onSave={handleSavePortfolioChanges}
      />
    </div>
  );
}
