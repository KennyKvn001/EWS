import { type ReactNode } from 'react';

export interface TabConfig {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface TabControllerProps {
  tabs: TabConfig[];
  defaultTab?: string;
  className?: string;
  onTabChange?: (tabId: string) => void;
}

