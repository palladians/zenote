import { cn } from '@/lib/utils'
import Placeholder from '@tiptap/extension-placeholder'
import { type Content, useEditor } from '@tiptap/react'
import { config } from '../notes/editor-config'
import { type Editor } from '@tiptap/core'
import { type NoteProps } from '@/lib/types'
import { api } from '@/trpc/react'
import debounceFunction from 'debounce-fn'

export const useFullEditor = ({
  defaultValue,
  note
}: {
  defaultValue: Content
  note: NoteProps
}) => {
  const { mutateAsync: updateNote } = api.notes.update.useMutation()
  const saveNote = async ({ content }: { content: string }) => {
    await updateNote({
      ...note,
      id: note.id,
      content
    })
  }
  const saveToDb = async ({ editor }: { editor: Editor }) => {
    const docJson = editor.getJSON()
    await saveNote({ content: JSON.stringify(docJson) })
  }
  const debouncedSaveToDb = debounceFunction(saveToDb, { wait: 1000 })
  return useEditor({
    autofocus: true,
    extensions: [
      ...config.extensions,
      Placeholder.configure({
        placeholder: 'Start typing your note.'
      })
    ],
    editorProps: {
      attributes: {
        class: cn(
          'editor-full flex-1 prose max-w-none dark:prose-invert focus:outline-none overflow-y-auto'
        )
      }
    },
    content: defaultValue,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onUpdate: debouncedSaveToDb
  })
}
