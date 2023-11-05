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
import { ConfirmationDialog } from '@/components/confirmation-dialog'
import { useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/app'
import { ChannelMenu } from '../channels/channel-menu'

type CreateChannelFormProps = {
  onBlur: () => void
  onCreated: () => void
}

const CreateChannelForm = ({ onBlur, onCreated }: CreateChannelFormProps) => {
  const { mutateAsync: createChannel } = api.channels.create.useMutation()
  const { data } = useSession()
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(insertChannelSchema),
    defaultValues: {
      name: '',
      userId: data?.user.id ?? ''
    }
  })
  type CreateChannelData = z.infer<typeof insertChannelSchema>
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

export const ChannelsList = () => {
  const { channelId } = useParams()
  const [creatingChannel, setCreatingChannel] = useState<boolean>(false)
  const { data: channelList, refetch } = api.channels.index.useQuery()
  const { mutateAsync: deleteChannel } = api.channels.delete.useMutation()
  const deletingChannelId = useAppStore((state) => state.deletingChannelId)
  const setDeletingChannelId = useAppStore(
    (state) => state.setDeletingChannelId
  )
  const onCreated = async () => {
    setCreatingChannel(false)
    await refetch()
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
        {channelList?.map((channel) => {
          const active = channel.id === channelId
          return (
            <div
              key={channel.id}
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
                <NextLink href={`/channels/${channel.id}`}>
                  {active ? (
                    <CircleDotIcon size={16} />
                  ) : (
                    <CircleIcon size={16} />
                  )}
                  <span>{channel.name}</span>
                </NextLink>
              </Button>
              <ChannelMenu channel={channel} />
            </div>
          )
        })}
      </div>
    </>
  )
}
