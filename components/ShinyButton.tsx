import React from 'react';
import { cn } from '@/lib/utils';

type ShinyButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const ShinyButton = React.forwardRef<HTMLButtonElement, ShinyButtonProps>(
  ({ children, className, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn('shiny-cta group brand-font', className)}
        {...props}
      >
        <span className="shiny-cta__label">{children}</span>
      </button>
    );
  }
);

ShinyButton.displayName = 'ShinyButton';

export default ShinyButton;
