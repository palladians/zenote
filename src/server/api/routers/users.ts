import { eq } from 'drizzle-orm'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { insertUserSchema, users } from '@/server/db/schema'

export const usersRouter = createTRPCRouter({
  me: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.users.findFirst({ where: eq(users.id, ctx.session.user.id) })
  ),
  update: protectedProcedure
    .input(insertUserSchema.omit({ id: true }))
    .mutation(({ ctx, input }) =>
      ctx.db.update(users).set(input).where(eq(users.id, ctx.session.user.id))
    )
})
