import { env } from '@/env.mjs'
import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

export const getStripeClient = () =>
  env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
  loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export const getStripeServer = () =>
  env.STRIPE_SECRET_KEY && new Stripe(env.STRIPE_SECRET_KEY)
