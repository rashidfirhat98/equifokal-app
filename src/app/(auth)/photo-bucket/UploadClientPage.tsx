"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import PhotoList from "@/components/PhotoList";
import { useSessionContext } from "@/components/SessionContext";
import UploadForm from "@/components/UploadForm";
import React, { Suspense } from "react";

export default function UploadClientPage({
  photoCount,
}: {
  photoCount: number;
}) {
  const session = useSessionContext();

  if (!session?.user) {
    return <p className="large">User not found.</p>;
  }

  return (
    <section className="px-2 py-3">
      <h1 className="heading-2 my-8">Photo Bucket</h1>
      <UploadForm photosAmt={photoCount} />
      {photoCount && photoCount > 0 && (
        <div>
          <h2 className="heading-5 mt-10">Your Photos</h2>
          <Suspense fallback={<LoadingSpinner />}>
            <PhotoList userId={session.user.id} />
          </Suspense>
        </div>
      )}
    </section>
  );
}
