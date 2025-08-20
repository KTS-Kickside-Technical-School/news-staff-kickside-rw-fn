import React from 'react';

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${className}`}
    >
      {children}
    </div>
  );
};

export default TabsList;
