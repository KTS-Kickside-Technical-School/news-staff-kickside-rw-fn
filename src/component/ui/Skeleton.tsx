import React from 'react';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave' | 'none';
  children?: React.ReactNode;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  style,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  children,
}) => {
  const combineClasses = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ');
  };

  const baseClasses = combineClasses(
    'bg-gray-200 rounded-md',
    variant === 'circular' ? 'rounded-full' : '',
    variant === 'rectangular' ? 'rounded-none' : '',
    animation === 'pulse' ? 'animate-pulse' : '',
    animation === 'wave' ? 'relative overflow-hidden' : '',
    className
  );

  const waveAnimation = animation === 'wave' && (
    <div
      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gray-100 to-transparent"
      style={{ animation: 'shimmer 2s infinite' }}
    />
  );

  const skeletonStyle: React.CSSProperties = {
    width,
    height,
    ...style,
  };

  if (children) {
    return (
      <span className={combineClasses('inline-block relative', className)}>
        {children}
        {animation !== 'none' && (
          <span
            className={combineClasses(
              'absolute inset-0 bg-gray-200 rounded-md',
              animation === 'pulse' ? 'animate-pulse' : '',
              animation === 'wave' ? 'overflow-hidden' : ''
            )}
          >
            {waveAnimation}
          </span>
        )}
      </span>
    );
  }

  return (
    <div className={baseClasses} style={skeletonStyle}>
      {waveAnimation}
    </div>
  );
};

// Additional skeleton components for common use cases
interface SkeletonTextProps {
  lines?: number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
  lineHeight?: number;
  spacing?: number;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 1,
  className = '',
  animation = 'pulse',
  lineHeight = 20,
  spacing = 8,
}) => {
  const combineClasses = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ');
  };

  return (
    <div className={combineClasses('space-y-2', className)}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          variant="text"
          animation={animation}
          height={lineHeight}
          style={{
            width: index === lines - 1 && lines > 1 ? '60%' : '100%',
            marginBottom: index < lines - 1 ? spacing : 0,
          }}
        />
      ))}
    </div>
  );
};

interface SkeletonAvatarProps {
  size?: number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = 40,
  className = '',
  animation = 'pulse',
}) => {
  return (
    <Skeleton
      variant="circular"
      animation={animation}
      width={size}
      height={size}
      className={className}
    />
  );
};

interface SkeletonButtonProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

export const SkeletonButton: React.FC<SkeletonButtonProps> = ({
  size = 'md',
  className = '',
  animation = 'pulse',
}) => {
  const combineClasses = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ');
  };

  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32',
  };

  return (
    <Skeleton
      variant="rectangular"
      animation={animation}
      className={combineClasses('rounded-lg', sizeClasses[size], className)}
    />
  );
};

interface SkeletonCardProps {
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
  hasImage?: boolean;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  className = '',
  animation = 'pulse',
  hasImage = true,
}) => {
  const combineClasses = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ');
  };

  return (
    <div
      className={combineClasses('p-4 border rounded-lg space-y-3', className)}
    >
      {hasImage && (
        <Skeleton
          variant="rectangular"
          animation={animation}
          className="h-40 w-full rounded-md"
        />
      )}
      <SkeletonText lines={2} animation={animation} />
      <div className="flex justify-between items-center">
        <Skeleton variant="text" animation={animation} width={60} height={20} />
        <SkeletonButton size="sm" animation={animation} />
      </div>
    </div>
  );
};

// CSS styles that should be added to your global CSS file
export const SkeletonStyles = () => (
  <style>
    {`
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
      
      @keyframes shimmer {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
      
      .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
    `}
  </style>
);

export default Skeleton;
