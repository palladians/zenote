'use client'

import { Button } from '@/components/ui/button'
import { PlusIcon, CircleIcon, CircleDotIcon } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { api } from '@/trpc/react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { insertChannelSchema } from '@/server/db/schema'
import NextLink from 'next/link'
import { type z } from 'zod'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ChannelMenu } from '../channels/channel-menu'
import { type ChannelMembershipProps } from '@/lib/types'

type CreateChannelFormProps = {
  onBlur: () => void
  onCreated: () => void
}

const createChannelSchema = insertChannelSchema.omit({ webhookSecretKey: true })

const CreateChannelForm = ({ onBlur, onCreated }: CreateChannelFormProps) => {
  const { mutateAsync: createChannel } = api.channels.create.useMutation()
  const { data } = useSession()
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(createChannelSchema),
    defaultValues: {
      name: '',
      userId: data?.user.id ?? ''
    }
  })
  type CreateChannelData = z.infer<typeof createChannelSchema>
  const onSubmit: SubmitHandler<CreateChannelData> = async (data) => {
    await createChannel(data)
    onCreated()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        className="h-8"
        placeholder="Channel name"
        autoFocus
        {...register('name', { onBlur })}
      />
    </form>
  )
}

export const ChannelsList = ({
  memberships
}: {
  memberships: ChannelMembershipProps[]
}) => {
  const router = useRouter()
  const { channelId } = useParams()
  const [creatingChannel, setCreatingChannel] = useState<boolean>(false)
  const onCreated = () => {
    setCreatingChannel(false)
    router.refresh()
  }
  return (
    <>
      <div className="flex flex-col gap-1 border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Channels</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCreatingChannel(true)}
          >
            <PlusIcon size={14} />
          </Button>
        </div>
        {creatingChannel && (
          <CreateChannelForm
            onBlur={() => setCreatingChannel(false)}
            onCreated={onCreated}
          />
        )}
        {memberships?.map((membership) => {
          const active = membership.channel?.id === channelId
          if (!membership.role) return null
          return (
            <div
              key={membership.channel?.id}
              className={cn(
                'group flex items-center justify-between gap-2 rounded-lg px-2 transition-colors',
                active && 'bg-zinc-800 text-foreground'
              )}
            >
              <Button
                variant="link"
                className={cn(
                  'flex-1 justify-start gap-2 pl-0 text-muted-foreground',
                  active && 'text-foreground'
                )}
                asChild
              >
                <NextLink href={`/channels/${membership.channel?.id}`}>
                  {active ? (
                    <CircleDotIcon size={16} />
                  ) : (
                    <CircleIcon size={16} />
                  )}
                  <span>{membership.channel?.name}</span>
                </NextLink>
              </Button>
              {membership.channel && (
                <ChannelMenu
                  channel={membership.channel}
                  role={membership.role}
                />
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
