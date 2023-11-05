'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import {
  BrushIcon,
  CheckIcon,
  ChevronLeftIcon,
  ClockIcon,
  FileIcon,
  MessageSquareIcon,
  PlusIcon,
  StarIcon,
  StarOffIcon
} from 'lucide-react'
import { type NoteProps } from '@/lib/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { type Editor } from '@tiptap/react'
import { NoteOptions } from '../notes/note-options'
import { useAppStore } from '@/store/app'
import { api } from '@/trpc/react'
import { useSession } from 'next-auth/react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export const NoteMenu = ({
  editor,
  note,
  toggleSidebar
}: {
  editor: Editor
  note: NoteProps
  toggleSidebar: () => void
}) => {
  const setDueDateNoteId = useAppStore((state) => state.setDueDateNoteId)
  const router = useRouter()
  const { data } = useSession()
  const { mutateAsync: toggleBookmark } = api.bookmarks.toggle.useMutation()
  const { mutateAsync: updateNote } = api.notes.update.useMutation()
  const toggleNoteBookmark = async () => {
    await toggleBookmark({
      noteId: note.id ?? '',
      userId: data?.user.id ?? ''
    })
    router.refresh()
  }
  const markCompleted = async () => {
    await updateNote({
      ...note,
      dueDate: null
    })
    router.refresh()
  }
  const isBookmarked = note.noteBookmarks?.length ?? 0 > 0
  return (
    <Card className="flex justify-between shadow-xl">
      <div className="flex">
        <Button
          variant="ghost"
          size="icon"
          className="gap-2"
          onClick={() => router.push(`/channels/${note.channelId}`)}
        >
          <ChevronLeftIcon size={16} />
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" className="gap-2" onClick={toggleSidebar}>
              <MessageSquareIcon size={16} />
              {(note.comments?.length ?? 0) > 0 && (
                <span>{note.comments?.length}</span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Comments</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" className="gap-2" onClick={toggleSidebar}>
              <FileIcon size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Files</TooltipContent>
        </Tooltip>
      </div>
      <div className="flex">
        {isBookmarked ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleNoteBookmark}>
                <StarOffIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Remove Bookmark</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleNoteBookmark}>
                <StarIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bookmark</TooltipContent>
          </Tooltip>
        )}
        {note.dueDate ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={markCompleted}>
                <CheckIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mark Completed</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="gap-2"
                onClick={() => setDueDateNoteId(note.id)}
              >
                <ClockIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Set Due Date</TooltipContent>
          </Tooltip>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="gap-2">
              <PlusIcon size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="gap-2"
              onClick={editor.commands.addDrawing}
            >
              <BrushIcon size={16} />
              <span>Draw</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <NoteOptions note={note} />
      </div>
    </Card>
  )
}
