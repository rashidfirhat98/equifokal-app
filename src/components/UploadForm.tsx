"use client";

import React, { useRef, useState } from "react";
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
  FormLabel,
} from "@/components/ui/form";
import * as exifr from "exifr";
import { AcceptedImageTypeSchema } from "@/models/ImageUploadSchema";
import { Loader2 } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { z } from "zod";

type PhotoDetails = {
  file: File;
  exifMetadata: {
    height: number | null;
    width: number | null;
    model: string | null;
    aperture: number | null;
    focalLength: number | null;
    exposureTime: number | null;
    iso: number | null;
    flash: string | null;
  };
};

type Alert = {
  status: string;
  message?: string;
};

export default function UploadForm({
  photosAmt,
}: {
  photosAmt: number | null;
}) {
  const formSchema = z.object({
    imgUploads: AcceptedImageTypeSchema,
    isPortfolio: z.boolean().default(false).optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imgUploads: undefined,
      isPortfolio: false,
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { reset, setValue } = form;
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [photoDetails, setPhotoDetails] = useState<PhotoDetails[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<Alert>({
    status: "",
    message: "",
  });

  const handleFileChange = async (files: FileList) => {
    if (files) {
      setSelectedFiles(files);

      // Extract metadata from all images concurrently
      const metadataPromises: Promise<PhotoDetails>[] = Array.from(files).map(
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
      const allMetadata: PhotoDetails[] = await Promise.all(metadataPromises);
      console.log(allMetadata);

      setPhotoDetails(allMetadata);
    }
  };

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const formData = new FormData();

    if (data.imgUploads && photoDetails?.length) {
      Array.from(data.imgUploads as FileList).forEach((file: File, index) => {
        formData.append("files", file);

        // Find matching metadata from photoDetails state
        const matchedMetadata = photoDetails.find(
          (detail: PhotoDetails) => detail.file.name === file.name
        );

        if (matchedMetadata?.exifMetadata) {
          formData.append(
            `metadata[${index}]`,
            JSON.stringify(matchedMetadata.exifMetadata)
          );
        }
      });

      formData.append("isPortfolio", JSON.stringify(data.isPortfolio));
    }

    try {
      setIsLoading(true);

      const response = await fetch("api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create article");
      const result = await response.json();
      console.log(result);
      setAlert({ status: result.status, message: result.message });
      reset();
      setPhotoDetails([]);
      setSelectedFiles(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
      setAlert({ status: "error", message: "Network error. Please try again" });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Card className="flex flex-col items-center text-center">
      <CardHeader className="items-center pt-8">
        {/* <CardTitle>Photo Bucket</CardTitle> */}
        <CardDescription>
          {photosAmt
            ? `You have ${photosAmt} photos uploaded in the bucket. `
            : "You don't have any photos in the bucket. "}
          Click to add more photos. Or how about viewing the creations of other
          travellers for some inspiration?
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
                onSubmit={form.handleSubmit(onSubmit, (errors) =>
                  setAlert({
                    status: "error",
                    message: errors.imgUploads?.message?.toString(),
                  })
                )}
                className="space-y-3"
              >
                <FormItem>
                  <FormControl>
                    <Input
                      ref={fileInputRef}
                      className="outline-dashed border-none outline-gray-300 w-full min-h-56 shadow-none"
                      id="current"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                          handleFileChange(files);
                          setValue("imgUploads", files, {
                            shouldValidate: true,
                          });
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Drag or click on the box to upload photos
                  </FormDescription>
                </FormItem>

                <FormField
                  control={form.control}
                  name="isPortfolio"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="text-left space-y-1 leading-none">
                        <FormLabel>Add to portfolio</FormLabel>
                        <FormDescription>
                          Photos will be included in your portfolio and can be
                          seen by others.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="flex sm:justify-end w-full">
                  <Button
                    className="w-full sm:w-auto"
                    type="submit"
                    disabled={isLoading}
                  >
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
