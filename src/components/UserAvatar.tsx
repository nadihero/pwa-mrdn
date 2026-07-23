import {
  getUserAvatar,
  getUserDisplayName,
  getUserInitials,
} from '../lib/auth'
import { useAuth } from '../lib/use-auth'

export function UserAvatar({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const { user } = useAuth()
  const src = getUserAvatar(user)
  const initials = getUserInitials(user)
  const name = getUserDisplayName(user)

  const box =
    size === 'lg'
      ? 'h-16 w-16 text-2xl'
      : size === 'sm'
        ? 'h-9 w-9 text-xs'
        : 'h-10 w-10 text-sm'

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        referrerPolicy="no-referrer"
        className={`${box} shrink-0 rounded-sm object-cover shadow-soft ${className}`}
      />
    )
  }

  return (
    <div
      className={`${box} flex shrink-0 items-center justify-center rounded-sm bg-gradient-to-br from-[#6fe6cf] to-[#34a893] font-display font-bold text-[#08211c] shadow-soft ${className}`}
      aria-hidden
    >
      {initials}
    </div>
  )
}
