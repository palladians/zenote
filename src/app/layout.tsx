import '@/app/globals.css'
import 'focus-visible'

import { Inter } from 'next/font/google'
import { headers } from 'next/headers'

import { TRPCReactProvider } from '@/trpc/react'
import { Providers } from '@/components/providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
})

export const metadata = {
  title: 'Zenote',
  description: 'Tap into a zen feeling with your notes.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }]
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body
        className={`font-sans ${inter.variable} flex max-h-[100vh] min-h-screen flex-row`}
      >
        <TRPCReactProvider headers={headers()}>
          <Providers>{children}</Providers>
        </TRPCReactProvider>
      </body>
    </html>
  )
}

export default RootLayout
