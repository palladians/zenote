'use client'

import { ExcalidrawProps } from "@excalidraw/excalidraw/types/types";
import { debounce } from 'throttle-debounce';
import dynamic from 'next/dynamic'
import { api } from "@/trpc/react";
import { z } from "zod";
import { insertNoteSchema } from "@/server/db/schema";
import diff from "microdiff";

type NoteProps = z.infer<typeof insertNoteSchema>

const Excalidraw = dynamic(() => import('@excalidraw/excalidraw').then((comp) => comp.Excalidraw), { ssr: false })

export type DrawingNoteProps = {
  note: NoteProps
}

export const DrawingEdit = ({ note }: DrawingNoteProps) => {
  const { data: noteData, refetch: refetchNote, isLoading: noteLoading } = api.notes.get.useQuery({ id: note.id ?? '' })
  const { mutateAsync: saveNoteState } = api.notes.update.useMutation()
  const initialElements = noteData?.content && JSON.parse(noteData.content ?? '')
  const initialData = { elements: initialElements, scrollToContent: true }
  const onChange: ExcalidrawProps['onChange'] = async (newElements) => {
    const drawingChanged = diff(initialElements, newElements).length > 0
    if (!drawingChanged) return
    noteData && await saveNoteState({
      ...noteData,
      id: noteData.id ?? '',
      content: JSON.stringify(newElements)
    })
    await refetchNote()
  }
  const debouncedOnChange = debounce(1000, onChange)
  if (noteLoading) return <p>Loading</p>
  return (
    <Excalidraw theme="dark" initialData={initialData} onChange={debouncedOnChange} />
  )
}
