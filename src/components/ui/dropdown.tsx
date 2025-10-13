'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropdownProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

export function Dropdown({ children, trigger, className, align = 'start' }: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    end: 'right-0',
  };

  const handleItemClick = () => {
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      
      {isOpen && (
        <div
          className={cn(
            'absolute top-full mt-1 z-50 min-w-[280px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg',
            alignmentClasses[align]
          )}
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { 
                onItemClick: handleItemClick 
              } as any);
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  onItemClick?: () => void;
}

export function DropdownItem({ children, onClick, className, onItemClick }: DropdownItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <div
      className={cn(
        'px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors',
        className
      )}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}

interface DropdownTriggerProps {
  children: React.ReactNode;
  className?: string;
  showChevron?: boolean;
}

export function DropdownTrigger({ children, className, showChevron = true }: DropdownTriggerProps) {
  return (
    <div className={cn('flex items-center justify-between gap-2', className)}>
      {children}
      {showChevron && <ChevronDown className="w-4 h-4 text-slate-500" />}
    </div>
  );
}
