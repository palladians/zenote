import { ChannelsList } from '@/components/layout/channels-list'
import { Button } from '@/components/ui/button'
import { SidebarTop } from '@/components/layout/sidebar-top'
import { SidebarUser } from './sidebar-user'

export const Sidebar = () => {
  return (
    <aside className="flex flex-1 flex-col border-r bg-zinc-900">
      <SidebarTop />
      <ChannelsList />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <h2 className="text-sm font-semibold">Hashtags</h2>
        <div className="flex flex-col">
          <Button
            variant="link"
            className="justify-start pl-0 text-muted-foreground"
          >
            #til
          </Button>
          <Button
            variant="link"
            className="justify-start pl-0 text-muted-foreground"
          >
            #todo
          </Button>
        </div>
      </div>
      <SidebarUser />
    </aside>
  )
}
