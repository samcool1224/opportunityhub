import { cn } from '@/lib/utils';
import { ReactNode, HTMLAttributes } from 'react';

interface EnhancedCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'glass' | 'enhanced' | 'floating' | 'premium';
  className?: string;
  hover?: boolean;
}

export const EnhancedCard = ({
  children,
  variant = 'enhanced',
  className,
  hover = true,
  onClick,
  ...props
}: EnhancedCardProps) => {
  const variants = {
    glass: 'card-glass',
    enhanced: 'card-enhanced',
    floating: 'card-enhanced animate-float',
    premium: 'card-enhanced shadow-premium shadow-premium-hover'
  };

  return (
    <div
      className={cn(
        variants[variant],
        hover && 'cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};