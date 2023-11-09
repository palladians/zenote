import { Navbar } from '@/components/layout/navbar'
import { api } from '@/trpc/server'
import { NoteRenderer } from '@/components/channels/note-renderer'
import { Button } from '@/components/ui/button'
import { BellIcon, ClockIcon, StarIcon } from 'lucide-react'
import { type NoteProps } from '@/lib/types'
import { Card } from '@/components/ui/card'

const evenOddColumns = (list: NoteProps[]) => {
  return {
    odd: list.filter((_, i) => i % 2 === 0),
    even: list.filter((_, i) => i % 2 !== 0)
  }
}

const HomePage = async () => {
  const flowBox = await api.notes.index.query()
  const bookmarkedNotes = await api.bookmarks.index.query()
  const { odd: flowBoxOdd, even: flowBoxEven } = evenOddColumns(flowBox)
  const { odd: bookmarksOdd, even: bookmarksEven } =
    evenOddColumns(bookmarkedNotes)
  return (
    <div className="flex flex-1 flex-col gap-8">
      <Navbar
        title="Dashboard"
        addon={
          <Button size="sm" variant="secondary">
            <BellIcon size={16} />
          </Button>
        }
      />
      <div className="container flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">FlowBox</h2>
          {flowBox.length > 0 ? (
            <div className="flex gap-4">
              <div className="flex flex-1 flex-col gap-4">
                {flowBoxOdd.map((note) => (
                  <NoteRenderer key={note.id} note={note} short />
                ))}
              </div>
              <div className="flex flex-1 flex-col gap-4">
                {flowBoxEven.map((note) => (
                  <NoteRenderer key={note.id} note={note} short />
                ))}
              </div>
            </div>
          ) : (
            <Card className="flex items-center gap-2 p-4">
              <span>
                Start using FlowBox by setting a due date of a note with
              </span>
              <ClockIcon size={20} />
              <span>button.</span>
            </Card>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Bookmarks</h2>
          {bookmarkedNotes.length > 0 ? (
            <div className="flex gap-4">
              <div className="flex flex-1 flex-col gap-4">
                {bookmarksOdd.map((note) => (
                  <NoteRenderer key={note.id} note={note} short />
                ))}
              </div>
              <div className="flex flex-1 flex-col gap-4">
                {bookmarksEven.map((note) => (
                  <NoteRenderer key={note.id} note={note} short />
                ))}
              </div>
            </div>
          ) : (
            <Card className="flex items-center gap-2 p-4">
              <span>Bookmark notes with</span>
              <StarIcon size={20} />
              <span>button to display them here.</span>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage
