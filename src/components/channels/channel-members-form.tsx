'use client'

import { type SubmitHandler, useForm } from 'react-hook-form'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { api } from '@/trpc/react'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'

type InvitationData = {
  invitationEmail: string
}

export const ChannelMembersForm = ({ channelId }: { channelId: string }) => {
  const router = useRouter()
  const { toast } = useToast()
  const { mutateAsync: inviteMember } = api.memberships.invite.useMutation()
  const { register, handleSubmit } = useForm<InvitationData>({
    defaultValues: { invitationEmail: '' }
  })
  const onSubmit: SubmitHandler<InvitationData> = async (data) => {
    await inviteMember({
      channelId,
      invitationEmail: data.invitationEmail,
      role: 'member'
    })
    toast({ title: 'Member invited' })
    router.refresh()
  }
  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="flex flex-col gap-2">
        <Label>Email Address</Label>
        <div className="flex gap-2">
          <Input placeholder="Email Address" {...register('invitationEmail')} />
          <Button className="whitespace-nowrap">Invite Member</Button>
        </div>
      </fieldset>
    </form>
  )
}
