import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import Stripe from 'stripe'

export const subscriptionsRouter = createTRPCRouter({
  prices: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.stripe) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    return ctx.stripe.prices.list()
  }),
  checkout: protectedProcedure
    .input(
      z.object({
        priceId: z.string(),
        mode: z.enum(['subscription', 'payment'])
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.stripe) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      const origin = ctx.headers.get('origin') ?? 'http://localhost:3000'
      try {
        const session = await ctx.stripe.checkout.sessions.create({
          mode: input.mode,
          line_items: [
            {
              price: input.priceId,
              quantity: 1
            }
          ],
          success_url: `${origin}/`,
          cancel_url: `${origin}/subscribe`,
          metadata: {
            localId: ctx.session.user.id
          }
        })
        return session
      } catch (error) {
        if (error instanceof Stripe.errors.StripeError) {
          const { message } = error
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message })
        }
      }
    })
})
