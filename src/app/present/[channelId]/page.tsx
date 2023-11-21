import { NoteContentRenderer } from '@/components/notes/note-content-renderer'
import { PresentControls } from '@/components/present/present-controls'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { api } from '@/trpc/server'
import { ExpandIcon } from 'lucide-react'
import NextLink from 'next/link'

const PresentChannelPage = async ({
  params,
  searchParams
}: {
  params: { channelId: string }
  searchParams: Record<string, string | string[] | undefined>
}) => {
  const { channel, notes, role } = await api.channels.get.query({
    id: params.channelId
  })
  const currentSlideId = searchParams.current_slide ?? notes[0]?.id
  const currentSlideIndex = notes.findIndex(
    (note) => note.id === currentSlideId
  )
  const currentSlide = notes[currentSlideIndex]
  if (!channel) return null
  if (!role) return null
  return (
    <div className="relative flex flex-1">
      <PresentControls
        channelId={channel.id}
        previousSlideId={notes[currentSlideIndex - 1]?.id ?? ''}
        nextSlideId={notes[currentSlideIndex + 1]?.id ?? ''}
      />
      <div className="container flex max-w-[48rem] flex-1 py-8">
        <div className="flex flex-1 flex-col gap-4">
          <Card className="relative flex flex-1 items-center justify-center overflow-y-scroll">
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-4"
              asChild
            >
              <NextLink href={`/notes/${currentSlide?.id}`}>
                <ExpandIcon size={16} />
              </NextLink>
            </Button>
            <div className="w-full p-4">
              <NoteContentRenderer content={currentSlide?.content ?? ''} />
            </div>
          </Card>
          <div className="grid grid-cols-5 gap-4">
            {notes.map((note) => (
              <NextLink key={note.id} href={`?current_slide=${note.id}`}>
                <Card
                  className={cn(
                    'flex-1 p-2',
                    currentSlideId === note.id && 'border-blue-800'
                  )}
                >
                  <AspectRatio ratio={1.1} className="overflow-hidden">
                    <NoteContentRenderer content={note.content ?? ''} small />
                  </AspectRatio>
                </Card>
              </NextLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PresentChannelPage
