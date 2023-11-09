'use client'

import { ChannelProps } from '@/lib/types'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { api } from '@/trpc/react'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'

const addPossesiveApostrophe = (word: string) => {
  const lastLetterIndex = word.length - 1
  const lastLetter = word[lastLetterIndex]?.toLocaleLowerCase()
  if (lastLetter === 's') return `${word}'`
  return `${word}'s`
}

type ChannelData = {
  name: string
}

export const ChannelForm = ({ channel }: { channel: ChannelProps }) => {
  const router = useRouter()
  const { toast } = useToast()
  const { mutateAsync: updateChannel } = api.channels.update.useMutation()
  const {
    register,
    handleSubmit,
    formState: { isDirty }
  } = useForm<ChannelData>({
    defaultValues: {
      name: channel.name
    }
  })
  const onSubmit: SubmitHandler<ChannelData> = async (data) => {
    await updateChannel({
      ...channel,
      ...data
    })
    toast({ title: 'Channel updated' })
    router.refresh()
  }
  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-2xl font-semibold">
        {addPossesiveApostrophe(channel.name)} settings
      </h1>
      <fieldset className="mt-4 flex flex-col gap-2">
        <Label htmlFor="name">Channel Name</Label>
        <Input
          type="text"
          id="name"
          placeholder="Channel Name"
          {...register('name', { required: 'Channel name is required' })}
        />
      </fieldset>
      <div>
        <Button type="submit" disabled={!isDirty}>
          Save
        </Button>
      </div>
    </form>
  )
}
