import { NotesSearch } from '@/components/notes/notes-search'
import { Sidebar } from '@/components/layout/sidebar'
import { getServerAuthSession } from '@/server/auth'
import { redirect } from 'next/navigation'
import { NoteDeleteDialog } from '@/components/notes/note-delete-dialog'
import { NoteDueDateDialog } from '@/components/notes/note-due-date-dialog'
import { ChannelDeleteDialog } from '../channels/channel-delete-dialog'

export const DashboardLayout = async ({
  children
}: {
  children: React.ReactNode
}) => {
  const session = await getServerAuthSession()
  if (!session?.user.email) redirect('/')
  return (
    <>
      <Sidebar />
      <NotesSearch />
      <NoteDeleteDialog />
      <NoteDueDateDialog />
      <ChannelDeleteDialog />
      <main className="flex flex-[3]">{children}</main>
    </>
  )
}
