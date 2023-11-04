import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export const UserAvatar = () => {
  return (
    <Avatar className="h-7 w-7">
      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-teal-700" />
    </Avatar>
  )
}
