import NextImage from 'next/image'
import NextLink from 'next/link'
import { ChannelsList } from './channels-list'
import { Button } from './ui/button'
import { SearchIcon } from 'lucide-react'

export const Sidebar = () => {
  return (
    <aside className="flex flex-col flex-1 border-r bg-zinc-900">
      <div className="flex justify-between py-2 px-4 border-b">
        <NextLink href="/channels">
          <NextImage src="/logo.svg" width={32} height={32} alt="Logo" className="dark:invert" />
        </NextLink>
        <Button variant="ghost" size="sm" className="gap-2">
          <SearchIcon size={16} />
          <span>⌘K</span>
        </Button>
      </div>
      <ChannelsList />
      <div className="flex flex-col p-4 gap-4">
        <h2 className="font-semibold text-sm">Hashtags</h2>
        <div className="flex flex-col">
          <Button variant="link" className="justify-start pl-0 text-muted-foreground">#til</Button>
          <Button variant="link" className="justify-start pl-0 text-muted-foreground">#todo</Button>
        </div>
      </div>
    </aside>
  )
}
