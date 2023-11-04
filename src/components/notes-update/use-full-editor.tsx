import { cn } from '@/lib/utils'
import Placeholder from '@tiptap/extension-placeholder'
import { useEditor } from '@tiptap/react'
import { config } from '../notes/editor-config'

export const useFullEditor = ({ defaultValue }: { defaultValue: string }) => {
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
    content: defaultValue
  })
}
