'use client'

import dynamic from "next/dynamic"
import { AspectRatio } from "../ui/aspect-ratio"

const Excalidraw = dynamic(() => import('@excalidraw/excalidraw').then((comp) => comp.Excalidraw), { ssr: false })

export type DrawingViewProps = {
  content: string
}

export const DrawingView = ({ content }: DrawingViewProps) => {
  const initialElements = content && JSON.parse(content ?? '')
  const initialData = { elements: initialElements, scrollToContent: true }
  return (
    <AspectRatio ratio={2}>
      <Excalidraw theme="dark" initialData={initialData} viewModeEnabled />
    </AspectRatio>
  )
}
