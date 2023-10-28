'use client'

import NextLink from 'next/link'
import { Card } from "@/components/ui/card"
import { insertNoteSchema } from "@/server/db/schema"
import { match } from "ts-pattern"
import { z } from "zod"
import { TextNote } from "./text"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Button } from "../ui/button"
import { PencilIcon, StarIcon, TrashIcon } from "lucide-react"
import { useAppStore } from "@/store/app"
import { DrawingView } from '../drawing/view'

export type Note = z.infer<typeof insertNoteSchema>

export const NoteRenderer = ({ note }: { note: Note }) => {
  const setDeletingNoteId = useAppStore((state) => state.setDeletingNoteId)
  return (
    <Card className="flex group gap-4 max-w-[48rem] p-4 rounded-xl">
      <Avatar className="w-7 h-7 mt-2">
        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-teal-700" />
      </Avatar>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm">16:33</p>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 items-center transition-opacity">
            <Button size="icon" variant="secondary" asChild>
              <NextLink href={`/notes/${note.id}`}>
                <PencilIcon size={16} />
              </NextLink>
            </Button>
            <Button size="icon" variant="secondary">
              <StarIcon size={16} />
            </Button>
            <Button size="icon" variant="secondary" onClick={() => setDeletingNoteId(note.id ?? '')}>
              <TrashIcon size={16} />
            </Button>
          </div>
        </div>
        {match(note)
          .with({ type: 'text' }, (note) => <TextNote content={note.content ?? ''} />)
          .with({ type: 'ai' }, (note) => <TextNote content={note.content ?? ''} />)
          .with({ type: 'drawing' }, (note) => <DrawingView content={note.content ?? ''} />)
          .otherwise(() => null)
        }
      </div>
    </Card>
  )
}
