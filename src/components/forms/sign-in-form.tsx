'use client'

import { z } from "zod"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { signIn } from 'next-auth/react'

const signInSchema = z.object({
  email: z.string().email().min(1)
})

type SignInData = z.infer<typeof signInSchema>

export const SignInForm = () => {
  const { register, handleSubmit } = useForm({
    resolver:
      zodResolver(signInSchema),
    defaultValues: {
      email: ''
    }
  })
  const onSubmit: SubmitHandler<SignInData> = async ({ email }) => {
    await signIn('email', { email })
  }
  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <p>Email Address</p>
        <Input {...register('email')} />
      </div>
      <Button type="submit" className="w-full">Send Magic Link</Button>
    </form>
  )
}
