'use client'

import { type ChannelInvitationProps } from '@/lib/types'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { api } from '@/trpc/react'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'

export const Invitation = ({
  invitation
}: {
  invitation: ChannelInvitationProps
}) => {
  const router = useRouter()
  const { toast } = useToast()
  const { mutateAsync: acceptInvitation } =
    api.memberships.acceptInvitation.useMutation()
  const { mutateAsync: declineInvitation } =
    api.memberships.declineInvitation.useMutation()
  const acceptAndRefresh = async () => {
    await acceptInvitation({
      id: invitation.id,
      channelId: invitation.channelId
    })
    toast({ title: 'Invitation accepted' })
    router.refresh()
  }
  const declineAndRefresh = async () => {
    await declineInvitation({
      id: invitation.id,
      channelId: invitation.channelId
    })
    toast({ title: 'Invitation declined' })
    router.refresh()
  }
  return (
    <Card className="flex items-center justify-between gap-2 px-4 py-2">
      <p>{invitation.channel?.name}</p>
      <div className="flex gap-2">
        <Button onClick={acceptAndRefresh}>Accept</Button>
        <Button variant="secondary" onClick={declineAndRefresh}>
          Decline
        </Button>
      </div>
    </Card>
  )
}

export const ChannelsInvitations = ({
  invitations
}: {
  invitations: ChannelInvitationProps[]
}) => {
  return (
    <div className="flex flex-col gap-2">
      {invitations.map((invitation) => (
        <Invitation key={invitation.id} invitation={invitation} />
      ))}
    </div>
  )
}
