import { SignInForm } from '@/components/users/sign-in-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getServerAuthSession } from '@/server/auth'
import { redirect } from 'next/navigation'

const SignInPage = async () => {
  const session = await getServerAuthSession()
  if (session?.user.email) redirect('/channels')
  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="w-full max-w-[32rem] bg-zinc-900">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default SignInPage
