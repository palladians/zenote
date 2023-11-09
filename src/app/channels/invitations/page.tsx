import { ChannelsInvitations } from '@/components/channels/channels-invitations'
import { ScrollArea } from '@/components/ui/scroll-area'
import { api } from '@/trpc/server'

const ChannelInvitationsPage = async () => {
  const invitations = await api.memberships.invitations.query()
  if (!invitations) return null
  return (
    <ScrollArea className="h-full w-full">
      <div className="container flex max-w-[40rem] flex-col gap-16 py-16">
        <h2 className="text-2xl font-semibold">Channel Invitations</h2>
        <ChannelsInvitations invitations={invitations as never} />
      </div>
    </ScrollArea>
  )
}

export default ChannelInvitationsPage
