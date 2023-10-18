import NextImage from 'next/image'

export const Sidebar = () => {
  return (
    <aside className="flex flex-col flex-1 border-r bg-zinc-900 p-4">
      <NextImage src="/logo.svg" width={40} height={40} alt="Logo" className="dark:invert" />
      Sidebar
    </aside>
  )
}
