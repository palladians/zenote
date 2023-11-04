import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Typography from '@tiptap/extension-typography'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { EditorTldraw } from '@/components/notes-update/editor-tldraw'

export const config = {
  extensions: [
    StarterKit,
    Highlight,
    Typography,
    Link,
    Image.configure({
      inline: true,
      allowBase64: true
    }),
    EditorTldraw,
  ]
}
