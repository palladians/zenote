'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription
} from '../ui/card'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import type Stripe from 'stripe'
import { formatCurrency } from '@/lib/format'
import { api } from '@/trpc/react'
import { useRouter } from 'next/navigation'

export type SubscribePricing = {
  priceList: Stripe.Price[]
}

export const SubscribePricing = ({ priceList }: SubscribePricing) => {
  const router = useRouter()
  const [isYearly, setIsYearly] = useState(true)
  const { mutateAsync: initCheckout } = api.subscriptions.checkout.useMutation()
  const payOnceLicense = priceList.find(
    (price) => price.lookup_key === 'pay_once_license'
  )
  const annualPrice = priceList.find(
    (price) => price.lookup_key === 'subscription_annual'
  )
  const monthlyPrice = priceList.find(
    (price) => price.lookup_key === 'subscription_monthly'
  )
  const payOnceFormatedPrice =
    payOnceLicense &&
    formatCurrency({
      value: (payOnceLicense.unit_amount ?? 0) / 100,
      currency: payOnceLicense.currency
    })
  const annualFormatedPrice =
    annualPrice &&
    formatCurrency({
      value: (annualPrice.unit_amount ?? 0) / 100 / 12,
      currency: annualPrice.currency
    })
  const monthlyFormatedPrice =
    monthlyPrice &&
    formatCurrency({
      value: (monthlyPrice.unit_amount ?? 0) / 100,
      currency: monthlyPrice.currency
    })
  const initializeCheckoutSession = async ({
    priceId,
    mode
  }: {
    priceId: string
    mode: 'subscription' | 'payment'
  }) => {
    const checkout = await initCheckout({
      priceId,
      mode
    })
    if (!checkout) return
    if (checkout.url) router.push(checkout.url)
  }
  return (
    <Card className="w-full max-w-[40rem] bg-zinc-900">
      <CardHeader>
        <CardTitle>Subscribe to Zenote</CardTitle>
        <CardDescription>
          Last thing before you dive into Zenote.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle className="text-xl">Standard</CardTitle>
              <div className="flex items-center gap-1">
                <Switch
                  id="intervalSwitch"
                  checked={isYearly}
                  onCheckedChange={setIsYearly}
                />
                <Label htmlFor="intervalSwitch">Yearly</Label>
              </div>
            </div>
          </CardHeader>
          <CardContent className="prose dark:prose-invert">
            <ul>
              <li>Unlimited Channels</li>
              <li>Unlimited Notes</li>
              <li>Completion AI</li>
            </ul>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <p className="text-lg">
              {isYearly ? annualFormatedPrice : monthlyFormatedPrice}/mt
            </p>
            <Button
              onClick={() =>
                initializeCheckoutSession({
                  priceId: isYearly
                    ? annualPrice?.id ?? ''
                    : monthlyPrice?.id ?? '',
                  mode: 'subscription'
                })
              }
            >
              Subscribe to Standard
            </Button>
          </CardFooter>
        </Card>
        <p className="text-center">or</p>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Eternal Access</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert">
            <p>
              The same features as Standard plan and every new feature we add
              later.
            </p>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <p className="text-lg">{payOnceFormatedPrice} once</p>
            <Button
              onClick={() =>
                initializeCheckoutSession({
                  priceId: payOnceLicense?.id ?? '',
                  mode: 'payment'
                })
              }
            >
              Get Pay-Once License
            </Button>
          </CardFooter>
        </Card>
      </CardContent>
    </Card>
  )
}
