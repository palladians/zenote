import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import {
  channelMemberships,
  channels,
  insertChannelSchema,
  notes,
  selectChannelSchema
} from '@/server/db/schema'
import { and, asc, eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { omit } from 'rambda'
import { nanoid } from 'nanoid'

export const channelsRouter = createTRPCRouter({
  index: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.channelMemberships.findMany({
      where: eq(channelMemberships.userId, ctx.session.user.id),
      with: {
        channel: true
      }
    })
  }),
  get: protectedProcedure
    .input(selectChannelSchema.pick({ id: true }))
    .query(async ({ ctx, input }) => {
      const channelMembership = await ctx.db.query.channelMemberships.findFirst(
        {
          where: and(
            eq(channelMemberships.userId, ctx.session.user.id),
            eq(channelMemberships.channelId, input.id)
          ),
          with: {
            channel: {
              with: {
                notes: {
                  with: {
                    user: true,
                    noteBookmarks: true
                  },
                  orderBy: [asc(notes.createdAt)]
                },
                channelMemberships: {
                  with: {
                    user: true
                  }
                },
                channelInvitations: true
              }
            }
          }
        }
      )
      if (!channelMembership) throw new TRPCError({ code: 'NOT_FOUND' })
      return {
        channel: omit(['notes', 'channelMemberships', 'channelInvitations'])(
          channelMembership.channel
        ),
        notes: channelMembership.channel.notes,
        channelMemberships:
          channelMembership.role === 'admin' &&
          channelMembership.channel.channelMemberships,
        channelInvitations:
          channelMembership.role === 'admin' &&
          channelMembership.channel.channelInvitations,
        role: channelMembership.role
      }
    }),
  create: protectedProcedure
    .input(insertChannelSchema.omit({ webhookSecretKey: true }))
    .mutation(async ({ ctx, input }) => {
      const [channel] = await ctx.db
        .insert(channels)
        .values({
          name: input.name,
          userId: ctx.session.user.id,
          webhookSecretKey: nanoid()
        })
        .returning()
      if (!channel) return
      await ctx.db.insert(channelMemberships).values({
        channelId: channel.id,
        userId: ctx.session.user.id,
        role: 'admin'
      })
      return channel
    }),
  update: protectedProcedure
    .input(insertChannelSchema.extend({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const channelMembership = await ctx.db.query.channelMemberships.findFirst(
        {
          where: and(
            eq(channelMemberships.userId, ctx.session.user.id),
            eq(channelMemberships.channelId, input.id)
          ),
          with: {
            channel: true
          }
        }
      )
      if (channelMembership?.role !== 'admin')
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      return ctx.db
        .update(channels)
        .set({ name: input.name })
        .where(and(eq(channels.id, input.id)))
        .returning()
    }),
  delete: protectedProcedure
    .input(selectChannelSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      const channelMembership = await ctx.db.query.channelMemberships.findFirst(
        {
          where: and(
            eq(channelMemberships.userId, ctx.session.user.id),
            eq(channelMemberships.channelId, input.id)
          ),
          with: {
            channel: true
          }
        }
      )
      if (channelMembership?.role !== 'admin')
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      return ctx.db
        .delete(channels)
        .where(and(eq(channels.id, input.id)))
        .returning()
    })
})
