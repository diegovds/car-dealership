import { Car } from 'lucide-react'

const SIZE_MAP = {
  sm: { icon: 20, text: 'text-[8px]', gap: 'gap-1', animate: true },
  md: { icon: 36, text: 'text-[10px]', gap: 'gap-2', animate: true },
  lg: { icon: 72, text: 'text-xs', gap: 'gap-3', animate: true },
} as const

interface CarImagePlaceholderProps {
  size?: keyof typeof SIZE_MAP
}

export function CarImagePlaceholder({ size = 'md' }: CarImagePlaceholderProps) {
  const { icon, text, gap, animate } = SIZE_MAP[size]

  return (
    <div
      className={`text-muted-foreground/30 flex h-full flex-col items-center justify-center ${gap}`}
    >
      <span className={animate ? 'animate-float' : undefined}>
        <Car
          size={icon}
          strokeWidth={0}
          className="text-muted-foreground/20 fill-current"
        />
      </span>
      <p className={`${text} tracking-widest uppercase`}>Sem imagem</p>
    </div>
  )
}
