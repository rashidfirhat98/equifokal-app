import GalleryForm from "@/components/GalleryForm";
import GalleryList from "@/components/GalleryList";
import {
  fetchUserGalleryCount,
  fetchUserSession,
} from "../../../gallery/actions";
import { unauthorized } from "next/navigation";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import CreateGalleryClientPage from "./CreateGalleryClientPage";

export default async function CreateGalleryPage() {
  const user = await fetchUserSession();

  if (!user) {
    return unauthorized();
  }

  const galleryCount = await fetchUserGalleryCount(user.id);

  return <CreateGalleryClientPage galleryCount={galleryCount} />;
}
