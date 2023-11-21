'use client'

import { FullscreenIcon, ShrinkIcon, XIcon } from 'lucide-react'
import { Button } from '../ui/button'
import screenfull from 'screenfull'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NextLink from 'next/link'

type PresentControlsProps = {
  channelId: string
  nextSlideId: string
  previousSlideId: string
}

export const PresentControls = ({
  channelId,
  nextSlideId,
  previousSlideId
}: PresentControlsProps) => {
  const router = useRouter()
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        if (!previousSlideId) return
        router.push(`?current_slide=${previousSlideId}`)
      }
      if (e.key === 'ArrowRight') {
        if (!nextSlideId) return
        router.push(`?current_slide=${nextSlideId}`)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [nextSlideId, previousSlideId, router])
  const toggleFullscreen = async () => {
    await screenfull.toggle()
    router.refresh()
  }
  const turnOffFullscreen = async () => {
    await screenfull.exit()
    router.refresh()
  }
  return (
    <div className="absolute right-4 top-4 flex gap-2">
      <Button variant="secondary" size="icon" onClick={toggleFullscreen}>
        {screenfull.isFullscreen ? (
          <ShrinkIcon size={16} />
        ) : (
          <FullscreenIcon size={16} />
        )}
      </Button>
      <Button variant="secondary" size="icon" asChild>
        <NextLink href={`/channels/${channelId}`} onClick={turnOffFullscreen}>
          <XIcon size={16} />
        </NextLink>
      </Button>
    </div>
  )
}
