'use client'

import { useAppStore } from '@/store/app'
import { ConfirmationDialog } from '../confirmation-dialog'
import { api } from '@/trpc/react'
import { useRouter } from 'next/navigation'

export const ChannelDeleteDialog = () => {
  const router = useRouter()
  const { mutateAsync: deleteChannel } = api.channels.delete.useMutation()
  const deletingChannelId = useAppStore((state) => state.deletingChannelId)
  const setDeletingChannelId = useAppStore(
    (state) => state.setDeletingChannelId
  )
  return (
    <ConfirmationDialog
      title="Are you absolutely sure?"
      description="This action will delete this channel and all its notes."
      onConfirm={async () => {
        await deleteChannel({ id: deletingChannelId ?? '' })
        router.push('/channels')
        router.refresh()
      }}
      open={!!deletingChannelId}
      setOpen={(nextValue) => nextValue === false && setDeletingChannelId(null)}
    />
  )
}
