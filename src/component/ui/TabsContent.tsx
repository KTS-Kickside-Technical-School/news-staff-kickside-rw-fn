import React, { useContext } from 'react';
import { TabsContext } from './Tabs';

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className = '',
}) => {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }

  const { value: currentValue } = context;

  if (currentValue !== value) {
    return null;
  }

  return <div className={className}>{children}</div>;
};

export default TabsContent;
