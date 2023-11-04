import { ProfileForm } from "@/components/profile/profile-form"
import { api } from "@/trpc/server"

const ProfilePage = async () => {
    const user = await api.users.me.query()
    if (!user) return null
    return (
        <div className="container flex flex-col max-w-[40rem] gap-4 py-8">
            <ProfileForm user={user} />
        </div>
    )
}

export default ProfilePage