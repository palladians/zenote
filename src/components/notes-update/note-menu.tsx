'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import {
  BrushIcon,
  ChevronLeftIcon,
  ClockIcon,
  FileIcon,
  MessageSquareIcon,
  PlusIcon,
  StarIcon,
  StarOffIcon
} from 'lucide-react'
import { NoteProps } from '@/lib/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { Editor } from '@tiptap/react'
import { NoteOptions } from '../notes/note-options'
import { useAppStore } from '@/store/app'
import { api } from '@/trpc/react'
import { useSession } from 'next-auth/react'

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
  const toggleNoteBookmark = async () => {
    await toggleBookmark({
      noteId: note.id ?? '',
      userId: data?.user.id ?? ''
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
        <Button variant="ghost" className="gap-2" onClick={toggleSidebar}>
          <MessageSquareIcon size={16} />
          {(note.comments?.length ?? 0) > 0 && <span>{note.comments?.length}</span>}
        </Button>
        <Button variant="ghost" className="gap-2" onClick={toggleSidebar}>
          <FileIcon size={16} />
        </Button>
      </div>
      <div className="flex">
        <Button variant="ghost" size="icon" onClick={toggleNoteBookmark}>
          {isBookmarked ? <StarOffIcon size={16} /> : <StarIcon size={16} />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="gap-2"
          onClick={() => setDueDateNoteId(note.id)}
        >
          <ClockIcon size={16} />
        </Button>
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
