import { GalleriesResults } from "@/models/Gallery";
import GalleryCard from "./GalleryCard";
import Link from "next/link";

type Props = {
  galleries?: GalleriesResults | undefined;
};

export default async function GalleryList({ galleries }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {galleries &&
        galleries.galleries.map((gallery) => (
          <Link key={gallery.id} href={`/gallery/${gallery.id}`}>
            <GalleryCard key={gallery.id} gallery={gallery} />
          </Link>
        ))}
    </div>
  );
}
