'use client'

import { api } from "@/trpc/react"
import { EditorCore, OnSaveHandler } from "../editor/core"
import { useParams } from "next/navigation"
import { Button } from "../ui/button"
import { BrushIcon, MonitorIcon, PlusIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"

export type EditorFormProps = {
  extended?: boolean
  saveCallback?: () => void
}

export const EditorForm = ({ extended = false, saveCallback }: EditorFormProps) => {
  const { channelId } = useParams()
  const { mutateAsync: createNote } = api.notes.create.useMutation()
  const onSave: OnSaveHandler = async ({ content }) => {
    await createNote({
      content,
      type: 'text' as never,
      channelId: String(channelId)
    })
    saveCallback && saveCallback()
    console.log('>>>B', content)
  }
  const createDrawing = async () => {
    await createNote({
      content: '',
      type: 'drawing' as never,
      channelId: String(channelId)
    })
  }
  return (
    <div className="flex gap-2 items-center z-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full bg-zinc-900 border w-12 h-12">
            <PlusIcon size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="gap-2" onClick={createDrawing}>
            <BrushIcon size={20} />
            <span>Drawing</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2">
            <MonitorIcon size={20} />
            <span>Embed</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditorCore onSave={onSave} />
    </div>
  )
}
