import { Badge } from '../ui/badge'

export const NoteFiles = () => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-t px-4 py-2">
        <h2 className="text-lg font-semibold">Files</h2>
      </div>
      <div className="p-4">
        <Badge>Coming Soon</Badge>
      </div>
    </div>
  )
}
