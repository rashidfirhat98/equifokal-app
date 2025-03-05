"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function TipTapEditor({ content, onChange }: { content?: string; onChange: (value: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // Send updated HTML content to the parent component
    },
  });

  return (
    <div className="border rounded-md p-4">
      <EditorContent editor={editor} className="prose max-w-none" />
    </div>
  );
}
