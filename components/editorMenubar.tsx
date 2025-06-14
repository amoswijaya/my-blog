"use client";

import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "./ui/separator";
import { uploadImageApi } from "@/lib/api/imageApi";

export default function EditorMenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  return (
    <div className="flex items-center gap-2 border rounded-md px-2 py-1 bg-muted">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Undo (Ctrl+Z)</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Redo (Ctrl+Y)</p>
        </TooltipContent>
      </Tooltip>
      <Separator orientation="vertical" className="h-8" />
      {/* Formatting Buttons */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            size="sm"
            // pressed={editor.isActive({ textAlign: "left" })}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold
              className={`h-4 w-4 ${
                editor.isActive("bold") ? "text-black" : "text-muted-foreground"
              }`}
            />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>Bold (Ctrl+B)</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            size="sm"
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic
              className={`w-4 h-4 ${
                editor.isActive("italic")
                  ? "text-black"
                  : "text-muted-foreground"
              }`}
            />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>Italic (Ctrl+I)</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                document.getElementById("tiptap-image-upload")?.click()
              }
              type="button"
            >
              <Image className="h-4 w-4" />
            </Button>
            <input
              id="tiptap-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                try {
                  const imageUrl = await uploadImageApi(file);
                  editor.chain().focus().setImage({ src: imageUrl }).run();
                } catch (error) {
                  console.error("Upload gagal:", error);
                }
              }}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Upload Image</p>
        </TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="h-8" />
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: "left" })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("left").run()
            }
          >
            <AlignLeft
              className={`h-4 w-4 cursor-pointer ${
                editor.isActive({ textAlign: "left" }) && "text-blue-400"
              }`}
            />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>Align Left</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: "center" })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("center").run()
            }
          >
            <AlignCenter
              className={`h-4 w-4 cursor-pointer ${
                editor.isActive({ textAlign: "center" }) && "text-blue-400"
              }`}
            />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>Align Center</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: "right" })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("right").run()
            }
          >
            <AlignRight
              className={`h-4 w-4 cursor-pointer ${
                editor.isActive({ textAlign: "right" }) && "text-blue-400"
              }`}
            />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>Align Right</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: "justify" })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("justify").run()
            }
          >
            <AlignJustify
              className={`h-4 w-4 cursor-pointer ${
                editor.isActive({ textAlign: "justify" }) && "text-blue-400"
              }`}
            />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>Justify</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
