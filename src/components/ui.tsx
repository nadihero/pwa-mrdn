import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

export function GlassCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`glass shadow-card inner-edge rounded-lg p-5 ${className}`}
    >
      {children}
    </div>
  )
}

export function Chip({
  value,
  label,
  tone = 'default',
}: {
  value: string
  label: string
  tone?: 'default' | 'amber' | 'teal'
}) {
  const color =
    tone === 'amber'
      ? 'text-amber'
      : tone === 'teal'
        ? 'text-teal'
        : 'text-ink'
  return (
    <div className="glass shadow-soft inner-edge rounded-sm px-4 py-3.5">
      <div className={`font-mono text-xl font-semibold ${color}`}>{value}</div>
      <div className="mt-1 text-xs text-ink-dim">{label}</div>
    </div>
  )
}

export function SectionHeader({
  title,
  action,
}: {
  title: string
  action?: ReactNode
}) {
  return (
    <div className="mb-4 mt-8 flex items-center justify-between first:mt-0">
      <h2 className="font-display text-[17px] font-semibold">{title}</h2>
      {action}
    </div>
  )
}

export function MonoLabel({ children }: { children: ReactNode }) {
  return (
    <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">
      {children}
    </div>
  )
}

export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-ink-dim">{label}</span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-sm border border-white/5 bg-white/[0.04] px-3.5 py-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-amber/40 focus:ring-1 focus:ring-amber/30'

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ''}`} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`${inputClass} ${props.className ?? ''}`}
    />
  )
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={`${inputClass} min-h-[80px] resize-y ${props.className ?? ''}`}
    />
  )
}

export function Btn({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger'
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50'
  const styles =
    variant === 'primary'
      ? 'bg-gradient-to-br from-[#ffa168] to-amber text-[#1a0f07] shadow-fab'
      : variant === 'danger'
        ? 'bg-red-500/15 text-red-300 hover:bg-red-500/25'
        : 'glass text-ink-dim hover:text-ink'
  return (
    <button
      type={props.type ?? 'button'}
      {...props}
      className={`${base} ${styles} ${className}`}
    />
  )
}

export function EmptyState({
  icon,
  title,
  desc,
}: {
  icon: ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="glass shadow-soft inner-edge flex flex-col items-center rounded-md px-6 py-10 text-center">
      <div className="mb-3 text-3xl text-ink-faint">{icon}</div>
      <p className="font-display font-semibold">{title}</p>
      <p className="mt-1 text-sm text-ink-dim">{desc}</p>
    </div>
  )
}

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(5,6,7,0.65)] backdrop-blur-[2px]"
        aria-label="Tutup"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-lg border border-white/5 bg-[#12151a] p-5 shadow-drawer sm:rounded-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="glass flex h-9 w-9 items-center justify-center rounded-[10px] text-ink-dim"
            aria-label="Tutup"
          >
            <i className="iconoir-xmark text-base" aria-hidden />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Pill({
  children,
  tone = 'teal',
}: {
  children: ReactNode
  tone?: 'teal' | 'amber' | 'idle' | 'danger'
}) {
  const cls =
    tone === 'amber'
      ? 'bg-[rgba(255,138,76,0.14)] text-amber'
      : tone === 'idle'
        ? 'bg-[rgba(154,164,173,0.12)] text-ink-dim'
        : tone === 'danger'
          ? 'bg-red-500/15 text-red-300'
          : 'bg-[rgba(79,220,192,0.12)] text-teal'
  return (
    <span
      className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold ${cls}`}
    >
      {children}
    </span>
  )
}
