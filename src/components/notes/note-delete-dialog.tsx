'use client'

import { useAppStore } from '@/store/app'
import { ConfirmationDialog } from '@/components/confirmation-dialog'
import { api } from '@/trpc/react'
import { useRouter } from 'next/navigation'

export const NoteDeleteDialog = () => {
  const router = useRouter()
  const deletingNoteId = useAppStore((state) => state.deletingNoteId)
  const setDeletingNoteId = useAppStore((state) => state.setDeletingNoteId)
  const { mutateAsync: deleteNote } = api.notes.delete.useMutation()
  const onConfirm = async () => {
    await deleteNote({ id: deletingNoteId ?? '' })
    router.refresh()
  }
  return (
    <ConfirmationDialog
      title="Are you sure?"
      description="Deleted message won't be recoverable."
      open={!!deletingNoteId}
      setOpen={() => setDeletingNoteId(null)}
      onConfirm={onConfirm}
    />
  )
}
