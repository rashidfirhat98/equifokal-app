"use client";

import { useState, useEffect, useRef } from "react";
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
  FormDescription,
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
import { Check, ChevronsUpDown, Loader2, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { GallerySchema } from "@/models/Gallery";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AcceptedCoverImageSchema,
  AcceptedCoverImageUploads,
  UploadImageResult,
} from "@/models/ImageUploadSchema";
import { Textarea } from "./ui/textarea";
import { extractPhotoDetails } from "@/lib/utils/extractPhotoDetails";
import { Article } from "@/models/Article";

type Props = {
  galleries?: z.infer<typeof GallerySchema>[];
  existingArticle?: Article;
};

const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title is required and must be at least 3 characters."),
  content: z
    .string()
    .min(50, "Content is required and must be at least 50 characters."),
  description: z
    .string()
    .min(30, "Description is required and must be at least 30 characters.")
    .max(140, "Description must be below 140 characters."),
  coverImage: AcceptedCoverImageSchema,
  galleryIds: z.array(z.number()).optional(),
});

export default function ArticleForm({ galleries, existingArticle }: Props) {
  const router = useRouter();
  const [coverImage, setCoverImage] =
    useState<AcceptedCoverImageUploads | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    status: "",
    message: "",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      description: "",
      coverImage: undefined,
      galleryIds: [],
    },
  });

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  // TipTap Editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setValue("content", editor.getHTML());
    },
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("draftArticle");
    if (saved) {
      const parsed = JSON.parse(saved);
      setValue("title", parsed.title || "");
      editor?.commands.setContent(parsed.content || "");
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
          description: watch("description"),
          galleryIds: watch("galleryIds"),
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [watch, editor, coverImage]);

  // Handle Cover Image Upload
  // const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setCoverImage(reader.result as string)
  //       console.log(reader.result)
  //     }
  //     reader.readAsDataURL(file);

  //   }
  // };
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    const photoDetail = await extractPhotoDetails(file);
    setCoverImage(photoDetail);
    setValue("coverImage", photoDetail, { shouldValidate: true });
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      let coverImageUpload: UploadImageResult | undefined;
      if (data.coverImage) {
        const { file, exifMetadata } = data.coverImage;

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

        const uploadResults = [
          {
            fileName: file.name,
            url: publicUrl,
            metadata: exifMetadata,
          },
        ];

        const result = await fetch("/api/upload-metadata", {
          method: "POST",
          body: JSON.stringify({
            files: uploadResults,
            isPortfolio: false,
            isProfilePic: false,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        coverImageUpload = await result.json();
        if (!result.ok)
          throw new Error(
            coverImageUpload?.message || "Metadata upload failed"
          );
      }

      const isEditing = !!existingArticle;
      const method = isEditing ? "PATCH" : "POST";
      const endpoint = isEditing
        ? `/api/articles/${existingArticle.id}`
        : "/api/articles";

      const response = await fetch(endpoint, {
        method,
        body: JSON.stringify({
          ...data,
          uploadResult: coverImageUpload ?? existingArticle?.coverImage,
        }),
      });

      if (!response.ok) throw new Error("Failed to create article");
      // setAlert({ status: response.status, message: response.message });
      localStorage.removeItem("draftArticle");
      reset();
      editor?.commands.setContent("");
      fileInputRef.current!.value = "";
      router.push("/");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.log(errors);
        })}
        className="mx-auto py-6 space-y-4"
      >
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormControl>
                <div className="relative w-full min-h-56 border border-dashed border-gray-300 rounded-md flex items-center justify-center bg-white hover:bg-gray-50 transition overflow-hidden">
                  {coverImage?.file && (
                    <>
                      <Image
                        src={URL.createObjectURL(coverImage.file)}
                        alt="Preview"
                        fill
                        className="object-cover opacity-30 pointer-events-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoverImage(null);
                          setValue("coverImage", null, {
                            shouldValidate: true,
                          });
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="absolute top-2 right-2 z-20 bg-white text-gray-600 hover:text-red-600 p-1 rounded-full shadow"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <Input
                    ref={fileInputRef}
                    className="outline-dashed border-none outline-gray-300 w-full min-h-56 shadow-none"
                    id="current"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file);
                      }
                    }}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Drag or click on the box to upload photos
              </FormDescription>
            </FormItem>
          )}
        />
        {errors.coverImage && (
          <p className="text-red-500 text-sm">{`${errors.coverImage.message}`}</p>
        )}

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
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={() => (
            <div className="border border-gray-300 rounded-lg p-3">
              <EditorContent editor={editor} className="min-h-[200px]" />
            </div>
          )}
        />
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}

        {galleries && (
          <FormField
            control={form.control}
            name="galleryIds"
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
                              {field.value.length}{" "}
                              {field.value.length === 1
                                ? "gallery"
                                : "galleries"}{" "}
                              selected
                            </span>
                          ) : (
                            <span className="text-gray-500">
                              Select galleries...
                            </span>
                          )}
                          <ChevronsUpDown className="ml-auto opacity-50" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        align="start"
                        className="w-[var(--radix-popover-trigger-width)] max-h-[300px]"
                      >
                        <Command>
                          <CommandInput
                            placeholder="Search galleries..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No galleries found.</CommandEmpty>
                            <CommandGroup className="max-h-60 overflow-y-auto">
                              {galleries.map((gallery) => {
                                const isSelected = field.value?.includes(
                                  gallery.id
                                );
                                return (
                                  <CommandItem
                                    key={gallery.id}
                                    onSelect={() => {
                                      const newValue = isSelected
                                        ? (field.value || []).filter(
                                            (gid: number) => gid !== gallery.id
                                          )
                                        : [...(field.value || []), gallery.id];
                                      field.onChange(newValue);
                                    }}
                                    className="flex flex-col items-start gap-2 p-2"
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span className="text-sm font-medium">
                                        {gallery.title}
                                      </span>
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          isSelected
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
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

        <div className="w-full sm:flex sm:justify-end">
          <Button
            className="w-full sm:w-auto"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" /> Publishing
              </>
            ) : (
              "Publish"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
