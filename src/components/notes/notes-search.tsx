'use client'

import * as React from 'react'
import { Calendar } from 'lucide-react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { api } from '@/trpc/react'
import { useAppStore } from '@/store/app'

export const NotesSearch = () => {
  const [query, setQuery] = React.useState<string>('')
  const { data } = api.notes.search.useQuery(
    { query },
    { enabled: query.length > 0 }
  )
  const notesSearchOpen = useAppStore((state) => state.notesSearchOpen)
  const setNotesSearchOpen = useAppStore((state) => state.setNotesSearchOpen)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setNotesSearchOpen(!notesSearchOpen)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <CommandDialog open={notesSearchOpen} onOpenChange={setNotesSearchOpen}>
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder="Type a command or search..."
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Results">
          <CommandItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
