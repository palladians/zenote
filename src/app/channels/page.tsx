import { Navbar } from '@/components/layout/navbar'
import { api } from '@/trpc/server'
import { NoteRenderer } from '@/components/channels/note-renderer'
import { Button } from '@/components/ui/button'
import { BellIcon } from 'lucide-react'

const HomePage = async () => {
  const flowBox = await api.notes.index.query()
  const bookmarkedNotes = await api.bookmarks.index.query()
  return (
    <div className="flex flex-1 flex-col gap-8">
      <Navbar title="Dashboard" addon={<Button size="sm" variant="secondary"><BellIcon size={16} /></Button>} />
      <div className="container flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">FlowBox</h2>
        <div className="grid grid-cols-2 gap-4">
          {flowBox.map((note) => (
            <NoteRenderer key={note.id} note={note} short />
          ))}
        </div>
        <h2 className="text-2xl font-semibold">Bookmarks</h2>
        <div className="grid grid-cols-2 gap-4">
          {bookmarkedNotes.map((note) => (
            <NoteRenderer key={note.id} note={note} short />
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage
