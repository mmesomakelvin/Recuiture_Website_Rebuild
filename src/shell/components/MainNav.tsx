export interface NavigationItem {
  label: string
  href: string
  isActive?: boolean
}

interface MainNavProps {
  items: NavigationItem[]
  onNavigate?: (href: string) => void
  orientation?: 'horizontal' | 'vertical'
}

export function MainNav({ items, onNavigate, orientation = 'horizontal' }: MainNavProps) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault()
    onNavigate?.(href)
  }

  if (orientation === 'vertical') {
    return (
      <nav aria-label="Main" className="flex flex-col gap-1">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(event) => handleClick(event, item.href)}
            aria-current={item.isActive ? 'page' : undefined}
            className={
              item.isActive
                ? 'rounded-lg border-l-4 border-amber-400 bg-teal-50 px-4 py-3 text-base font-semibold text-teal-900 dark:bg-teal-950/60 dark:text-teal-100'
                : 'rounded-lg border-l-4 border-transparent px-4 py-3 text-base font-medium text-stone-700 transition-colors hover:bg-stone-100 hover:text-teal-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-teal-200'
            }
          >
            {item.label}
          </a>
        ))}
      </nav>
    )
  }

  return (
    <nav aria-label="Main" className="flex items-center gap-1">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          onClick={(event) => handleClick(event, item.href)}
          aria-current={item.isActive ? 'page' : undefined}
          className={
            item.isActive
              ? 'relative px-3 py-2 text-sm font-semibold text-teal-900 after:absolute after:inset-x-3 after:-bottom-[17px] after:h-[3px] after:rounded-full after:bg-amber-400 dark:text-teal-200'
              : 'px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:text-teal-800 dark:text-stone-300 dark:hover:text-teal-200'
          }
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}
