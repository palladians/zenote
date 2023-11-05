'use client'

export type NavbarProps = {
  title: React.ReactNode
  addon?: React.ReactNode
}

export const Navbar = ({ title, addon }: NavbarProps) => {
  return (
    <header className="flex items-center justify-between border-b bg-zinc-900 px-4 py-2">
      <div className="flex items-center gap-2">
        {typeof title === 'string' ? (
          <h3 className="font-semibold">{title}</h3>
        ) : (
          title
        )}
      </div>
      <div className="flex gap-2">{addon}</div>
    </header>
  )
}
