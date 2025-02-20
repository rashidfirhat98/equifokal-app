"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import * as exifr from "exifr";
import { uploadImage } from "@/app/dashboard/actions";
import {
  AcceptedImageTypeSchema,
  AcceptedImageUploads,
} from "@/models/ImageUploadSchema";

export default function UploadForm() {
  const form = useForm<AcceptedImageUploads>({
    resolver: zodResolver(AcceptedImageTypeSchema),
    defaultValues: {
      img_uploads: undefined,
    },
  });

  const { setValue } = form;
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [photoDetails, setPhotoDetails] = useState<any>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(files);
      setValue("img_uploads", files, { shouldValidate: true });

      // Extract metadata from all images concurrently
      const metadataPromises = Array.from(files).map(async (file) => {
        const metadata = await exifr.parse(file).catch(() => ({}));
        return metadata
          ? {
              file,
              exifMetadata: {
                model: metadata.Model ?? null,
                aperture: metadata.FNumber ?? null,
                focalLength: metadata.FocalLength ?? null,
                exposureTime: metadata.ExposureTime ?? null,
                iso: metadata.ISO ?? null,
                flash: metadata.Flash ?? null,
              },
            }
          : { file };
      });
      // Wait for all metadata to be processed
      const allMetadata = await Promise.all(metadataPromises);
      setPhotoDetails(allMetadata);
    }
  };

  function onSubmit(data: AcceptedImageUploads) {
    let formData = new FormData();

    if (data.img_uploads && photoDetails.length) {
      Array.from(data.img_uploads).forEach((file, index) => {
        formData.append("files", file); // Append each file

        // Find matching metadata from photoDetails state
        const matchedMetadata = photoDetails.find(
          (detail: any) => detail.file.name === file.name
        );

        if (matchedMetadata?.exifMetadata) {
          formData.append(
            `metadata[${index}]`,
            JSON.stringify(matchedMetadata.exifMetadata)
          );
        }
      });
    }

    console.log([...formData.entries()]); // Debugging: Log FormData contents
    try {
      uploadImage(null, formData);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Card className="mx-3 flex flex-col items-center text-center">
      <CardHeader className="items-center pt-8">
        <CardTitle>Photo Bucket</CardTitle>
        <CardDescription>
          You don't have any photos in the bucket. Click to add more photos. Or
          how about viewing the creations of other travellers for some
          inspiration?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 w-full">
        <Collapsible className="space-y-10">
          <div className="flex flex-row justify-center items-center gap-4">
            <CollapsibleTrigger asChild>
              <Button variant="default">Add Photos</Button>
            </CollapsibleTrigger>
            <Button variant="outline">Get Inspired</Button>
          </div>
          <CollapsibleContent className="space-y-1">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <FormField
                  control={form.control}
                  name="img_uploads"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="outline-dashed border-none outline-gray-300 w-full min-h-56 shadow-none"
                          id="current"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileChange}
                          {...fieldProps}
                        />
                      </FormControl>
                      <FormDescription>
                        Drag or click on the box to upload photos
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <div className="flex flex-row justify-end w-full">
                  <Button type="submit">Upload</Button>
                </div>
              </form>
            </Form>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
