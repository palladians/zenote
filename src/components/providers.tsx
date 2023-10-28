'use client'

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { useEffect } from "react";
import { install } from '@github/hotkey'

type ProvidersProps = {
  children: React.ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
  useEffect(() => {
    for (const el of document.querySelectorAll('[data-hotkey]')) {
      console.log('install')
      install(el as never)
    }
  }, [])
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>{children}</ThemeProvider>
    </SessionProvider>
  )
}
