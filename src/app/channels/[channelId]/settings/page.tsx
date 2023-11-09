import { ChannelDanger } from '@/components/channels/channel-danger'
import { ChannelForm } from '@/components/channels/channel-form'
import { ChannelMembers } from '@/components/channels/channel-members'
import { ChannelWebhook } from '@/components/channels/channel-webhook'
import { ScrollArea } from '@/components/ui/scroll-area'
import { api } from '@/trpc/server'
import { redirect } from 'next/navigation'

const ChannelSettingsPage = async ({
  params
}: {
  params: { channelId: string }
}) => {
  const { channel, channelMemberships, channelInvitations, role } =
    await api.channels.get.query({
      id: params.channelId
    })
  if (role !== 'admin') redirect('/channels')
  if (!channel) return null
  if (!channelMemberships) return null
  if (!channelInvitations) return null
  return (
    <ScrollArea className="h-full w-full">
      <div className="container flex max-w-[40rem] flex-col gap-16 py-16">
        <ChannelForm channel={channel} />
        <ChannelMembers
          channel={channel}
          channelMemberships={channelMemberships}
          channelInvitations={channelInvitations}
        />
        <ChannelWebhook channel={channel} />
        <ChannelDanger channel={channel} />
      </div>
    </ScrollArea>
  )
}

export default ChannelSettingsPage
