import { NotesSearch } from "@/components/notes-search";
import { Sidebar } from "@/components/sidebar";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await getServerAuthSession()
  if (!session?.user.email) redirect('/')
  return (
    <>
      <Sidebar />
      <NotesSearch />
      <main className="flex flex-[3]">
        {children}
      </main>
    </>
  )
}
