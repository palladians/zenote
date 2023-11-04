import { Badge } from "../ui/badge"

export const NoteFiles = () => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center border-b border-t py-2 px-4">
        <h2 className="text-lg font-semibold">Files</h2>
      </div>
      <div className="p-4">
        <Badge>Coming Soon</Badge>
      </div>
    </div>
  )
}
