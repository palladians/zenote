'use client'

import { api } from "@/trpc/react"
import { NoteRenderer } from "./notes/renderer";
import { Skeleton } from "./ui/skeleton";
import { useEffect, useRef } from "react";
import { useChat } from "ai/react";

const NotesSkeleton = () => {
  return (
    <div className="flex flex-col gap-8 mb-24">
      <Skeleton className="w-full h-24" />
      <Skeleton className="w-full h-24" />
      <Skeleton className="w-full h-24" />
    </div>
  )
}

export const NotesList = ({ channelId }: { channelId: string }) => {
  const { messages } = useChat()
  const anchorRef = useRef<HTMLDivElement | null>(null)
  const { data, isLoading } = api.channels.get.useQuery({ id: channelId }, { refetchInterval: 5000 })
  useEffect(() => {
    anchorRef.current?.scrollIntoView()
  }, [isLoading])
  return (
    isLoading
      ? <NotesSkeleton />
      : <div className="flex flex-col gap-4 py-8">
        {data?.notes?.map((note) => <NoteRenderer key={note.id} note={note} />)}
        {messages.map((aiResponse) => <NoteRenderer key={aiResponse.id} note={{ type: 'ai', content: aiResponse.content, channelId }} />)}
        <div ref={anchorRef} className="h-4" />
      </div>
  )
}
