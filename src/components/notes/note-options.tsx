'use client'

import { type NoteProps } from '@/lib/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { LockIcon, MoreVerticalIcon, ShareIcon, TrashIcon } from 'lucide-react'
import { useAppStore } from '@/store/app'

export type NoteOptionsProps = {
  note: NoteProps
}

export const NoteOptions = ({ note }: NoteOptionsProps) => {
  const setDeletingNoteId = useAppStore((state) => state.setDeletingNoteId)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <MoreVerticalIcon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="gap-2">
          <LockIcon size={16} />
          <span>Lock</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <ShareIcon size={16} />
          <span>Share</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-red-700 dark:text-red-500"
          onClick={() => setDeletingNoteId(note.id ?? '')}
        >
          <TrashIcon size={16} />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
