'use client'

import { MoreVerticalIcon, Edit2Icon, TrashIcon } from 'lucide-react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { useAppStore } from '@/store/app'
import { type ChannelProps } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export const ChannelMenu = ({
  channel,
  hidding = true
}: {
  channel: ChannelProps
  hidding?: boolean
}) => {
  const router = useRouter()
  const setDeletingChannelId = useAppStore(
    (state) => state.setDeletingChannelId
  )
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'transition-opacity group-hover:opacity-100',
            hidding && 'opacity-0'
          )}
        >
          <MoreVerticalIcon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom">
        <DropdownMenuItem
          className="gap-2"
          onClick={() => router.push(`/channels/${channel.id}/settings`)}
        >
          <Edit2Icon size={16} />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer gap-2 text-red-700 dark:text-red-500"
          onClick={() => setDeletingChannelId(channel.id)}
        >
          <TrashIcon size={16} />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
