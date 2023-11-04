import { NoteRenderer } from '@/components/channels/note-renderer'
import { type NoteProps } from '@/lib/types'
import { ScrollAnchor } from '@/components/channels/scroll-anchor'

export type NotesListProps = {
  notes: NoteProps[]
}

export const NotesList = ({ notes }: NotesListProps) => {
  return (
    <div className="flex flex-col gap-8 py-8">
      {notes?.map((note) => <NoteRenderer key={note.id} note={note} />)}
      <ScrollAnchor />
    </div>
  )
}
