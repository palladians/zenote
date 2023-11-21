import { Navbar } from '@/components/layout/navbar'
import { api } from '@/trpc/server'
import { NotesList } from '@/components/channels/notes-list'
import { QuickEditorForm } from '@/components/notes-create/quick-editor-form'

const HashtagPage = async ({ params }: { params: { hashtagName: string } }) => {
  const { notes, hashtag } = await api.notes.byHashtag.query({
    hashtagName: params.hashtagName
  })
  if (!notes) return null
  if (!hashtag) return null
  return (
    <div className="flex flex-1 flex-col">
      <Navbar
        title={
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">#{hashtag.name}</h3>
          </div>
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

export default HashtagPage
