'use client'

import { type UserProps } from '@/lib/types'
import { Button } from '../ui/button'
import { HashIcon } from 'lucide-react'
import NextLink from 'next/link'
import { useParams } from 'next/navigation'
import { cn } from '@/lib/utils'

export const HashtagsList = ({ currentUser }: { currentUser: UserProps }) => {
  const { hashtagName } = useParams()
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h2 className="text-sm font-semibold">Hashtags</h2>
      <div className="flex flex-col">
        {currentUser?.hashtags?.map((hashtag) => {
          const isActive = hashtagName === hashtag.name
          return (
            <Button
              key={hashtag.id}
              variant="link"
              className={cn(
                'justify-start pl-0 text-muted-foreground',
                isActive && 'text-foreground'
              )}
            >
              <NextLink
                href={`/hashtags/${hashtag.name}`}
                className="flex items-center gap-1"
              >
                <HashIcon size={16} />
                <span className="flex-1">{hashtag.name}</span>
              </NextLink>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
