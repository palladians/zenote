import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { insertBookmarkSchema, noteBookmarks } from '@/server/db/schema'
import { and, eq } from 'drizzle-orm'

export const bookmarksRouter = createTRPCRouter({
  index: protectedProcedure.query(async ({ ctx }) => {
    const bookmarks = await ctx.db.query.noteBookmarks.findMany({
      where: eq(noteBookmarks.userId, ctx.session.user.id),
      with: {
        note: {
          with: {
            noteBookmarks: true
          }
        }
      }
    })
    return bookmarks.map((bookmark) => bookmark.note)
  }),
  toggle: protectedProcedure
    .input(insertBookmarkSchema)
    .mutation(async ({ ctx, input }) => {
      const bookmark = await ctx.db.query.noteBookmarks.findFirst({
        where: and(
          eq(noteBookmarks.noteId, input.noteId),
          eq(noteBookmarks.userId, ctx.session.user.id)
        )
      })
      if (!bookmark) {
        return ctx.db.insert(noteBookmarks).values(input)
      }
      return ctx.db
        .delete(noteBookmarks)
        .where(eq(noteBookmarks.id, bookmark.id))
        .returning()
    })
})
