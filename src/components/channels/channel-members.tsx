'use client'

import { Button } from '../ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserAvatar } from '../users/user-avatar'
import {
  type ChannelMembershipProps,
  type ChannelInvitationProps,
  type ChannelProps
} from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { XIcon } from 'lucide-react'
import { ChannelMembersForm } from './channel-members-form'
import { api } from '@/trpc/react'
import { useRouter } from 'next/navigation'
import { useToast } from '../ui/use-toast'

export const ChannelMember = ({
  membership
}: {
  membership: ChannelMembershipProps
}) => {
  const router = useRouter()
  const { toast } = useToast()
  const { mutateAsync: deleteMembership } =
    api.memberships.deleteMembership.useMutation()
  const { mutateAsync: updateMembership } = api.memberships.update.useMutation()
  const deleteMemberAndRefresh = async () => {
    await deleteMembership({
      channelId: membership.channelId,
      membershipId: membership.id
    })
    toast({ title: 'Member was removed' })
    router.refresh()
  }
  const updateMembershipAndRefresh = async (role: 'member' | 'admin') => {
    await updateMembership({
      id: membership.id,
      channelId: membership.channelId,
      userId: membership.userId,
      role
    })
    toast({ title: 'Member was updated' })
    router.refresh()
  }
  return (
    <div className="flex items-center gap-4 px-4 py-2">
      <UserAvatar />
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-sm">
          {membership.user?.username ?? membership.user?.name}
        </p>
        <p className="text-xs">{membership.user?.email}</p>
      </div>
      <Select
        defaultValue={membership.role ?? 'member'}
        onValueChange={updateMembershipAndRefresh}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="member">Member</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
      <Button size="icon" variant="outline" onClick={deleteMemberAndRefresh}>
        <XIcon size={16} />
      </Button>
    </div>
  )
}

export const ChannelInvitation = ({
  invitation
}: {
  invitation: ChannelInvitationProps
}) => {
  return (
    <div className="flex items-center gap-4 px-4 py-2">
      <UserAvatar />
      <p className="flex-1 text-sm">{invitation.invitationEmail}</p>
      <Button variant="link">Remove</Button>
    </div>
  )
}

export const ChannelMembers = ({
  channel,
  channelMemberships,
  channelInvitations
}: {
  channel: ChannelProps
  channelMemberships: ChannelMembershipProps[]
  channelInvitations: ChannelInvitationProps[]
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Members</h2>
      <ChannelMembersForm channelId={channel.id} />
      <div className="flex flex-col gap-4">
        <ScrollArea className="h-[16rem] rounded-lg border">
          {channelMemberships?.map((membership) => (
            <ChannelMember key={membership.id} membership={membership} />
          ))}
          {channelInvitations?.map((invitation) => (
            <ChannelInvitation key={invitation.id} invitation={invitation} />
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}
