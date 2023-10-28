import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { channels, insertChannelSchema, notes, selectChannelSchema } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const channelsRouter = createTRPCRouter({
  index: protectedProcedure
    .query(({ ctx }) =>
      ctx.db.query.channels.findMany({
        where: eq(channels.userId, ctx.session.user.id)
      })
    ),
  get: protectedProcedure
    .input(selectChannelSchema.pick({ id: true }))
    .query(async ({ ctx, input }) => {
      const channel = await ctx.db.query.channels.findFirst({
        where: and(
          eq(channels.userId, ctx.session.user.id),
          eq(channels.id, input.id)
        )
      })
      if (!channel) throw new TRPCError({ code: 'NOT_FOUND' })
      const channelNotes = await ctx.db.query.notes.findMany({
        where: eq(notes.channelId, channel?.id)
      })
      return {
        channel,
        notes: channelNotes
      }
    }),
  create: protectedProcedure
    .input(insertChannelSchema)
    .mutation(({ ctx, input }) =>
      ctx.db.insert(channels)
        .values({ name: input.name, userId: ctx.session.user.id })
        .returning()
    ),
  update: protectedProcedure
    .input(
      insertChannelSchema.extend({ id: z.string().min(1) })
    ).mutation(({ ctx, input }) =>
      ctx.db
        .update(channels)
        .set({ name: input.name })
        .where(
          and(
            eq(channels.userId, ctx.session.user.id),
            eq(channels.id, input.id)
          )
        )
        .returning()
    ),
  delete: protectedProcedure
    .input(
      selectChannelSchema.pick({ id: true })
    ).mutation(({ ctx, input }) =>
      ctx.db
        .delete(channels)
        .where(
          and(
            eq(channels.userId, ctx.session.user.id),
            eq(channels.id, input.id)
          )
        )
        .returning()
    )
})
