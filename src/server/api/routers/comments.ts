import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import {
  comments,
  insertCommentSchema,
  notes,
  selectCommentSchema
} from '@/server/db/schema'
import { and, eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(insertCommentSchema)
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.db.query.notes.findFirst({
        where: eq(notes.id, input.noteId),
        with: {
          channel: {
            with: {
              channelMemberships: true
            }
          }
        }
      })
      if (!note) throw new TRPCError({ code: 'NOT_FOUND' })
      const noteAvailableToUser = note.channel.channelMemberships.find(
        (membership) => membership.userId === ctx.session.user.id
      )
      if (!noteAvailableToUser) throw new TRPCError({ code: 'FORBIDDEN' })
      return ctx.db.insert(comments).values(input).returning()
    }),
  update: protectedProcedure
    .input(insertCommentSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.db.query.comments.findFirst({
        where: and(
          eq(comments.id, input.id),
          eq(comments.userId, ctx.session.user.id ?? '')
        )
      })
      if (!comment) throw new TRPCError({ code: 'NOT_FOUND' })
      return ctx.db
        .update(comments)
        .set({
          content: input.content
        })
        .where(and(eq(notes.id, input.id)))
        .returning()
    }),
  delete: protectedProcedure
    .input(selectCommentSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.db.query.comments.findFirst({
        where: and(
          eq(comments.id, input.id),
          eq(comments.userId, ctx.session.user.id ?? '')
        )
      })
      if (!comment) throw new TRPCError({ code: 'NOT_FOUND' })
      return ctx.db
        .delete(comments)
        .where(eq(comments.id, input.id))
        .returning()
    })
})
