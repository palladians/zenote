'use client'

import { FileIcon } from 'lucide-react'

import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { useAppStore } from '@/store/app'
import { api } from '@/trpc/react'
import debounceFunction from 'debounce-fn'
import { useEffect, useState } from 'react'
import { getText } from '@/lib/tiptap'
import { useRouter } from 'next/navigation'

export const NotesSearch = () => {
  const router = useRouter()
  const [query, setQuery] = useState<string>('')
  const { data, refetch } = api.notes.search.useQuery(
    { query },
    { enabled: false }
  )
  const debouncedRefetch = debounceFunction(refetch, { wait: 1000 })
  const notesSearchOpen = useAppStore((state) => state.notesSearchOpen)
  const setNotesSearchOpen = useAppStore((state) => state.setNotesSearchOpen)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setNotesSearchOpen(!notesSearchOpen)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [notesSearchOpen, setNotesSearchOpen])

  useEffect(() => {
    if (!query) return
    void debouncedRefetch()
  }, [query])

  const openNote = (id: string) => {
    router.push(`/notes/${id}`)
    router.refresh()
    setNotesSearchOpen(false)
  }

  return (
    <CommandDialog open={notesSearchOpen} onOpenChange={setNotesSearchOpen}>
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder="Type a command or search..."
      />
      <CommandList>
        <CommandGroup heading="Results">
          {data?.map((note, i) => {
            if (!note.content) return null
            const excerpt = getText(note.content)
            return (
              <CommandItem key={i} onSelect={() => openNote(note.id)}>
                <FileIcon className="mr-2 h-4 w-4" />
                <span>{excerpt.substring(0, 64)}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
