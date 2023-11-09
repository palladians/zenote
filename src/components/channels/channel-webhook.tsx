'use client'

import { ChannelProps } from '@/lib/types'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'

export const ChannelWebhook = ({ channel }: { channel: ChannelProps }) => {
  const [secretVisible, setSecretVisible] = useState(false)
  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-xl font-semibold">Incoming Webhook</h2>
      <p>Create notes programmatically.</p>
      <fieldset className="flex flex-col gap-2">
        <Label>Webhook URL</Label>
        <Input value={`https://zenote.co/api/channels/${channel.id}/webhook`} />
      </fieldset>
      <fieldset className="flex flex-col gap-2">
        <Label>Webhook Secret</Label>
        <div className="relative">
          <Input
            type={secretVisible ? 'text' : 'password'}
            value={channel.webhookSecretKey}
            className="relative"
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute right-0 top-0"
            onClick={() => setSecretVisible(!secretVisible)}
          >
            {secretVisible ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
          </Button>
        </div>
      </fieldset>
      <div>
        <Button>Regenerate Secret</Button>
      </div>
    </div>
  )
}
