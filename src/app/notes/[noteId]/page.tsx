import { FullEditorForm } from '@/components/notes-update/full-editor-form'
import { api } from '@/trpc/server'

const NotePage = async ({ params }: { params: { noteId: string } }) => {
  const note = await api.notes.get.query({ id: params.noteId })
  return <FullEditorForm note={note} />
}

export default NotePage
