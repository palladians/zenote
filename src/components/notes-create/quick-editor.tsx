'use client'

import '@/components/notes/editor.css'
import { type Editor, Extension } from '@tiptap/core'
import { EditorContent, useEditor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StarsIcon } from 'lucide-react'
import { useAppStore } from '@/store/app'
import { cn } from '@/lib/utils'
import { config } from '@/components/notes/editor-config'
import Placeholder from '@tiptap/extension-placeholder'
import { useChat } from 'ai/react'
import { type FormEvent, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { EditorBubbleMenu } from '@/components/notes/editor-bubble-menu'

export type OnSaveHandler = ({ content }: { content: string }) => Promise<void>

export type QuickEditorProps = {
  onSave: OnSaveHandler
}

export const QuickEditor = ({ onSave }: QuickEditorProps) => {
  const router = useRouter()
  const { channelId } = useParams()
  const noteValue = useAppStore((state) => state.noteValue)
  console.log('>>>INNERV', noteValue)
  const { handleSubmit, setInput } = useChat({
    api: '/api/chat',
    initialInput: noteValue,
    body: {
      channelId
    }
  })
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
  const sendOpenAiPrompt = (e: FormEvent<HTMLFormElement>) => {
    setInput(`${noteValue} - send response in HTML <p> wrapped paragraphs.`)
    console.log('NV', noteValue)
    handleSubmit(e)
  }
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
            <form onSubmit={sendOpenAiPrompt}>
              <Button type="submit" variant="secondary" className="gap-2">
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
  )
}
