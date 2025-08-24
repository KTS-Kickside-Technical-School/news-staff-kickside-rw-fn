import React from 'react';

interface SeparatorProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

const Separator: React.FC<SeparatorProps> = ({
  className = '',
  orientation = 'horizontal',
}) => {
  return (
    <div
      className={
        orientation === 'horizontal'
          ? `h-px bg-gray-200 ${className}`
          : `w-px bg-gray-200 ${className}`
      }
    />
  );
};

export default Separator;
