import { config } from '@/components/notes/editor-config'
import { type JSONContent } from '@tiptap/core'
import { generateHTML } from '@tiptap/html'
import { stripHtml } from 'string-strip-html'

export const getText = (json: string) => {
  const doc = JSON.parse(json) as JSONContent
  const html = generateHTML(doc, config.extensions)
  return stripHtml(html).result
}
