import {
  type insertBookmarkSchema,
  type insertCommentSchema,
  type insertUserSchema,
  type insertNoteSchema,
  type selectUserSchema,
  type selectCommentSchema,
  type selectNoteSchema,
  type selectBookmarkSchema,
  type insertChannelSchema,
  type selectChannelSchema
} from '@/server/db/schema'
import { type z } from 'zod'

export type UserProps = z.infer<
  typeof insertUserSchema & typeof selectUserSchema
>
export type ChannelProps = z.infer<
  typeof insertChannelSchema & typeof selectChannelSchema
>
export type NoteBookmarkProps = z.infer<
  typeof insertBookmarkSchema & typeof selectBookmarkSchema
>

export type CommentProps = z.infer<
  typeof insertCommentSchema & typeof selectCommentSchema
> & {
  user?: UserProps
}

export type NoteProps = z.infer<
  typeof insertNoteSchema & typeof selectNoteSchema
> & {
  comments?: CommentProps[]
  user?: UserProps
  noteBookmarks?: NoteBookmarkProps[]
}
