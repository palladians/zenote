'use client'

import '@/components/notes/editor.css'
import { type Editor, Extension } from '@tiptap/core'
import { EditorContent, useEditor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAppStore } from '@/store/app'
import { cn } from '@/lib/utils'
import { config } from '@/components/notes/editor-config'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { EditorBubbleMenu } from '@/components/notes/editor-bubble-menu'

export type OnSaveHandler = ({ content }: { content: string }) => Promise<void>

export type QuickEditorProps = {
  onSave: OnSaveHandler
}

export const QuickEditor = ({ onSave }: QuickEditorProps) => {
  const router = useRouter()
  const noteValue = useAppStore((state) => state.noteValue)
  const handleSave = async ({ editor }: { editor: Editor }) => {
    if (editor.getText().length === 0) return
    const content = JSON.stringify(editor.getJSON())
    await onSave({ content })
    editor.commands.clearContent(true)
    router.refresh()
  }
  const editor = useEditor({
    autofocus: 'end',
    extensions: [
      ...config.extensions,
      Extension.create({
        name: 'shortcuts',
        addKeyboardShortcuts() {
          return {
            'Cmd-Enter': handleSave
          } as any
        }
      }),
      Placeholder.configure({
        placeholder: 'Start typing your Quick Note.'
      })
    ],
    editorProps: {
      attributes: {
        class: cn(
          'flex-1 prose max-w-none dark:prose-invert m-4 focus:outline-none overflow-y-auto'
        )
      }
    }
  })
  useEffect(() => {
    if (!noteValue || !editor) return
    const docContent = noteValue && JSON.parse(noteValue)
    editor.commands.setContent(docContent)
  }, [noteValue, editor])
  if (!editor) return null
  const editorHasValue = editor.getText().length > 0
  return (
    <>
      {editor && <EditorBubbleMenu editor={editor} />}
      <EditorContent
        editor={editor}
        className={cn(
          'min-h-auto relative flex flex-1 overflow-hidden rounded-lg border bg-zinc-900 shadow-inner'
        )}
      >
        <div className="absolute bottom-3 right-2 z-10 flex items-center gap-2">
          {editorHasValue && (
            <Button className="gap-2" onClick={() => handleSave({ editor })}>
              <span>Save</span>
              <Badge variant="secondary">⌘Enter</Badge>
            </Button>
          )}
        </div>
      </EditorContent>
    </>
  )
}
