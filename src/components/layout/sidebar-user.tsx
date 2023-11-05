'use client'

import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenu
} from '@/components/ui/dropdown-menu'
import { UserIcon, LogOutIcon } from 'lucide-react'
import NextLink from 'next/link'
import { signOut } from 'next-auth/react'
import { UserAvatar } from '../users/user-avatar'
import { Button } from '../ui/button'
import { api } from '@/trpc/react'

export const SidebarUser = () => {
  const { data: me } = api.users.me.useQuery()
  return (
    <div className="border-t px-4 py-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2">
            <UserAvatar />
            <span>{me?.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem asChild>
            <NextLink href="/users/profile" className="flex gap-2">
              <UserIcon size={20} />
              <span>Profile</span>
            </NextLink>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 text-red-700 dark:text-red-500"
            onClick={() => signOut()}
          >
            <LogOutIcon size={20} />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
