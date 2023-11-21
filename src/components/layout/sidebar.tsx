import { ChannelsList } from '@/components/layout/channels-list'
import { SidebarTop } from '@/components/layout/sidebar-top'
import { SidebarUser } from './sidebar-user'
import { api } from '@/trpc/server'
import { HashtagsList } from './hashtags-list'

export const Sidebar = async () => {
  const memberships = await api.channels.index.query()
  const currentUser = await api.users.me.query()
  return (
    <aside className="flex flex-1 flex-col border-r bg-zinc-900">
      <SidebarTop />
      <ChannelsList memberships={memberships} />
      <HashtagsList currentUser={currentUser as never} />
      <SidebarUser currentUser={currentUser as never} />
    </aside>
  )
}
