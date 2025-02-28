"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import MultiSelectInput from "./MultiSelectInput";
import { ImagesResults } from "@/models/Images";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "./ui/textarea";
import { createGallery } from "@/app/dashboard/actions";

type Props = {
  photos?: ImagesResults | undefined;
};

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  photoIds: z.array(z.number()).min(1, "Select at least one image"),
});

export default function GalleryForm({ photos }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    status: "",
    message: "",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      photoIds: [], // Ensure it always initializes as an array
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    setAlert({ status: "", message: "" });

    try {
      const response = await createGallery(data);

      setAlert({ status: response.status, message: response.message });
      form.reset();
      router.refresh();
    } catch (error) {
      console.error("Error creating gallery:", error);

      setAlert({
        status: "error",
        message: "Failed to create gallery. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="mx-3">
      <CardHeader>
        <CardTitle>Create a gallery</CardTitle>
        <CardDescription>
          Add a photos from your bucket to create a gallery here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4 ">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Gallery Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Gallery Description (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Multi-Select Image Picker */}
            {photos && (
              <FormField
                control={form.control}
                name="photoIds"
                render={({ field }) => {
                  console.log("photoIds value:", field.value); // Debug log

                  return (
                    <FormItem>
                      <FormLabel>Select Images</FormLabel>
                      <FormControl>
                        <MultiSelectInput
                          selectedPhotos={field.value ?? []} // Ensure it's always an array
                          setSelectedPhotos={field.onChange}
                          photos={photos.photos}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            )}

            <div className="w-full flex flex-row justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Gallery"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p
          className={`${
            alert.status === "success" ? "text-green-500" : "text-red-500"
          }`}
        >
          {alert.message}
        </p>
      </CardFooter>
    </Card>
  );
}
