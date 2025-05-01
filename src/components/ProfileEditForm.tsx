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
import profilePic from "@/assets/images/EQFKL_logo.jpg";
import { Button } from "./ui/button";
import { AcceptedCoverImageSchema } from "@/models/ImageUploadSchema";
import { Checkbox } from "./ui/checkbox";

type Props = {
  userDetails: {
    name: string;
    id: string;
    email: string;
    emailVerified: Date | null;
    password: string | null;
    createdAt: Date;
    updatedAt: Date;
    profilePic: string | null;
    bio: string | null;
  };
};

const formSchema = z.object({
  name: z.string(),
  email: z.string(),
  bio: z.string().optional(),
  profilePic: AcceptedCoverImageSchema.optional(),
  isProfilePic: z.boolean().default(true),
});

export default function ProfileEditForm({ userDetails }: Props) {
  //TODO: Call user details API
  //TODO: Change to edit profile form
  const profilePicURL = userDetails.profilePic || profilePic;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userDetails?.name || "",
      email: userDetails?.email || "",
      bio: userDetails?.bio || "",
      profilePic: undefined,
      isProfilePic: true,
    },
  });

  const { setValue } = form;
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    userDetails?.profilePic ?? null
  );
  const [alert, setAlert] = useState({
    status: "",
    message: "",
  });

  const handleOnchange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      let metadata = await exifr.parse(file);
      metadata = metadata || {};

      const img = new window.Image();
      img.src = URL.createObjectURL(file) as string;

      setPreviewUrl(URL.createObjectURL(file));

      img.onload = () => {
        const exifMetadata = {
          height: metadata.ImageHeight ?? img.height,
          width: metadata.ImageWidth ?? img.width,
          model: metadata.Model ?? null,
          aperture: metadata.FNumber ?? null,
          focalLength: metadata.FocalLength ?? null,
          exposureTime: metadata.ExposureTime ?? null,
          iso: metadata.ISO ?? null,
          flash: metadata.Flash ?? null,
        };

        const photoDetail = {
          file,
          exifMetadata,
        };

        setValue("profilePic", photoDetail, { shouldValidate: true });
      };
    } catch (error) {
      // Fallback: if EXIF fails, just get dimensions
      const img = new window.Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const exifMetadata = {
          height: img.height,
          width: img.width,
          model: null,
          aperture: null,
          focalLength: null,
          exposureTime: null,
          iso: null,
          flash: null,
        };

        const photoDetail = {
          file,
          exifMetadata,
        };

        setValue("profilePic", photoDetail, { shouldValidate: true });
      };
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    if (data.bio) {
      formData.append("bio", data.bio);
    }

    if (data.profilePic) {
      formData.append("files", data.profilePic.file); // Append each file
      formData.append(
        `metadata[0]`,
        JSON.stringify(data.profilePic.exifMetadata)
      );
    }

    formData.append("isProfilePic", JSON.stringify(data.isProfilePic));

    try {
      const res = await fetch("/api/user/edit", {
        method: "POST",
        body: formData,
      });

      console.log(res);

      setAlert({ status: "success", message: "Profile edited" });

      if (!res.ok) throw new Error("Failed to create article");
      // if (res?.error) {
      //   setAlert({ status: "error", message: "Invalid email or password" });
      //   return;
      // }

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
                    src={previewUrl || profilePicURL}
                    className="rounded-full mb-6 aspect-square object-cover"
                  />

                  <Input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleOnchange}
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
