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
import { AcceptedImageTypeSchema } from "@/models/ImageUploadSchema";
import { Loader2 } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { z } from "zod";
import { extractPhotoDetails } from "@/lib/utils/extractPhotoDetails";
import { Switch } from "./ui/switch";

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

const formSchema = z.object({
  imgUploads: AcceptedImageTypeSchema,
  isPortfolio: z.boolean().default(false).optional(),
});

export default function UploadForm({
  photosAmt,
}: {
  photosAmt: number | null;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imgUploads: undefined,
      isPortfolio: false,
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { reset, setValue } = form;
  const [photoDetails, setPhotoDetails] = useState<PhotoDetails[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<Alert>({
    status: "",
    message: "",
  });

  const handleFileChange = async (files: FileList) => {
    if (files) {
      const metadataPromises = Array.from(files).map((file) =>
        extractPhotoDetails(file)
      );

      const photoDetails = await Promise.all(metadataPromises);
      setPhotoDetails(photoDetails);
    }
  };

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!photoDetails?.length) return;

    setIsLoading(true);

    try {
      const uploadResults = await Promise.all(
        photoDetails.map(async (photo) => {
          const { file, exifMetadata } = photo;

          const signedUrlRes = await fetch("/api/s3-upload-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileName: file.name,
              fileType: file.type,
            }),
          });

          const { url, publicUrl } = await signedUrlRes.json();

          const uploadRes = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });

          if (!uploadRes.ok) throw new Error("Upload to S3 failed");

          return {
            fileName: file.name,
            url: publicUrl,
            metadata: exifMetadata,
          };
        })
      );

      // Send metadata + S3 URLs to your DB via server action
      const result = await fetch("/api/upload-metadata", {
        method: "POST",
        body: JSON.stringify({
          files: uploadResults,
          isPortfolio: data.isPortfolio,
          isProfilePic: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await result.json();
      if (!result.ok) throw new Error(json.message || "Metadata upload failed");

      setAlert({ status: "success", message: "Upload completed" });
      reset();
      setPhotoDetails([]);
      fileInputRef.current!.value = "";
    } catch (error) {
      console.error(error);
      setAlert({ status: "error", message: "Upload failed. Try again." });
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
                className="space-y-6"
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
                    <FormItem className="flex items-center space-x-3 space-y-0 p-4">
                      <FormControl>
                        <Switch
                          id="portfolio"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 text-left leading-none">
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
