'use client'

import { generateHTML } from '@tiptap/html'
import { useMemo } from 'react'
import { config } from '../editor/config'

export type TextNoteProps = {
  content: string
}

export const TextNote = ({ content }: TextNoteProps) => {
  const json = useMemo(() => JSON.parse(content), [content])
  const output = useMemo(() => generateHTML(json, config.extensions), [json])
  return (
    <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: output }} />
  )
}
