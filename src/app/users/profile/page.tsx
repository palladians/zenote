import { ProfileForm } from '@/components/profile/profile-form'
import { api } from '@/trpc/server'

const ProfilePage = async () => {
  const user = await api.users.me.query()
  if (!user) return null
  return (
    <div className="container flex max-w-[40rem] flex-col gap-4 py-8">
      <ProfileForm user={user} />
    </div>
  )
}

export default ProfilePage
