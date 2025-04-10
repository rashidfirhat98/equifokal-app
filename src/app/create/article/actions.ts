"use server"


import env from "@/lib/env";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import * as z from "zod";
import { GalleriesSchemaWithImages } from "@/models/Gallery";

export async function getGalleries({
	page = 1,
	per_page = 10,
}: {
	page?: number;
	per_page?: number;
}): Promise<z.infer<typeof GalleriesSchemaWithImages>> {
	const offset = (page - 1) * per_page;

	// Fetch total gallery count for pagination
	const total_results = await prisma.gallery.count();

	// Fetch galleries with pagination
	//TODO filter by user
	const galleries = await prisma.gallery.findMany({
		skip: offset,
		take: per_page,
		orderBy: { createdAt: "desc" },
		include: {
			images: {
				include: {
					image: {
						include: {
							metadata: true,
						},
					},
				},
			},
		},
	});

	const formattedGalleries = galleries.map((gallery) => ({
		id: gallery.id,
		title: gallery.title,
		description: gallery.description || undefined,
		images: gallery.images.map((galleryImage) => ({
			id: galleryImage.image.id,
			url: galleryImage.image.url,
			width: galleryImage.image.metadata?.width ?? 0,
			height: galleryImage.image.metadata?.height ?? 0,
			alt: galleryImage.image.fileName,
			src: { large: galleryImage.image.url },
			blurredDataUrl: undefined,
			metadata: galleryImage.image.metadata
				? {
					model: galleryImage.image.metadata.model || undefined,
					aperture: galleryImage.image.metadata.aperture || undefined,
					focalLength: galleryImage.image.metadata.focalLength || undefined,
					exposureTime: galleryImage.image.metadata.exposureTime || undefined,
					iso: galleryImage.image.metadata.iso || undefined,
					flash: galleryImage.image.metadata.flash || undefined,
					height: galleryImage.image.metadata.height || undefined,
					width: galleryImage.image.metadata.width || undefined,
				}
				: undefined,
		})),
		createdAt: gallery.createdAt.toISOString(),
		updatedAt: gallery.updatedAt.toISOString(),
	}));

	return {
		page,
		per_page,
		total_results,
		prev_page:
			page > 1
				? `/api/galleries?page=${page - 1}&per_page=${per_page}`
				: undefined,
		next_page:
			page * per_page < total_results
				? `/api/galleries?page=${page + 1}&per_page=${per_page}`
				: undefined,
		galleries: formattedGalleries,
	};
}
