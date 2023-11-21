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
import {
  LockIcon,
  MoreVerticalIcon,
  ShareIcon,
  TrashIcon,
  UnlockIcon
} from 'lucide-react'
import { useAppStore } from '@/store/app'
import { useRouter } from 'next/navigation'
import { api } from '@/trpc/react'

export type NoteOptionsProps = {
  note: NoteProps
}

export const NoteOptions = ({ note }: NoteOptionsProps) => {
  const router = useRouter()
  const setDeletingNoteId = useAppStore((state) => state.setDeletingNoteId)
  const { mutateAsync: updateNote } = api.notes.update.useMutation()
  const toggleNoteLock = async () => {
    await updateNote({
      ...note,
      locked: !note.locked
    })
    router.refresh()
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <MoreVerticalIcon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="gap-2" onClick={toggleNoteLock}>
          {note.locked ? <UnlockIcon size={16} /> : <LockIcon size={16} />}
          <span>{note.locked ? 'Unlock' : 'Lock'}</span>
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
