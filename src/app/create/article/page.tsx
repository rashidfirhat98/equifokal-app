"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "next/image";

// Validation Schema
const articleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

export default function CreateArticlePage() {
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
  });

  // TipTap Editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setValue("content", editor.getHTML());
    },
  });

  // Auto-save to localStorage
  useEffect(() => {
    const savedContent = localStorage.getItem("draftArticle");
    if (savedContent) {
      const parsed = JSON.parse(savedContent);
      setValue("title", parsed.title || "");
      editor?.commands.setContent(parsed.content || "");
      setCoverImage(parsed.coverImage || null);
    }
  }, [setValue, editor]);

  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem(
        "draftArticle",
        JSON.stringify({ title: watch("title"), content: editor?.getHTML(), coverImage })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [watch, editor, coverImage]);

  // Handle Cover Image Upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Submit Article
  const onSubmit = async (data: ArticleFormData) => {
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
    <div className="max-w-3xl mx-auto py-6">
      {/* Cover Image Upload */}
      <div className="relative w-full h-56 bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden">
        {coverImage ? (
          <Image src={coverImage} alt="Cover" className="w-full h-full object-cover" width={500} height={300} />
        ) : (
          <label className="cursor-pointer text-gray-600">
            Upload Cover Image
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        )}
      </div>

      {/* Title Input */}
      <Input {...register("title")} placeholder="Enter article title..." className="w-full text-3xl border-none focus:ring-0 mt-4" />
      {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

      {/* TipTap Editor */}
      <div className="border border-gray-300 rounded-lg p-3 mt-4">
        <EditorContent editor={editor} className="min-h-[200px]" />
      </div>
      {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}

      {/* Tags Selection (ShadCN Select) */}
      <Select onValueChange={(value) => setValue("tags", [value])}>
        <SelectTrigger className="mt-4">
          <SelectValue placeholder="Select a tag" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tech">Tech</SelectItem>
          <SelectItem value="business">Business</SelectItem>
          <SelectItem value="lifestyle">Lifestyle</SelectItem>
        </SelectContent>
      </Select>

      {/* Publish Button */}
      <div className="flex justify-end mt-6">
        <Button onClick={handleSubmit(onSubmit)} disabled={saving}>
          {saving ? "Publishing..." : "Publish"}
        </Button>
      </div>
    </div>
  );
}
