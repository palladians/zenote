import { relations, sql } from "drizzle-orm";
import {
  uuid,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const pgTable = pgTableCreator((name) => `zenote_${name}`);

export const hashtags = pgTable('hashtag', {
  id: uuid("id").primaryKey().unique().defaultRandom(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 64 }).notNull()
})

export const notes = pgTable('note', {
  id: uuid("id").primaryKey().unique().defaultRandom(),
  channelId: uuid("channelId").notNull().references(() => channels.id, { onDelete: "cascade" }),
  type: text('type', { enum: ['text', 'drawing', 'embed', 'ai'] }).notNull(),
  content: varchar('1024'),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").defaultNow()
})

export const channels = pgTable('channel', {
  id: uuid("id").primaryKey().unique().defaultRandom(),
  name: varchar("name", { length: 64 }).notNull(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").defaultNow()
})

export const users = pgTable("user", {
  id: text("id").primaryKey().unique().notNull(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified").default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId").notNull().references(() => users.id, { onDelete: 'cascade' }),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId),
  })
);

export const sessions = pgTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  })
);

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  channels: many(channels),
  accounts: many(accounts),
}))

export const channelsRelations = relations(channels, ({ many, one }) => ({
  user: one(users, { fields: [channels.userId], references: [users.id] }),
  notes: many(notes)
}))

export const notesRelations = relations(notes, ({ many, one }) => ({
  channel: one(channels, { fields: [notes.channelId], references: [channels.id] }),
  notesToHashtags: many(notesToHashtags)
}))

export const hashtagsRelations = relations(hashtags, ({ many, one }) => ({
  user: one(users, { fields: [hashtags.userId], references: [users.id] }),
  notesToHashtags: many(notesToHashtags)
}))

export const notesToHashtags = pgTable('notes_to_hashtags', {
  noteId: uuid('noteId').notNull().references(() => notes.id),
  hashtagId: uuid('hashtagId').notNull().references(() => hashtags.id),
}, (t) => ({
  pk: primaryKey(t.noteId, t.hashtagId),
}),
);

export const notesToHashtagsRelations = relations(notesToHashtags, ({ one }) => ({
  note: one(notes, {
    fields: [notesToHashtags.noteId],
    references: [notes.id]
  }),
  hashtag: one(hashtags, {
    fields: [notesToHashtags.hashtagId],
    references: [hashtags.id]
  })
}))

export const insertChannelSchema = createInsertSchema(channels)
export const selectChannelSchema = createSelectSchema(channels)
export const insertNoteSchema = createInsertSchema(notes)
export const selectNoteSchema = createSelectSchema(notes)
