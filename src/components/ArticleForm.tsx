"use client"


import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { GallerySchema } from "@/models/Gallery";
import { zodResolver } from "@hookform/resolvers/zod";
import * as exifr from "exifr";
import { AcceptedImageTypeSchema } from "@/models/ImageUploadSchema";

type Props = {
  galleries?: z.infer<typeof GallerySchema>[];
};

export default function ArticleForm({galleries} : Props ) {
  const router = useRouter();
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [photoDetails, setPhotoDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    status: "",
    message: "",
  });

  const formSchema = z.object({
    title: z.string().min(3, "Title is required and must be at least 3 characters."),
    content: z.string().min(50, "Content is required and must be at least 50 characters."),
    coverImage: AcceptedImageTypeSchema,
    galleryId: z.array(z.number()).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      coverImage: undefined,
      galleryId: [],
    },
  });

  const { handleSubmit, setValue, watch, formState: { errors } } = form;

  // TipTap Editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setValue("content", editor.getHTML());
    },
  });

  const [open, setOpen] = useState(false);
  // Auto-load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("draftArticle");
    if (saved) {
      const parsed = JSON.parse(saved);
      setValue("title", parsed.title || "");
      editor?.commands.setContent(parsed.content || "");
      setCoverImage(parsed.coverImage || null);
    }
  }, [setValue, editor]);

  // Auto-save to localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem(
        "draftArticle",
        JSON.stringify({
          title: watch("title"),
          content: editor?.getHTML(),
          coverImage,
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [watch, editor, coverImage]);

  // Handle Cover Image Upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  //TODO: handle cover image upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(files);
      setValue("coverImageId", files, { shouldValidate: true });
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

  // Submit
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setSaving(true);
    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, coverImage }),
      });

      if (!response.ok) throw new Error("Failed to create article");

      localStorage.removeItem("draftArticle");
      router.push("/articles");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto py-6 space-y-4">
        <FormField
        control={form.control}
        name="coverImageId"
        render={() => (
            <div className="relative w-full h-56 bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden">
            {coverImage ? (
                <Image
                src={coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
                width={500}
                height={300}
                />
            ) : (
                <label className="cursor-pointer text-gray-600">
                Upload Cover Image
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
                </label>
            )}
            </div>
        )}
        />

        <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
            <Input
            {...field}
            placeholder="Enter article title..."
            className="w-full text-3xl border-none focus:ring-0"
            />
        )}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

        <FormField
        control={form.control}
        name="content"
        render={() => (
            <div className="border border-gray-300 rounded-lg p-3">
            <EditorContent editor={editor} className="min-h-[200px]" />
            </div>
        )}
        />
        {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}

        {galleries && (
            <FormField
              control={form.control}
              name="galleryId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Select Galleries</FormLabel>
                    <FormControl>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between items-center gap-3 px-3 py-2 h-auto min-h-[56px]"
                          >
                            {field.value && field.value.length > 0 ? (
                              <span className="text-sm">
                                {field.value.length} {field.value.length === 1 ? 'gallery' : 'galleries'} selected
                              </span>
                            ) : (
                              <span className="text-gray-500">Select galleries...</span>
                            )}
                            <ChevronsUpDown className="ml-auto opacity-50" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] max-h-[300px]">
                          <Command>
                            <CommandInput placeholder="Search galleries..." className="h-9" />
                            <CommandList>
                              <CommandEmpty>No galleries found.</CommandEmpty>
                              <CommandGroup className="max-h-60 overflow-y-auto">
                                {galleries.map((gallery) => {
                                  const isSelected = field.value?.includes(gallery.id);
                                  return (
                                    <CommandItem
                                      key={gallery.id}
                                      onSelect={() => {
                                        const newValue = isSelected
                                          ? (field.value || []).filter((gid: number) => gid !== gallery.id)
                                          : [...(field.value || []), gallery.id];
                                        field.onChange(newValue);
                                      }}
                                      className="flex flex-col items-start gap-2 p-2"
                                    >
                                      <div className="flex items-center justify-between w-full">
                                        <span className="text-sm font-medium">{gallery.title}</span>
                                        <Check className={cn("ml-auto", isSelected ? "opacity-100" : "opacity-0")} />
                                      </div>
                                      <div className="flex gap-2 flex-wrap">
                                        {gallery.images.map((image) => (
                                          <Image
                                            key={image.id}
                                            src={image.url}
                                            alt={image.alt}
                                            width={48}
                                            height={48}
                                            className="rounded-md object-cover"
                                          />
                                        ))}
                                      </div>
                                    </CommandItem>
                                  );
                                })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          )}

        <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
            {saving ? "Publishing..." : "Publish"}
        </Button>
        </div>
        </form>
    </Form>
  )
}