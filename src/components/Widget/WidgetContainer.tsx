'use client';

import React, { useEffect, useState } from 'react';
import { WidgetContainerProps } from '@/types/widget';
import { isInIframe, getEmbedConfig, debugLog } from '@/lib/embedUtils';

export default function WidgetContainer({ 
  config, 
  className = '', 
  children 
}: WidgetContainerProps): JSX.Element {
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [embedConfig, setEmbedConfig] = useState(getEmbedConfig());

  useEffect(() => {
    const embedded = isInIframe();
    setIsEmbedded(embedded);
    
    if (embedded) {
      const config = getEmbedConfig();
      setEmbedConfig(config);
      debugLog('Widget container initialized in iframe', { config });
    }
  }, []);

  const containerClasses = [
    'alfie-widget',
    isEmbedded ? 'embedded-widget' : '',
    className
  ].filter(Boolean).join(' ');

  const containerStyle: React.CSSProperties = {};
  
  if (config?.maxWidth) {
    containerStyle.maxWidth = config.maxWidth;
    containerStyle.margin = '0 auto';
  }

  return (
    <div 
      className={containerClasses}
      style={containerStyle}
      data-widget-id={config?.embedId}
      data-theme={config?.theme || embedConfig.theme}
      data-embedded={isEmbedded.toString()}
    >
      {/* Debug indicator for embed mode */}
      {isEmbedded && embedConfig.debugMode && (
        <div className="embed-debug-indicator">
          Embedded: {embedConfig.parentDomain || 'unknown'}
        </div>
      )}
      
      <div className="alfie-embedded-chat">
        {children}
      </div>
    </div>
  );
}