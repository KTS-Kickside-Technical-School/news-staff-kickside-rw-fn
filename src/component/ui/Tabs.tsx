import React, { createContext } from 'react';

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

export const TabsContext = createContext<TabsContextType | undefined>(
  undefined
);

interface TabsProps {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  children,
  value,
  onValueChange,
  className = '',
}) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export default Tabs;
