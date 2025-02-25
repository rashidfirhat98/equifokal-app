"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    status: "",
    message: "",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(files);
      setValue("img_uploads", files, { shouldValidate: true });
      setAlert({ status: "", message: "" });

      // Extract metadata from all images concurrently
      const metadataPromises = Array.from(files).map(
        (file) =>
          new Promise((resolve) => {
            exifr
              .parse(file)
              .then((metadata) => {
                metadata = metadata || {}; // Ensure metadata is always an object

                const img = new Image();
                img.src = URL.createObjectURL(file);

                img.onload = () => {
                  resolve({
                    file,
                    exifMetadata: {
                      height: metadata.ImageHeight ?? img.height,
                      width: metadata.ImageWidth ?? img.width,
                      model: metadata.Model ?? null,
                      aperture: metadata.FNumber ?? null,
                      focalLength: metadata.FocalLength ?? null,
                      exposureTime: metadata.ExposureTime ?? null,
                      iso: metadata.ISO ?? null,
                      flash: metadata.Flash ?? null,
                    },
                  });
                };
              })
              .catch(() => {
                // If EXIF fails, fallback to image dimensions only
                const img = new Image();
                img.src = URL.createObjectURL(file);

                img.onload = () => {
                  resolve({
                    file,
                    exifMetadata: {
                      height: img.height,
                      width: img.width,
                      model: null,
                      aperture: null,
                      focalLength: null,
                      exposureTime: null,
                      iso: null,
                      flash: null,
                    },
                  });
                };
              });
          })
      );

      // Wait for all metadata to be processed
      const allMetadata = await Promise.all(metadataPromises);
      console.log(allMetadata);

      setPhotoDetails(allMetadata);
    }
  };

  async function onSubmit(data: AcceptedImageUploads) {
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

    try {
      setIsLoading(true);
      const response = await uploadImage(formData);

      setAlert({ status: response.status, message: response.message });
    } catch (error) {
      console.log(error);
      setAlert({ status: "error", message: "Network error. Please try again" });
    } finally {
      setIsLoading(false);
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
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" /> Uploading
                      </>
                    ) : (
                      "Upload"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
      {alert.message && (
        <CardFooter>
          <p
            className={`${
              alert.status === "success" ? "text-green-500" : "text-red-500"
            }`}
          >
            {alert.message}
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
