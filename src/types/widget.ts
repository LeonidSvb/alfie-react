export interface WidgetConfig {
  embedId: string;
  theme?: 'light' | 'dark';
  maxWidth?: number;
}

export interface WidgetContainerProps {
  config?: WidgetConfig;
  className?: string;
  children: React.ReactNode;
}