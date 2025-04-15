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
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { GallerySchema } from "@/models/Gallery";
import { zodResolver } from "@hookform/resolvers/zod";
import * as exifr from "exifr";
import { AcceptedCoverImageSchema } from "@/models/ImageUploadSchema";
import CreateArticlePage from "@/app/create/article/page";
import { uploadImage } from "@/app/create/actions";


type Props = {
  galleries?: z.infer<typeof GallerySchema>[];
};

export default function ArticleForm({ galleries }: Props) {
  const router = useRouter();
  const [coverImage, setCoverImage] = useState<z.infer<typeof AcceptedCoverImageSchema> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFiles] = useState<FileList | null>(null);
  const [photoDetails, setPhotoDetails] = useState<any>(null);
  const [alert, setAlert] = useState({
    status: "",
    message: "",
  });

  const formSchema = z.object({
    title: z.string().min(3, "Title is required and must be at least 3 characters."),
    content: z.string().min(50, "Content is required and must be at least 50 characters."),
    coverImage: AcceptedCoverImageSchema,
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
          galleryId: watch("galleryId")
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
  //TODO: handle cover image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    console.log(file);

    try {
      // Extract EXIF metadata
      let metadata = await exifr.parse(file);
      metadata = metadata || {};

      const img = new window.Image();
      img.src = URL.createObjectURL(file) as string;

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

        setPhotoDetails([photoDetail]);
        setCoverImage(photoDetail);
        setValue("coverImage", photoDetail, { shouldValidate: true });
        console.log(photoDetail)
        console.log(coverImage);
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

        setPhotoDetails([photoDetail]);
        setCoverImage(photoDetail);
        setValue("coverImage", photoDetail, { shouldValidate: true });
        console.log(photoDetails)
        console.log(coverImage);
      };
    }


  };

  // Submit
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      console.log("data", data);

      console.log("HEREEEE", coverImage)
      let formData = new FormData()

      if (data.coverImage) {

        formData.append("files[0]", data.coverImage.file); // Append each file

        formData.append(
          `metadata[0]`,
          JSON.stringify(data.coverImage.exifMetadata)
        );
      }

      console.log(formData)
      const imageRes = await uploadImage(formData)
      // const response = await createArticle()
      // const response = await fetch("/api/articles", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ ...data, coverImage }),
      // });

      // if (!response.ok) throw new Error("Failed to create article");
      // setAlert({ status: response.status, message: response.message });
      localStorage.removeItem("draftArticle");
      router.push("/");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto py-6 space-y-4">
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="outline-dashed border-none outline-gray-300 w-full min-h-56 shadow-none"
                  id="current"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  {...fieldProps}
                />
              </FormControl>
              <FormDescription>
                Drag or click on the box to upload photos
              </FormDescription>
            </FormItem>
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </form>
    </Form>
  )
}