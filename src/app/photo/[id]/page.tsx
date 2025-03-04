import { notFound } from "next/navigation";
import Image from "next/image";
import env from "@/lib/env";

interface Photo {
  id: number;
  src: { large: string };
  alt: string;
}

export default async function PhotoPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  try {
    const res = await fetch(`${env.NEXT_PUBLIC_CLIENT_URL}/api/photo/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch photo:", res.statusText);
      return notFound(); // Show 404 if the image doesn't exist
    }

    const photo: Photo = await res.json(); // Ensure response is valid JSON

    return (
      <div className="flex justify-center items-center min-h-screen">
        <Image
          src={photo.src.large}
          alt={photo.alt}
          width={800}
          height={600}
          className="p-5"
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching photo:", error);
    return <h2 className="m-4 text-2xl font-bold">No Image Found</h2>;
  }
}
