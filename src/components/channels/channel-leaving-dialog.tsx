'use client'

import { useAppStore } from '@/store/app'
import { ConfirmationDialog } from '../confirmation-dialog'
import { api } from '@/trpc/react'
import { useRouter } from 'next/navigation'

export const ChannelLeavingDialog = () => {
  const router = useRouter()
  const { mutateAsync: leaveChannel } =
    api.memberships.leaveChannel.useMutation()
  const setLeavingChannelId = useAppStore((state) => state.setLeavingChannelId)
  const leavingChannelId = useAppStore((state) => state.leavingChannelId)
  return (
    <ConfirmationDialog
      title="Are you absolutely sure?"
      description="You won't be able to join back unless invited again."
      onConfirm={async () => {
        await leaveChannel({ channelId: leavingChannelId ?? '' })
        router.push('/channels')
        router.refresh()
      }}
      open={!!leavingChannelId}
      setOpen={(nextValue) => nextValue === false && setLeavingChannelId(null)}
    />
  )
}
