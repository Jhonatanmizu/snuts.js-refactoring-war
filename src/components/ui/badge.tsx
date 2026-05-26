import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-snuts-text text-snuts-code hover:bg-snuts-text/80',
        secondary: 'border-transparent bg-snuts-surface text-snuts-text hover:bg-snuts-surface-2',
        destructive: 'border-transparent bg-snuts-destructive text-white hover:bg-snuts-destructive/80',
        outline: 'text-snuts-text',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
