import {
  channelMemberships,
  hashtags,
  insertNoteSchema,
  noteBookmarks,
  notes,
  notesToHashtags,
  selectNoteSchema
} from '@/server/db/schema'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { and, eq, ilike, inArray, isNotNull } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { omit } from 'rambda'
import { type HashtagProps } from '@/lib/types'

const HASHTAG_REGEX = /#\w+/g

export const notesRouter = createTRPCRouter({
  index: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.notes.findMany({
      where: and(
        isNotNull(notes.dueDate),
        eq(notes.userId, ctx.session.user.id)
      )
    })
  ),
  byHashtag: protectedProcedure
    .input(z.object({ hashtagName: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const matchingHashtag = await ctx.db.query.hashtags.findFirst({
        where: and(
          eq(hashtags.name, input.hashtagName),
          eq(hashtags.userId, ctx.session.user.id)
        ),
        with: {
          notesToHashtags: {
            with: {
              note: {
                with: {
                  user: true
                }
              }
            }
          }
        }
      })
      return {
        notes: matchingHashtag?.notesToHashtags.map(
          (noteToHashtag) => noteToHashtag.note
        ),
        hashtag: omit(['notesToHashtags'], matchingHashtag) as HashtagProps
      }
    }),
  search: protectedProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const memberships = await ctx.db.query.channelMemberships.findMany({
        where: eq(channelMemberships.userId, ctx.session.user.id),
        with: {
          channel: true
        }
      })
      const userChannelIds = memberships.map(
        (membership) => membership.channel.id
      )
      return ctx.db.query.notes.findMany({
        where: and(
          inArray(notes.channelId, userChannelIds),
          ilike(notes.content, `%${input.query}%`)
        )
      })
    }),
  get: protectedProcedure
    .input(selectNoteSchema.pick({ id: true }))
    .query(async ({ ctx, input }) => {
      const note = await ctx.db.query.notes.findFirst({
        where: eq(notes.id, input.id),
        with: {
          channel: {
            with: {
              channelMemberships: true
            }
          },
          comments: {
            with: {
              user: true
            }
          },
          noteBookmarks: {
            where: eq(noteBookmarks.userId, ctx.session.user.id)
          }
        }
      })
      if (!note) throw new TRPCError({ code: 'NOT_FOUND' })
      const noteAvailableToUser = note.channel.channelMemberships.find(
        (membership) => membership.userId === ctx.session.user.id
      )
      if (!noteAvailableToUser) throw new TRPCError({ code: 'FORBIDDEN' })
      return note
    }),
  create: protectedProcedure
    .input(insertNoteSchema.omit({ userId: true }))
    .mutation(async ({ ctx, input }) => {
      const membership = await ctx.db.query.channelMemberships.findFirst({
        where: and(
          eq(channelMemberships.userId, ctx.session.user.id),
          eq(channelMemberships.channelId, input.channelId)
        )
      })
      if (!membership) throw new TRPCError({ code: 'FORBIDDEN' })
      const parsedHashtags =
        input.content
          ?.match(HASHTAG_REGEX)
          ?.map((hashtag) => hashtag.split('#')[1] ?? '') ?? []
      const hashtagsPayloads =
        parsedHashtags.length > 0
          ? parsedHashtags.map((hashtag) => ({
              userId: ctx.session.user.id,
              name: hashtag
            }))
          : []
      const contentHashtags =
        hashtagsPayloads.length > 0
          ? await ctx.db
              .insert(hashtags)
              .values(hashtagsPayloads)
              .onConflictDoNothing()
              .returning()
          : []
      const [note] = await ctx.db
        .insert(notes)
        .values({
          content: input.content ?? '{}',
          type: input.type,
          channelId: input.channelId,
          userId: ctx.session.user.id
        })
        .returning()
      const hashtagsToNote = contentHashtags.map((hashtag) => ({
        noteId: note?.id ?? '',
        hashtagId: hashtag.id
      }))
      if (hashtagsToNote.length > 0)
        await ctx.db
          .insert(notesToHashtags)
          .values(hashtagsToNote)
          .onConflictDoNothing()
      return note
    }),
  update: protectedProcedure
    .input(insertNoteSchema.extend({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const membership = await ctx.db.query.channelMemberships.findFirst({
        where: and(
          eq(channelMemberships.userId, ctx.session.user.id),
          eq(channelMemberships.channelId, input.channelId)
        )
      })
      if (!membership) throw new TRPCError({ code: 'FORBIDDEN' })
      const parsedHashtags =
        input.content
          ?.match(HASHTAG_REGEX)
          ?.map((hashtag) => hashtag.split('#')[1] ?? '') ?? []
      const hashtagsPayloads =
        parsedHashtags.length > 0
          ? parsedHashtags.map((hashtag) => ({
              userId: ctx.session.user.id,
              name: hashtag
            }))
          : []
      const contentHashtags =
        hashtagsPayloads.length > 0
          ? await ctx.db
              .insert(hashtags)
              .values(hashtagsPayloads)
              .onConflictDoNothing()
              .returning()
          : []
      const [note] = await ctx.db
        .update(notes)
        .set({
          content: input.content,
          type: input.type,
          channelId: input.channelId,
          dueDate: input.dueDate,
          locked: input.locked
        })
        .where(
          and(eq(notes.id, input.id), eq(notes.channelId, input.channelId))
        )
        .returning()
      const hashtagsToNote = contentHashtags.map((hashtag) => ({
        noteId: note?.id ?? '',
        hashtagId: hashtag.id
      }))
      if (hashtagsToNote.length > 0)
        await ctx.db
          .insert(notesToHashtags)
          .values(hashtagsToNote)
          .onConflictDoNothing()
      return note
    }),
  delete: protectedProcedure
    .input(selectNoteSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.db.query.notes.findFirst({
        where: eq(notes.id, input.id),
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
      return ctx.db.delete(notes).where(eq(notes.id, input.id)).returning()
    })
})
