'use client'

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserIcon, LogOutIcon } from "lucide-react"
import { useSession, signOut } from "next-auth/react"

export type NavbarProps = {
  title: string
  addon?: React.ReactNode
}

export const Navbar = ({ title, addon }: NavbarProps) => {
  const { data } = useSession()
  return (
    <header className="flex items-center justify-between bg-zinc-900 py-2 px-4 border-b">
      <div className="flex gap-2 items-center">
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="flex gap-2">
        {addon}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-teal-700" />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            <DropdownMenuItem className="gap-2">
              <UserIcon size={20} />
              <span>{data?.user.email}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-red-700 dark:text-red-500" onClick={() => signOut()}>
              <LogOutIcon size={20} />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
