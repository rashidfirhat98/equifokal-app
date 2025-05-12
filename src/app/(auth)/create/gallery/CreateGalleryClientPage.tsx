"use client";

import GalleryForm from "@/components/GalleryForm";
import GalleryList from "@/components/GalleryList";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSessionContext } from "@/components/SessionContext";
import { Suspense } from "react";

export default function CreateGalleryClientPage({
  galleryCount,
}: {
  galleryCount: number;
}) {
  const session = useSessionContext();

  if (!session) {
    return <p className="large">User not found</p>;
  }
  return (
    <section className="px-2 py-3">
      <h1 className="heading-2 my-8">Galleries</h1>
      <GalleryForm userId={session.user.id} galleriesAmt={galleryCount} />
      {galleryCount > 0 && (
        <div>
          <h2 className="heading-5 mt-10">Your Galleries</h2>
          <Suspense fallback={<LoadingSpinner />}>
            <GalleryList userId={session.user.id} />
          </Suspense>
        </div>
      )}
    </section>
  );
}
