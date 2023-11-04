import { insertBookmarkSchema, insertCommentSchema, insertUserSchema, type insertNoteSchema, selectUserSchema, selectCommentSchema, selectNoteSchema, selectBookmarkSchema } from '@/server/db/schema'
import { type z } from 'zod'

export type UserProps = z.infer<typeof insertUserSchema & typeof selectUserSchema>
export type NoteBookmarkProps = z.infer<typeof insertBookmarkSchema & typeof selectBookmarkSchema>

export type CommentProps = z.infer<typeof insertCommentSchema & typeof selectCommentSchema> & {
  user?: UserProps
}

export type NoteProps = z.infer<typeof insertNoteSchema & typeof selectNoteSchema> & {
  comments?: CommentProps[]
  user?: UserProps
  noteBookmarks?: NoteBookmarkProps[]
}
