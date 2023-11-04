'use client'

import { useEffect, useRef } from 'react'

export const ScrollAnchor = () => {
  const scrollRef = useRef<null | HTMLDivElement>(null)
  useEffect(() => {
    scrollRef.current?.scrollIntoView()
  }, [scrollRef])
  return <div ref={scrollRef} />
}
