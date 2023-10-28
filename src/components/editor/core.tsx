"use client";

import "./editor.css";
import { Editor, Extension } from "@tiptap/core";
import {
  EditorContent,
  BubbleMenu,
  useEditor,
} from "@tiptap/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExpandIcon, StarsIcon } from "lucide-react";
import { useAppStore } from "@/store/app";
import { cn } from "@/lib/utils";
import { config } from "./config";
import Placeholder from "@tiptap/extension-placeholder";
import { useChat } from 'ai/react';
import { FormEvent } from "react";
import { useParams } from "next/navigation";

export type OnSaveHandler = ({ content }: { content: string }) => Promise<void>;

export type EditorCoreProps = {
  onEsc?: () => void;
  onSave: OnSaveHandler;
};

export const EditorCore = ({ onEsc, onSave }: EditorCoreProps) => {
  const { channelId } = useParams()
  const quickNoteValue = useAppStore((state) => state.quickNoteValue);
  const setQuickNoteValue = useAppStore((state) => state.setQuickNoteValue);
  const { handleSubmit, setInput } = useChat({
    api: '/api/chat',
    initialInput: quickNoteValue,
    body: {
      channelId
    }
  })
  const extended = useAppStore((state) => state.extendedEditorOpen);
  const setExtended = useAppStore((state) => state.setExtendedEditorOpen);
  const toggleExtended = () => setExtended(!extended);
  const handleSave = async ({ editor }: { editor: Editor }) => {
    if (editor.getText().length === 0) return;
    const content = JSON.stringify(editor.getJSON());
    await onSave({ content });
    return editor.commands.clearContent(true);
  };
  const editor = useEditor({
    autofocus: "end",
    onUpdate({ editor }) {
      setQuickNoteValue(editor.getText())
    },
    extensions: [
      ...config.extensions,
      Extension.create({
        name: "shortcuts",
        addKeyboardShortcuts() {
          return {
            "Cmd-Enter": handleSave,
            "Cmd-j": toggleExtended,
            Escape: () => onEsc && onEsc(),
          } as any;
        },
      }),
      Placeholder.configure({
        placeholder: "Type / to start noting.",
      }),
    ],
    editorProps: {
      attributes: {
        class: cn(
          "flex-1 prose max-w-none dark:prose-invert m-4 focus:outline-none",
        ),
        "data-hotkey": "/",
      },
    },
    content: '',
  });
  if (!editor) return null;
  const editorHasValue = editor.getText().length > 0;
  const sendOpenAiPrompt = (e: FormEvent<HTMLFormElement>) => {
    setInput(`${quickNoteValue} - send response in HTML <p> wrapped paragraphs.`)
    console.log('NV', quickNoteValue)
    handleSubmit(e)
  }
  return (
    <>
      {editor && (
        <BubbleMenu editor={editor}>
          <Card className="flex gap-2 p-2">
            <Button
              variant={editor.isActive("bold") ? "default" : "secondary"}
              size="icon"
              className="font-bold"
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              B
            </Button>
            <Button
              variant={editor.isActive("italic") ? "default" : "secondary"}
              size="icon"
              className="italic"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              I
            </Button>
            <Button
              variant={editor.isActive("strike") ? "default" : "secondary"}
              size="icon"
              className="line-through"
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              S
            </Button>
          </Card>
        </BubbleMenu>
      )}
      <EditorContent
        editor={editor}
        className={cn(
          "min-h-auto relative flex flex-1 overflow-hidden rounded-lg border bg-zinc-900",
          extended && "min-h-[32rem]",
        )}
      >
        <div className="absolute bottom-3 right-2 z-10 flex items-center gap-2">
          <Button
            variant="secondary"
            className="gap-2"
            onClick={() => setExtended(!extended)}
          >
            <ExpandIcon size={16} />
            <span>⌘J</span>
          </Button>
          {editorHasValue && (
            <form onSubmit={sendOpenAiPrompt}>
              <Button
                type="submit"
                variant="secondary"
                className="gap-2"
              >
                <StarsIcon size={16} />
                <span>Ask AI</span>
              </Button>
            </form>
          )}
          {editorHasValue && (
            <Button className="gap-2" onClick={() => handleSave({ editor })}>
              <span>Save</span>
              <Badge variant="secondary">⌘Enter</Badge>
            </Button>
          )}
        </div>
      </EditorContent>
    </>
  );
};
