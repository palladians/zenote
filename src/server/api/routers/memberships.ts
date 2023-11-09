import {
  channelInvitations,
  channelMemberships,
  insertChannelInvitationSchema,
  insertChannelMembershipSchema,
  selectChannelInvitationSchema
} from '@/server/db/schema'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { and, eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const membershipsRouter = createTRPCRouter({
  invite: protectedProcedure
    .input(insertChannelInvitationSchema)
    .mutation(async ({ ctx, input }) => {
      const membership = await ctx.db.query.channelMemberships.findFirst({
        where: and(
          eq(channelMemberships.channelId, input.channelId),
          eq(channelMemberships.role, 'admin')
        )
      })
      if (!membership) throw new TRPCError({ code: 'FORBIDDEN' })
      return ctx.db
        .insert(channelInvitations)
        .values({ ...input, role: 'member' })
        .returning()
    }),
  invitations: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.channelInvitations.findMany({
      where: eq(
        channelInvitations.invitationEmail,
        ctx.session.user.email ?? ''
      ),
      with: {
        channel: {
          columns: {
            id: true,
            name: true
          }
        }
      }
    })
  }),
  acceptInvitation: protectedProcedure
    .input(selectChannelInvitationSchema.pick({ id: true, channelId: true }))
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.db.query.channelInvitations.findFirst({
        where: and(
          eq(channelInvitations.channelId, input.channelId),
          eq(channelInvitations.invitationEmail, ctx.session.user.email ?? '')
        )
      })
      if (!invitation) throw new TRPCError({ code: 'FORBIDDEN' })
      const [membership] = await ctx.db
        .insert(channelMemberships)
        .values({
          userId: ctx.session.user.id,
          channelId: invitation?.channelId ?? '',
          role: 'member'
        })
        .returning()
      await ctx.db
        .delete(channelInvitations)
        .where(eq(channelInvitations.id, invitation?.id ?? ''))
      return membership
    }),
  declineInvitation: protectedProcedure
    .input(selectChannelInvitationSchema.pick({ id: true, channelId: true }))
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.db.query.channelInvitations.findFirst({
        where: and(
          eq(channelInvitations.channelId, input.channelId),
          eq(channelInvitations.invitationEmail, ctx.session.user.email ?? '')
        )
      })
      if (!invitation) throw new TRPCError({ code: 'FORBIDDEN' })
      return ctx.db
        .delete(channelInvitations)
        .where(eq(channelInvitations.id, invitation?.id ?? ''))
        .returning()
    }),
  deleteInvitation: protectedProcedure
    .input(selectChannelInvitationSchema.pick({ id: true, channelId: true }))
    .mutation(async ({ ctx, input }) => {
      const membership = await ctx.db.query.channelMemberships.findFirst({
        where: and(
          eq(channelMemberships.channelId, input.channelId),
          eq(channelMemberships.role, 'admin')
        )
      })
      if (!membership) throw new TRPCError({ code: 'FORBIDDEN' })
      return ctx.db
        .delete(channelInvitations)
        .where(
          and(
            eq(channelInvitations.id, input.id),
            eq(channelInvitations.channelId, input.channelId)
          )
        )
        .returning()
    }),
  update: protectedProcedure
    .input(insertChannelMembershipSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const membership = await ctx.db.query.channelMemberships.findFirst({
        where: and(
          eq(channelMemberships.channelId, input.channelId),
          eq(channelMemberships.role, 'admin')
        )
      })
      if (!membership) throw new TRPCError({ code: 'FORBIDDEN' })
      return ctx.db
        .update(channelMemberships)
        .set(input)
        .where(eq(channelMemberships.id, input.id))
        .returning()
    }),
  deleteMembership: protectedProcedure
    .input(z.object({ membershipId: z.string(), channelId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const membership = await ctx.db.query.channelMemberships.findFirst({
        where: and(
          eq(channelMemberships.channelId, input.channelId),
          eq(channelMemberships.role, 'admin')
        )
      })
      if (!membership) throw new TRPCError({ code: 'FORBIDDEN' })
      return ctx.db
        .delete(channelMemberships)
        .where(eq(channelMemberships.id, input.membershipId))
        .returning()
    }),
  leaveChannel: protectedProcedure
    .input(z.object({ channelId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(channelMemberships)
        .where(
          and(
            eq(channelMemberships.channelId, input.channelId),
            eq(channelMemberships.userId, ctx.session.user.id)
          )
        )
        .returning()
    })
})
