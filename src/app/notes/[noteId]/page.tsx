import { DrawingEdit } from "@/components/drawing/edit"
import { api } from "@/trpc/server"
import { match } from "ts-pattern"

const NotePage = async ({ params }: { params: { noteId: string } }) => {
  const note = await api.notes.get.query({ id: params.noteId })
  console.log('>>>N', note)
  return (
    match(note).with({ type: 'drawing' }, (note) => <DrawingEdit note={note} />).otherwise(() => null)
  )
}

export default NotePage
