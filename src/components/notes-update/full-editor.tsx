'use client'

import '@/components/notes/editor.css'
import { type Editor, EditorContent } from '@tiptap/react'
import { cn } from '@/lib/utils'
import { EditorBubbleMenu } from '@/components/notes/editor-bubble-menu'
import { type NoteProps } from '@/lib/types'

export type OnSaveHandler = ({ content }: { content: string }) => Promise<void>

export type EditorCoreProps = {
  editor: Editor
  note: NoteProps
}

export const FullEditor = ({ editor }: EditorCoreProps) => {
  if (!editor) return null
  return (
    <>
      {editor && <EditorBubbleMenu editor={editor} />}
      <EditorContent
        editor={editor}
        className={cn('min-h-auto flex flex-1 overflow-hidden')}
      />
    </>
  )
}
