'use client'

import { useAppStore } from '@/store/app'
import { Button } from '../ui/button'
import { ChannelProps } from '@/lib/types'

export const ChannelDanger = ({ channel }: { channel: ChannelProps }) => {
  const setDeletingChannelId = useAppStore(
    (state) => state.setDeletingChannelId
  )
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Danger Zone</h2>
      <div>
        <Button
          variant="destructive"
          onClick={() => setDeletingChannelId(channel.id)}
        >
          Delete Channel
        </Button>
      </div>
    </div>
  )
}
