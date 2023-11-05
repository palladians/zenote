import { relations, sql } from 'drizzle-orm'
import {
  uuid,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  boolean
} from 'drizzle-orm/pg-core'
import { type AdapterAccount } from 'next-auth/adapters'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator
} from 'unique-names-generator'

export const pgTable = pgTableCreator((name) => `zenote_${name}`)

export const comments = pgTable('comment', {
  id: uuid('id').primaryKey().unique().defaultRandom(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  noteId: uuid('noteId')
    .notNull()
    .references(() => notes.id, { onDelete: 'cascade' }),
  content: varchar('content', { length: 512 }),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updatedAt').defaultNow()
})

export const hashtags = pgTable('hashtag', {
  id: uuid('id').primaryKey().unique().defaultRandom(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 64 }).notNull()
})

export const notes = pgTable('note', {
  id: uuid('id').primaryKey().unique().defaultRandom(),
  channelId: uuid('channelId')
    .notNull()
    .references(() => channels.id, { onDelete: 'cascade' }),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type', { enum: ['text', 'drawing', 'embed', 'ai'] }).notNull(),
  content: varchar('content', { length: 1024 }),
  locked: boolean('locked').default(false),
  dueDate: timestamp('dueDate'),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updatedAt').defaultNow()
})

export const noteBookmarks = pgTable('note_bookmark', {
  id: uuid('id').primaryKey().unique().defaultRandom(),
  noteId: uuid('noteId')
    .notNull()
    .references(() => notes.id, { onDelete: 'cascade' }),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
})

export const channels = pgTable('channel', {
  id: uuid('id').primaryKey().unique().defaultRandom(),
  name: varchar('name', { length: 64 }).notNull(),
  userId: text('userId')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updatedAt').defaultNow()
})

export const channelInvitations = pgTable('channel_invitation', {
  id: uuid('id').primaryKey().unique().defaultRandom(),
  channelId: uuid('channelId')
    .notNull()
    .references(() => channels.id, { onDelete: 'cascade' }),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  role: varchar('role', { enum: ['member', 'admin'] })
})

export const channelMemberships = pgTable('channel_membership', {
  id: uuid('id').primaryKey().unique().defaultRandom(),
  channelId: uuid('channelId')
    .notNull()
    .references(() => channels.id, { onDelete: 'cascade' }),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  role: varchar('role', { enum: ['member', 'admin'] })
})

export const users = pgTable('user', {
  id: text('id').primaryKey().unique().notNull(),
  name: varchar('name', { length: 255 }),
  username: varchar('username', { length: 255 })
    .default(
      uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] })
    )
    .notNull()
    .unique(),
  stripeId: varchar('stripeId', { length: 255 }),
  subscriptionTier: varchar('subscriptionTier', {
    length: 255,
    enum: ['none', 'standard', 'lifetime']
  }).default('none'),
  email: varchar('email', { length: 255 }).notNull(),
  emailVerified: timestamp('emailVerified').default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar('image', { length: 255 })
})

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 255 })
      .$type<AdapterAccount['type']>()
      .notNull(),
    provider: varchar('provider', { length: 255 }).notNull(),
    providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: varchar('token_type', { length: 255 }),
    scope: varchar('scope', { length: 255 }),
    id_token: text('id_token'),
    session_state: varchar('session_state', { length: 255 })
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index('userId_idx').on(account.userId)
  })
)

export const sessions = pgTable(
  'session',
  {
    sessionToken: varchar('sessionToken', { length: 255 })
      .notNull()
      .primaryKey(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires', { mode: 'date' }).notNull()
  },
  (session) => ({
    userIdIdx: index('userId_idx').on(session.userId)
  })
)

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: varchar('identifier', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull()
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token)
  })
)

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] })
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] })
}))

export const usersRelations = relations(users, ({ many }) => ({
  channels: many(channels),
  accounts: many(accounts),
  comments: many(comments),
  notes: many(notes),
  noteBookmarks: many(noteBookmarks),
  channelInvitations: many(channelInvitations),
  channelMemberships: many(channelMemberships)
}))

export const channelsRelations = relations(channels, ({ many, one }) => ({
  user: one(users, { fields: [channels.userId], references: [users.id] }),
  notes: many(notes),
  channelInvitations: many(channelInvitations),
  channelMemberships: many(channelMemberships)
}))

export const channelInvitationsRelations = relations(
  channelInvitations,
  ({ one }) => ({
    user: one(users, {
      fields: [channelInvitations.userId],
      references: [users.id]
    }),
    channel: one(channels, {
      fields: [channelInvitations.channelId],
      references: [channels.id]
    })
  })
)

export const channelMembershipsRelations = relations(
  channelMemberships,
  ({ one }) => ({
    user: one(users, {
      fields: [channelMemberships.userId],
      references: [users.id]
    }),
    channel: one(channels, {
      fields: [channelMemberships.channelId],
      references: [channels.id]
    })
  })
)

export const notesRelations = relations(notes, ({ many, one }) => ({
  channel: one(channels, {
    fields: [notes.channelId],
    references: [channels.id]
  }),
  user: one(users, { fields: [notes.userId], references: [users.id] }),
  comments: many(comments),
  noteBookmarks: many(noteBookmarks),
  notesToHashtags: many(notesToHashtags)
}))

export const hashtagsRelations = relations(hashtags, ({ many, one }) => ({
  user: one(users, { fields: [hashtags.userId], references: [users.id] }),
  notesToHashtags: many(notesToHashtags)
}))

export const notesToHashtags = pgTable(
  'notes_to_hashtags',
  {
    noteId: uuid('noteId')
      .notNull()
      .references(() => notes.id),
    hashtagId: uuid('hashtagId')
      .notNull()
      .references(() => hashtags.id)
  },
  (t) => ({
    pk: primaryKey(t.noteId, t.hashtagId)
  })
)

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, { fields: [comments.userId], references: [users.id] }),
  note: one(notes, { fields: [comments.noteId], references: [notes.id] })
}))

export const noteBookmarksRelations = relations(noteBookmarks, ({ one }) => ({
  user: one(users, { fields: [noteBookmarks.userId], references: [users.id] }),
  note: one(notes, { fields: [noteBookmarks.noteId], references: [notes.id] })
}))

export const notesToHashtagsRelations = relations(
  notesToHashtags,
  ({ one }) => ({
    note: one(notes, {
      fields: [notesToHashtags.noteId],
      references: [notes.id]
    }),
    hashtag: one(hashtags, {
      fields: [notesToHashtags.hashtagId],
      references: [hashtags.id]
    })
  })
)

export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)
export const insertChannelSchema = createInsertSchema(channels)
export const selectChannelSchema = createSelectSchema(channels)
export const insertNoteSchema = createInsertSchema(notes)
export const selectNoteSchema = createSelectSchema(notes)
export const insertCommentSchema = createInsertSchema(comments)
export const selectCommentSchema = createSelectSchema(comments)
export const insertBookmarkSchema = createInsertSchema(noteBookmarks)
export const selectBookmarkSchema = createSelectSchema(noteBookmarks)
