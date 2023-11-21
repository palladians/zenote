'use client'

import { type JSONContent, generateHTML } from '@tiptap/core'
import { useMemo } from 'react'
import { config } from './editor-config'
import { cn } from '@/lib/utils'

type NoteContentRendererProps = {
  content: string
  small?: boolean
}

export const NoteContentRenderer = ({
  content,
  small = false
}: NoteContentRendererProps) => {
  const json = useMemo(() => JSON.parse(content ?? '{}'), [content])
  const output = useMemo(
    () => generateHTML(json as JSONContent, config.extensions),
    [json]
  )
  return (
    <div
      className={cn(
        'prose w-full overflow-hidden whitespace-pre-wrap dark:prose-invert',
        small && 'prose-sm'
      )}
      dangerouslySetInnerHTML={{ __html: output }}
    />
  )
}
