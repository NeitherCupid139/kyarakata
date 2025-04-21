import { cn } from '../../lib/utils';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  icon?: React.ReactNode;
}

function Card({ title, children, className, footer, icon }: CardProps) {
  return (
    <div className={cn(
      'card-retro',
      className
    )}>
      {(title || icon) && (
        <div className="px-4 py-5 sm:px-6 flex items-center border-b border-terminal-green">
          {icon && (
            <div className="mr-3 flex-shrink-0 terminal-text">{icon}</div>
          )}
          {title && (
            <h3 className="text-lg ascii-title">
              {title}
            </h3>
          )}
        </div>
      )}
      
      <div className="px-4 py-5 sm:p-6 terminal-text">{children}</div>
      
      {footer && (
        <div className="px-4 py-4 sm:px-6 border-t border-terminal-green">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;