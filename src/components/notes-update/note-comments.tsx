'use client'

import { Button } from '@/components/ui/button'
import { PlusIcon, SendIcon, XIcon } from 'lucide-react'
import { UserAvatar } from '../users/user-avatar'
import { useState } from 'react'
import { Textarea } from '../ui/textarea'
import { NoteProps } from '@/lib/types'
import { format } from 'date-fns'
import { SubmitHandler, useForm } from 'react-hook-form'
import { api } from '@/trpc/react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { Badge } from '../ui/badge'

type CommentProps = {
  id: string
  content: string
  createdAt?: Date
  userName: string
}

const Comment = ({ id,
  content,
  createdAt,
  userName
}: CommentProps) => {
  return (
    <div className="flex items-start gap-4">
      <UserAvatar />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <p className="text-sm">{userName}</p>
          <p className="text-muted-foreground text-sm">{createdAt && format(createdAt, 'DDD')}</p>
        </div>
        <p className="text-muted-foreground">{content}</p>
        <div className="flex gap-4">
          <a className="text-sm">Edit</a>
          <a className="text-sm">Delete</a>
        </div>
      </div>
    </div>
  )
}

type AddCommentForm = {
  content: string
}

const AddCommentForm = ({ hideForm }: { hideForm: () => void }) => {
  const router = useRouter()
  const { noteId } = useParams()
  const { data: sessionData } = useSession()
  const { mutateAsync: createComment } = api.comments.create.useMutation()
  const { register, handleSubmit } = useForm<AddCommentForm>({
    defaultValues: {
      content: ''
    }
  })
  const onSubmit: SubmitHandler<AddCommentForm> = async (data) => {
    await createComment({
      content: data.content,
      noteId: noteId as string,
      userId: sessionData?.user.id ?? ''
    })
    router.refresh()
    hideForm()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <Textarea
        placeholder="Comment on note"
        className="resize-none"
        autoFocus
        {...register('content', { required: 'Content is required' })}
      />
      <div className="flex gap-2">
        <Button size="sm" className="flex-1 gap-2">
          <SendIcon size={14} />
          <span>Send</span>
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="flex-1"
          onClick={hideForm}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

const CommentList = ({ note }: { note: NoteProps }) => {
  const [addingComment, setAddingComment] = useState(false)
  return (
    <div className="flex flex-col gap-4 p-4">
      {note.comments?.map((comment) => (
        <Comment key={comment.id} content={comment.content ?? ''} createdAt={comment.createdAt} id={comment.id ?? ''} userName={comment.user?.name ?? ''} />
      ))}
      {addingComment ? (
        <AddCommentForm hideForm={() => setAddingComment(false)} />
      ) : (
        <Button variant="secondary" size="sm" className="gap-2" onClick={() => setAddingComment(true)}>
          <PlusIcon size={16} />
          <span>Add Comment</span>
        </Button>
      )}
    </div>
  )
}

export type NoteCommentsProps = {
  note: NoteProps
  toggleSidebar: () => void
}

export const NoteComments = ({ note, toggleSidebar }: NoteCommentsProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex gap-2">
          <h2 className="text-lg font-semibold">Comments</h2>
          <Badge variant="secondary">{note.comments?.length ?? 0}</Badge>
        </div>
        <Button size="icon" variant="ghost" onClick={toggleSidebar}>
          <XIcon size={16} />
        </Button>
      </div>
      <CommentList note={note} />
    </div>
  )
}
