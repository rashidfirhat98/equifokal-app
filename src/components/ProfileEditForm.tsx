"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import * as exifr from "exifr";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "./ui/textarea";
import Image from "next/image";
import { Button } from "./ui/button";
import { AcceptedCoverImageSchema } from "@/models/ImageUploadSchema";
import { Checkbox } from "./ui/checkbox";
import { profilePicURL } from "@/lib/utils/profilePic";
import { UserDetails } from "@/models/User";
import { extractPhotoDetails } from "@/lib/utils/extractPhotoDetails";

type Props = {
  userDetails: UserDetails;
};

const formSchema = z.object({
  name: z.string(),
  email: z.string(),
  bio: z.string().optional(),
  profilePicUploads: AcceptedCoverImageSchema.optional(),
  existingProfilePicURL: z.string().optional(),
  isProfilePic: z.boolean().default(true),
});

export default function ProfileEditForm({ userDetails }: Props) {
  const profilePic = profilePicURL(userDetails.profilePic);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userDetails?.name || "",
      email: userDetails?.email || "",
      bio: userDetails?.bio || "",
      profilePicUploads: undefined,
      existingProfilePicURL: userDetails?.profilePic || undefined,
      isProfilePic: true,
    },
  });

  const { setValue } = form;
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    profilePicURL(userDetails.profilePic) ?? null
  );
  const [alert, setAlert] = useState({
    status: "",
    message: "",
  });

  const handleOnchange = async (file: File) => {
    if (!file) return;

    const photoDetail = await extractPhotoDetails(file);

    setValue("profilePicUploads", photoDetail, { shouldValidate: true });
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    if (data.bio) {
      formData.append("bio", data.bio);
    }

    if (data.profilePicUploads) {
      formData.append("files", data.profilePicUploads.file);
      formData.append(
        `metadata[0]`,
        JSON.stringify(data.profilePicUploads.exifMetadata)
      );
    }

    if (data.existingProfilePicURL) {
      formData.append("profilePicURL", data.existingProfilePicURL);
    }

    formData.append("isProfilePic", JSON.stringify(data.isProfilePic));

    try {
      const res = await fetch("/api/user/edit", {
        method: "POST",
        body: formData,
      });

      setAlert({ status: "success", message: "Profile edited" });

      if (!res.ok) throw new Error("Failed to upload profile image");

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.log({ error });
      setAlert({ status: "error", message: "Network error. Please try again" });
    }
  };
  return (
    <>
      {alert.message && (
        <Alert
          variant={`${alert.status === "success" ? "default" : "destructive"}`}
        >
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Edit Profile
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (errors) =>
                console.log("Form Errors:", errors)
              )}
              className="space-y-6"
            >
              <div className="col-span-1 flex flex-col items-center justify-center">
                <div className="col-span-1 flex flex-col items-center justify-center">
                  <Image
                    width={100}
                    height={100}
                    alt="profile-pic"
                    src={previewUrl || profilePic}
                    className="rounded-full mb-6 aspect-square object-cover"
                  />

                  <Input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleOnchange(file);
                      }
                    }}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Photo
                  </Button>
                </div>
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isProfilePic"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div>
                <Button
                  type="submit"
                  className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Save Profile
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
