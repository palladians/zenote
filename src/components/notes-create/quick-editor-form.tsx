'use client'

import { api } from '@/trpc/react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import {
  QuickEditor,
  type OnSaveHandler
} from '@/components/notes-create/quick-editor'

export type EditorFormProps = {
  saveCallback?: () => void
}

export const QuickEditorForm = ({ saveCallback }: EditorFormProps) => {
  const router = useRouter()
  const { channelId } = useParams()
  const { mutateAsync: createNote } = api.notes.create.useMutation()
  const onSave: OnSaveHandler = async ({ content }) => {
    await createNote({
      content,
      type: 'text' as never,
      channelId: String(channelId),
    })
    saveCallback && saveCallback()
  }
  const createNoteAndOpen = async () => {
    const note = await createNote({
      content: '',
      type: 'text' as never,
      channelId: String(channelId),
    })
    router.refresh()
    router.push(`/notes/${note[0]?.id}`)
  }
  return (
    <div className="z-10 flex items-center gap-2">
      <Button
        variant="secondary"
        size="icon"
        className="h-12 w-12 rounded-full border bg-zinc-900"
        onClick={createNoteAndOpen}
      >
        <PlusIcon size={20} />
      </Button>
      <QuickEditor onSave={onSave} />
    </div>
  )
}
