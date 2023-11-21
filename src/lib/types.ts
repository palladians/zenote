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
  type selectChannelSchema,
  type insertChannelMembershipSchema,
  type selectChannelMembershipSchema,
  type insertChannelInvitationSchema,
  type selectChannelInvitationSchema,
  type insertHashtagSchema,
  type selectHashtagSchema
} from '@/server/db/schema'
import { type z } from 'zod'

export type UserProps = z.infer<
  typeof insertUserSchema & typeof selectUserSchema
> & {
  hashtags?: HashtagProps[]
}
export type ChannelMembershipProps = z.infer<
  typeof insertChannelMembershipSchema & typeof selectChannelMembershipSchema
> & {
  user?: UserProps
  channel?: ChannelProps
}
export type ChannelInvitationProps = z.infer<
  typeof insertChannelInvitationSchema & typeof selectChannelInvitationSchema
> & {
  channel?: ChannelProps
}
export type ChannelProps = z.infer<
  typeof insertChannelSchema & typeof selectChannelSchema
> & {
  channelMemberships?: ChannelMembershipProps[]
  channelInvitations?: ChannelInvitationProps[]
}
export type HashtagProps = z.infer<
  typeof insertHashtagSchema & typeof selectHashtagSchema
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
