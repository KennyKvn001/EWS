import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { type TabControllerProps } from '@/types/tab';

export function TabController({ 
  tabs, 
  defaultTab, 
  className,
  onTabChange 
}: TabControllerProps) {
  const firstTabId = tabs[0]?.id || '';
  const [activeTab, setActiveTab] = useState(defaultTab || firstTabId);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange?.(value);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className={className}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger 
            key={tab.id} 
            value={tab.id} 
            disabled={tab.disabled}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

