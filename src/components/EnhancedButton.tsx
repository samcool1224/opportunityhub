import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface EnhancedButtonProps {
  children: ReactNode;
  variant?: 'hero' | 'outline-hero' | 'glass' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const EnhancedButton = ({
  children,
  variant = 'hero',
  size = 'md',
  className,
  ...props
}: EnhancedButtonProps) => {
  const variants = {
    hero: 'btn-hero',
    'outline-hero': 'btn-outline-hero',
    glass: 'glass rounded-xl px-6 py-3 font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300',
    gradient: 'bg-gradient-hero text-primary-foreground rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-orange-500/25'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <Button
      className={cn(variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Button>
  );
};