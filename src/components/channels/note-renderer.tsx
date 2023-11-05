'use client'

import NextLink from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  CheckIcon,
  ClockIcon,
  PencilIcon,
  StarIcon,
  StarOffIcon
} from 'lucide-react'
import { format } from 'date-fns'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useMemo } from 'react'
import { generateHTML } from '@tiptap/html'
import { config } from '@/components/notes/editor-config'
import { UserAvatar } from '@/components/users/user-avatar'
import { NoteOptions } from '../notes/note-options'
import { useSession } from 'next-auth/react'
import { api } from '@/trpc/react'
import { useRouter } from 'next/navigation'
import { type NoteProps } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/app'

export const NoteRenderer = ({
  note,
  short = false
}: {
  note: NoteProps
  short?: boolean
}) => {
  const router = useRouter()
  const json = useMemo(() => JSON.parse(note.content ?? '{}'), [note.content])
  const output = useMemo(() => generateHTML(json, config.extensions), [json])
  const setDueDateNoteId = useAppStore((state) => state.setDueDateNoteId)
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
    <Card
      className={cn(
        'relative flex max-h-[36rem] max-w-[48rem] gap-4 overflow-hidden rounded-xl bg-zinc-900 p-4',
        isBookmarked && 'border-blue-900',
        short && 'max-h-[18rem]'
      )}
    >
      <div className="mt-1">
        <UserAvatar />
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            {!short && <p>{note.user?.name}</p>}
            <NextLink
              href={`/notes/${note.id}`}
              className="text-sm text-muted-foreground"
            >
              {format(note.createdAt ?? 0, 'PP p')}
            </NextLink>
          </div>
          <div className="flex items-center gap-1 transition-opacity">
            {note.dueDate ? (
              <Button
                size="sm"
                variant="secondary"
                className="gap-1"
                onClick={markCompleted}
              >
                <CheckIcon size={16} />
                <span className="text-sm">Complete</span>
              </Button>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDueDateNoteId(note.id)}
                  >
                    <ClockIcon size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Set Due Date</TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" asChild>
                  <NextLink href={`/notes/${note.id}`}>
                    <PencilIcon size={16} />
                  </NextLink>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={toggleNoteBookmark}>
                  {isBookmarked ? (
                    <StarOffIcon size={16} />
                  ) : (
                    <StarIcon size={16} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
              </TooltipContent>
            </Tooltip>
            {!short && <NoteOptions note={note} />}
          </div>
        </div>
        <div
          className={cn('prose dark:prose-invert', short && 'prose-sm')}
          dangerouslySetInnerHTML={{ __html: output }}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[10%] w-full bg-gradient-to-b from-zinc-900/10 to-zinc-900" />
    </Card>
  )
}
