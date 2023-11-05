import { createTRPCRouter } from '@/server/api/trpc'
import { channelsRouter } from './routers/channels'
import { notesRouter } from './routers/notes'
import { commentsRouter } from '@/server/api/routers/comments'
import { bookmarksRouter } from '@/server/api/routers/bookmarks'
import { usersRouter } from './routers/users'
import { subscriptionsRouter } from './routers/subscriptions'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  channels: channelsRouter,
  notes: notesRouter,
  comments: commentsRouter,
  bookmarks: bookmarksRouter,
  users: usersRouter,
  subscriptions: subscriptionsRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
