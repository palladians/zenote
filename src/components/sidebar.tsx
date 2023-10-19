import NextImage from 'next/image'
import { Button } from '@/components/ui/button'
import { CircleIcon, PlusIcon } from 'lucide-react'

export const Sidebar = () => {
  return (
    <aside className="flex flex-col flex-1 border-r bg-zinc-900">
      <div className="p-4 border-b">
        <NextImage src="/logo.svg" width={32} height={32} alt="Logo" className="dark:invert" />
      </div>
      <div className="flex flex-col p-4 gap-2 border-b">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-sm">Channels</h2>
          <Button variant="ghost" size="icon">
            <PlusIcon size={14} />
          </Button>
        </div>
        <Button variant="ghost" className="justify-start gap-2">
          <CircleIcon size={14} />
          <span>Random</span>
        </Button>
      </div>
      <div className="flex flex-col p-4 gap-2">
        <h2 className="font-semibold text-sm">Hashtags</h2>
      </div>
    </aside>
  )
}
