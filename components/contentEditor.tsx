"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import EditorMenuBar from "./editorMenubar";
import { Card } from "./ui/card";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import CharacterCount from "@tiptap/extension-character-count";
import Image from "@tiptap/extension-image";

import styles from "./Tiptap.module.css";
type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function ContentEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Type a content…",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      CharacterCount,
      Image,
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: styles.proseMirror,
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [editor, value]);

  return (
    <Card className="w-full p-0">
      <EditorMenuBar editor={editor} />
      <div className="p-4 flex-grow min-h-60">
        <EditorContent editor={editor} />
      </div>{" "}
      <div className="flex justify-end items-center p-2 border-t border-input">
        <div className="text-sm text-muted-foreground">
          {editor
            ? `${editor.storage.characterCount.words()} words`
            : "0 words"}
        </div>
      </div>
    </Card>
  );
}
