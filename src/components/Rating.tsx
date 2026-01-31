import { useState, useCallback } from 'react';
import { cn } from '@/utils/cn';

export type IconType = 'star' | 'heart' | 'fire' | 'thumb' | 'diamond' | 'rocket';

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  allowHalf?: boolean;
  icon?: IconType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  disabled?: boolean;
  readOnly?: boolean;
  showValue?: boolean;
  animated?: boolean;
  label?: string;
}

const icons: Record<IconType, { filled: React.ReactNode; empty: React.ReactNode; half?: React.ReactNode }> = {
  star: {
    filled: (
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    ),
    empty: (
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="1.5" fill="none" />
    ),
  },
  heart: {
    filled: (
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    ),
    empty: (
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="1.5" fill="none" />
    ),
  },
  fire: {
    filled: (
      <path d="M12 23c-4.97 0-9-3.58-9-8 0-2.52 1.17-5.23 3.5-8.14a.5.5 0 0 1 .84.12c.67 1.86 1.8 3.02 3.16 3.02.9 0 1.68-.78 2-1.5.38-.86.5-2.5-.5-5-.14-.35.25-.68.56-.47C16.28 5.82 21 10.22 21 15c0 4.42-4.03 8-9 8z" />
    ),
    empty: (
      <path d="M12 23c-4.97 0-9-3.58-9-8 0-2.52 1.17-5.23 3.5-8.14a.5.5 0 0 1 .84.12c.67 1.86 1.8 3.02 3.16 3.02.9 0 1.68-.78 2-1.5.38-.86.5-2.5-.5-5-.14-.35.25-.68.56-.47C16.28 5.82 21 10.22 21 15c0 4.42-4.03 8-9 8z" strokeWidth="1.5" fill="none" />
    ),
  },
  thumb: {
    filled: (
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    ),
    empty: (
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" strokeWidth="1.5" fill="none" />
    ),
  },
  diamond: {
    filled: (
      <path d="M2.7 10.3a1 1 0 0 0 0 1.4l8.9 8.9a1 1 0 0 0 1.4 0l8.9-8.9a1 1 0 0 0 0-1.4l-8.9-8.9a1 1 0 0 0-1.4 0l-8.9 8.9z" />
    ),
    empty: (
      <path d="M2.7 10.3a1 1 0 0 0 0 1.4l8.9 8.9a1 1 0 0 0 1.4 0l8.9-8.9a1 1 0 0 0 0-1.4l-8.9-8.9a1 1 0 0 0-1.4 0l-8.9 8.9z" strokeWidth="1.5" fill="none" />
    ),
  },
  rocket: {
    filled: (
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0 M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    ),
    empty: (
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0 M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" strokeWidth="1.5" fill="none" />
    ),
  },
};

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-7 h-7',
  lg: 'w-9 h-9',
  xl: 'w-12 h-12',
};

const colorClasses: Record<string, { filled: string; empty: string }> = {
  yellow: { filled: 'fill-yellow-400 stroke-yellow-500', empty: 'stroke-yellow-400' },
  red: { filled: 'fill-red-500 stroke-red-600', empty: 'stroke-red-400' },
  orange: { filled: 'fill-orange-500 stroke-orange-600', empty: 'stroke-orange-400' },
  blue: { filled: 'fill-blue-500 stroke-blue-600', empty: 'stroke-blue-400' },
  purple: { filled: 'fill-purple-500 stroke-purple-600', empty: 'stroke-purple-400' },
  pink: { filled: 'fill-pink-500 stroke-pink-600', empty: 'stroke-pink-400' },
  green: { filled: 'fill-green-500 stroke-green-600', empty: 'stroke-green-400' },
  cyan: { filled: 'fill-cyan-500 stroke-cyan-600', empty: 'stroke-cyan-400' },
};

export function Rating({
  value,
  onChange,
  max = 5,
  allowHalf = false,
  icon = 'star',
  size = 'md',
  color = 'yellow',
  disabled = false,
  readOnly = false,
  showValue = false,
  animated = true,
  label,
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState<number | null>(null);

  const displayValue = hoverValue !== null ? hoverValue : value;
  const colorClass = colorClasses[color] || colorClasses.yellow;

  const handleClick = useCallback((newValue: number) => {
    if (disabled || readOnly) return;
    
    setIsAnimating(newValue);
    onChange?.(newValue);
    
    // Clear animation after it completes
    setTimeout(() => setIsAnimating(null), 600);
  }, [disabled, readOnly, onChange]);

  const handleMouseMove = useCallback((index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || readOnly) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const isFirstHalf = x < rect.width / 2;
    
    if (allowHalf && isFirstHalf) {
      setHoverValue(index + 0.5);
    } else {
      setHoverValue(index + 1);
    }
  }, [disabled, readOnly, allowHalf]);

  const handleMouseLeave = useCallback(() => {
    setHoverValue(null);
  }, []);

  const renderIcon = (index: number) => {
    const fillAmount = Math.max(0, Math.min(1, displayValue - index));
    const isHalf = fillAmount > 0 && fillAmount < 1;
    const isSelected = isAnimating !== null && index < isAnimating;

    return (
      <button
        key={index}
        type="button"
        className={cn(
          'relative focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded transition-transform',
          !disabled && !readOnly && 'cursor-pointer hover:scale-110',
          disabled && 'cursor-not-allowed opacity-50',
          readOnly && 'cursor-default',
          animated && isSelected && 'animate-bounce'
        )}
        onClick={() => handleClick(index + 1)}
        onMouseMove={(e) => handleMouseMove(index, e)}
        onMouseLeave={handleMouseLeave}
        disabled={disabled}
        aria-label={`Rate ${index + 1} out of ${max}`}
      >
        <svg
          viewBox="0 0 24 24"
          className={cn(
            sizeClasses[size],
            'transition-all duration-200',
            animated && 'transform-gpu',
            isSelected && animated && 'scale-125'
          )}
          stroke="currentColor"
        >
          {/* Background (empty) icon */}
          <g className={cn(colorClass.empty, 'transition-colors')}>
            {icons[icon].empty}
          </g>
          
          {/* Filled overlay with clip path for half-star support */}
          {fillAmount > 0 && (
            <g 
              className={cn(
                colorClass.filled, 
                'transition-all duration-200',
                isSelected && animated && 'drop-shadow-lg'
              )}
              style={{
                clipPath: isHalf ? 'inset(0 50% 0 0)' : undefined
              }}
            >
              {icons[icon].filled}
            </g>
          )}
        </svg>
        
        {/* Sparkle effect on selection */}
        {animated && isSelected && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 w-1 h-1 bg-yellow-300 rounded-full animate-ping" />
            <div className="absolute bottom-0 right-0 w-1 h-1 bg-yellow-200 rounded-full animate-ping delay-100" />
            <div className="absolute top-1/2 left-0 w-1 h-1 bg-orange-300 rounded-full animate-ping delay-200" />
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}
      <div className="flex items-center gap-1">
        <div className="flex gap-0.5" role="group" aria-label="Rating">
          {Array.from({ length: max }, (_, i) => renderIcon(i))}
        </div>
        {showValue && (
          <span className={cn(
            'ml-2 font-semibold tabular-nums transition-all',
            size === 'sm' && 'text-sm',
            size === 'md' && 'text-base',
            size === 'lg' && 'text-lg',
            size === 'xl' && 'text-xl',
            hoverValue !== null ? 'text-gray-600' : 'text-gray-800'
          )}>
            {displayValue.toFixed(allowHalf ? 1 : 0)}
          </span>
        )}
      </div>
    </div>
  );
}
