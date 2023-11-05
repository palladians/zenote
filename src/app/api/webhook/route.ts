import { env } from '@/env.mjs'
import { getStripeServer } from '@/lib/stripe'
import { db } from '@/server/db'
import { users } from '@/server/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  if (!env.STRIPE_WEBHOOK_SECRET)
    return NextResponse.json(
      { message: 'Stripe not configured' },
      { status: 500 }
    )
  const stripe = getStripeServer()
  if (!stripe)
    return NextResponse.json(
      { message: 'Stripe not configured' },
      { status: 500 }
    )
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig!,
      env.STRIPE_WEBHOOK_SECRET
    )
    if (!event)
      return NextResponse.json({ message: 'Invalid event' }, { status: 500 })
    switch (event.type) {
      case 'customer.subscription.created':
        await db
          .update(users)
          .set({
            subscriptionTier: 'standard',
            stripeId: String(event.data.object.customer)
          })
          .where(eq(users.id, event.data.object.metadata.localId ?? ''))
        break
      case 'customer.subscription.deleted':
        await db
          .update(users)
          .set({
            subscriptionTier: 'none'
          })
          .where(eq(users.id, event.data.object.metadata.localId ?? ''))
        break
      case 'payment_intent.succeeded':
        await db
          .update(users)
          .set({
            subscriptionTier: 'lifetime',
            stripeId: String(event.data.object.customer)
          })
          .where(eq(users.id, event.data.object.metadata.localId ?? ''))
        break
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      const { message } = error
      return NextResponse.json({ message }, { status: error.statusCode })
    }
  }
}
