import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { api } from '@/trpc/server'
import { NotesList } from '@/components/channels/notes-list'
import { QuickEditorForm } from '@/components/notes-create/quick-editor-form'

const ChannelPage = async ({ params }: { params: { channelId: string } }) => {
  const { channel, notes } = await api.channels.get.query({
    id: params.channelId
  })
  if (!channel) return null
  return (
    <div className="flex flex-1 flex-col">
      <Navbar
        title={channel.name}
        addon={
          <Button size="sm" variant="secondary">
            Share
          </Button>
        }
      />
      <div className="container flex flex-1 flex-col overflow-y-auto">
        <div className="mx-auto flex w-full max-w-[48rem] flex-1 flex-col justify-end">
          <NotesList notes={notes} />
        </div>
        <div className="sticky bottom-0 px-4">
          <div className="rounded-t-lg bg-background">
            <QuickEditorForm />
            <div className="p-1 text-right text-xs text-zinc-500">&nbsp;</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChannelPage
