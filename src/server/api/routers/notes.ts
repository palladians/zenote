import { channels, insertNoteSchema, notes, selectNoteSchema } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { and, eq, ilike, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const notesRouter = createTRPCRouter({
  search: protectedProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const userChannelIds = (await ctx.db.query.channels
        .findMany({
          where: eq(channels.userId, ctx.session.user.id)
        })).map((channel) => channel.id)
      return ctx.db.query.notes
        .findMany({
          where: and(
            inArray(notes.channelId, userChannelIds),
            ilike(notes.content, `%${input.query}%`)
          )
        })
    }),
  get: protectedProcedure
    .input(selectNoteSchema.pick({ id: true }))
    .query(async ({ ctx, input }) => {
      const note = await ctx.db.query.notes
        .findFirst({
          where: eq(notes.id, input.id),
          with: {
            channel: true
          }
        })
      if (note?.channel.userId !== ctx.session.user.id) throw new TRPCError({ code: 'FORBIDDEN' })
      return note
    }),
  create: protectedProcedure
    .input(insertNoteSchema)
    .mutation(async ({ ctx, input }) => {
      const channel = await ctx.db.query.channels
        .findFirst({
          where: and(
            eq(channels.userId, ctx.session.user.id),
            eq(channels.id, input.channelId)
          )
        })
      if (!channel) throw new TRPCError({ code: 'FORBIDDEN' })
      const note = await ctx.db
        .insert(notes)
        .values({ content: input.content, type: input.type, channelId: input.channelId })
        .returning()
      return note
    }),
  update: protectedProcedure
    .input(insertNoteSchema.extend({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const channel = await ctx.db.query.channels
        .findFirst({
          where: and(
            eq(channels.userId, ctx.session.user.id),
            eq(channels.id, input.channelId)
          )
        })
      if (!channel) throw new TRPCError({ code: 'FORBIDDEN' })
      return ctx.db
        .update(notes)
        .set({ content: input.content, type: input.type, channelId: input.channelId })
        .where(
          and(
            eq(notes.id, input.id),
            eq(notes.channelId, input.channelId)
          )
        )
        .returning()
    }),
  delete: protectedProcedure
    .input(selectNoteSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.db.query.notes.findFirst({ where: eq(notes.id, input.id) })
      if (!note) throw new TRPCError({ code: 'FORBIDDEN' })
      const channel = await ctx.db.query.channels
        .findFirst({
          where: and(
            eq(channels.userId, ctx.session.user.id),
            eq(channels.id, note.channelId)
          )
        })
      if (!channel) throw new TRPCError({ code: 'FORBIDDEN' })
      return ctx.db
        .delete(notes)
        .where(
          and(
            eq(notes.id, input.id),
            eq(notes.channelId, channel.id)
          )
        )
        .returning()
    })
})
