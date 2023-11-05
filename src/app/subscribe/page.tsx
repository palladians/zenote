import { SubscribePricing } from '@/components/subscribe/subscribe-pricing'
import { api } from '@/trpc/server'

const SubscribePage = async () => {
  const { data: priceList } = await api.subscriptions.prices.query()
  return (
    <div className="flex flex-1 items-center justify-center">
      <SubscribePricing priceList={priceList} />
    </div>
  )
}

export default SubscribePage
