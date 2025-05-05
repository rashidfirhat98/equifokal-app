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
import { Photo } from "@/models/Images";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { submitGalleryData } from "@/app/gallery/actions";

type Props = {
  galleriesAmt?: number;
};

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  photoIds: z.array(z.number()).min(1, "Select at least one image"),
});

export default function GalleryForm({ galleriesAmt }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [alert, setAlert] = useState({
    status: "",
    message: "",
  });

  const [hasLoaded, setHasLoaded] = useState(false);
  const isFetchingRef = useRef(false);
  const hasFetched = useRef(false);

  const fetchMoreImages = useCallback(async () => {
    if (isFetchingRef.current || (hasLoaded && !nextCursor)) return;

    isFetchingRef.current = true;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/user/photos?&cursor=${nextCursor ?? ""}&limit=10`
      );
      const data = await res.json();

      setPhotos((prev) => [...prev, ...data.photos]);
      setNextCursor(data.nextCursor);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
      setHasLoaded(true);
      isFetchingRef.current = false;
    }
  }, [nextCursor, hasLoaded]);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchMoreImages();
      hasFetched.current = true;
    }
  }, [fetchMoreImages]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      photoIds: [],
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    setAlert({ status: "", message: "" });

    try {
      const response = await submitGalleryData(data);
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
    <Card className="flex flex-col items-center">
      <CardHeader className="text-center pt-8">
        {/* <CardTitle>Create a gallery</CardTitle> */}
        <CardDescription>
          {galleriesAmt
            ? `You have ${galleriesAmt} galleries previously created. `
            : "You don't have any galleries yet. "}
          Add photos from your bucket to create a gallery here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 w-full">
        <Collapsible className="space-y-10">
          <div className="flex flex-row justify-center items-center gap-4">
            <CollapsibleTrigger asChild>
              <Button>Add a new Gallery</Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-1">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" space-y-4 "
              >
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
                              photos={photos}
                              loading={loading}
                              onLoadMore={fetchMoreImages}
                              hasMore={!!nextCursor}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                )}

                <div className="w-full flex flex-row justify-end pt-6">
                  <Button
                    className="w-full sm:w-auto"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Gallery"}
                  </Button>
                </div>
              </form>
            </Form>
          </CollapsibleContent>
        </Collapsible>
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
