'use client'

import { api } from '@/trpc/react'
import { NoteProps } from '@/lib/types'
import { useParams, useSearchParams } from 'next/navigation'
import { FullEditor } from '@/components/notes-update/full-editor'
import { useRouter } from 'next/navigation'
import { NoteComments } from './note-comments'
import { NoteFiles } from './note-files'
import { NoteMenu } from './note-menu'
import { useFullEditor } from './use-full-editor'

export type EditorUpdateNoteProps = {
  note: NoteProps
}

export const FullEditorForm = ({ note }: EditorUpdateNoteProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { noteId } = useParams()
  const { mutateAsync: updateNote } = api.notes.update.useMutation()
  const saveNote = async ({ content }: { content: string }) => {
    await updateNote({
      ...note,
      id: String(noteId),
      content
    })
  }
  const defaultValue = JSON.parse(String(note.content || '{}'))
  const editor = useFullEditor({ defaultValue })
  const sidebarOpen = searchParams.get('sidebar') === 'true'
  const toggleSidebar = () =>
    router.push(`?sidebar=${sidebarOpen ? 'false' : 'true'}`)
  if (!editor) return null
  return (
    <div className="flex flex-1 bg-zinc-900">
      <div className="mx-auto flex max-w-[48rem] flex-[3] flex-col gap-4 p-4">
        <NoteMenu editor={editor} note={note} toggleSidebar={toggleSidebar} />
        <FullEditor editor={editor} onSave={saveNote} />
      </div>
      {sidebarOpen && (
        <div className="flex flex-1 flex-col border-l">
          <NoteComments note={note} toggleSidebar={toggleSidebar} />
          <NoteFiles />
        </div>
      )}
    </div>
  )
}
