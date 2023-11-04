'use client'

import { SubmitHandler, useForm } from "react-hook-form"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { UserProps } from "@/lib/types"
import { api } from "@/trpc/react"
import { useRouter } from "next/navigation"

type ProfileData = {
    name: string
    username: string
}

export const ProfileForm = ({ user }: { user: UserProps }) => {
    const router = useRouter()
    const { mutateAsync: updateProfile } = api.users.update.useMutation()
    const { register, handleSubmit } = useForm<ProfileData>({
        defaultValues: {
            name: user.name ?? '',
            username: user.username
        }
    })
    const onSubmit: SubmitHandler<ProfileData> = async (data) => {
        await updateProfile({
            email: user.email,
            ...data
        })
        router.refresh()
    }
    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-2xl font-semibold">Profile</h1>
            <fieldset className="flex flex-col gap-2 mt-4">
                <Label htmlFor="name">Display Name</Label>
                <Input type="text" id="name" placeholder="Display Name" {...register('name', { required: 'Display name is required' })} />
            </fieldset>
            <fieldset className="flex flex-col gap-2">
                <Label htmlFor="username">Username</Label>
                <Input type="text" id="username" className="input" placeholder="Username" {...register('username', { required: 'Username is required' })} />
            </fieldset>
            <fieldset className="flex flex-col gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input type="text" id="email" className="input" placeholder="Email Address" defaultValue={user.email} disabled />
            </fieldset>
            <div>
            <Button type="submit">Save</Button>
            </div>
        </form>
    )
}