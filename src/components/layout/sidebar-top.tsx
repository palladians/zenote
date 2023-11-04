'use client'

import NextImage from 'next/image'
import NextLink from 'next/link'
import { SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/app'

export const SidebarTop = () => {
  const setNotesSearchOpen = useAppStore((state) => state.setNotesSearchOpen)

  return (
    <div className="flex justify-between border-b px-4 py-2">
      <NextLink href="/channels">
        <NextImage
          src="/logo.svg"
          width={32}
          height={32}
          alt="Logo"
          className="dark:invert"
        />
      </NextLink>
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={() => setNotesSearchOpen(true)}
      >
        <SearchIcon size={16} />
        <span>⌘K</span>
      </Button>
    </div>
  )
}
