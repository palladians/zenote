'use client'

import '@/components/notes/editor.css'
import { type Editor, EditorContent } from '@tiptap/react'
import { cn } from '@/lib/utils'
import { EditorBubbleMenu } from '@/components/notes/editor-bubble-menu'
import { debounce } from 'throttle-debounce'
import { useEffect } from 'react'

export type OnSaveHandler = ({ content }: { content: string }) => Promise<void>

export type EditorCoreProps = {
  editor: Editor
  onSave: OnSaveHandler
}

export const FullEditor = ({ editor, onSave }: EditorCoreProps) => {
  const debouncedOnSave = debounce(1000, onSave)
  const content = editor?.state.doc.content
  useEffect(() => {
    if (!editor) return
    void debouncedOnSave({ content: JSON.stringify(editor?.getJSON()) })
  }, [content, debouncedOnSave, editor])
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
