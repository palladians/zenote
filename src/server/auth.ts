import { DrizzleAdapter } from '@auth/drizzle-adapter'
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  type DefaultUser
} from 'next-auth'
import EmailProvider from 'next-auth/providers/email'

import { env } from '@/env.mjs'
import { db } from '@/server/db'
import { pgTable, users } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescrzipt#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      username?: string
      stripeId?: string
      subscriptionTier?: 'none' | 'standard' | 'lifetime'
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    username?: string
    stripeId?: string
    subscriptionTier?: 'none' | 'standard' | 'lifetime'
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ user, token }) {
      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.id)
      })
      if (!dbUser) return token
      return {
        id: dbUser.id,
        name: dbUser.name,
        username: dbUser.username,
        email: dbUser.email,
        stripeId: dbUser.stripeId,
        subscriptionTier: dbUser.subscriptionTier
      }
    },
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        stripeId: user.stripeId,
        subscriptionTier: user.subscriptionTier,
        id: user.id
      }
    })
  },
  adapter: DrizzleAdapter(db, pgTable),
  providers: [
    EmailProvider({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: env.EMAIL_SERVER_PORT,
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD
        }
      },
      from: env.EMAIL_FROM
    })
  ]
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions)
