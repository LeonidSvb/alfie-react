export interface EmbedConfig {
  theme?: 'light' | 'dark';
  maxWidth?: number;
  parentDomain?: string;
  autoResize?: boolean;
  debugMode?: boolean;
}

export interface EmbedMessage {
  type: 'resize' | 'ready' | 'error' | 'interaction';
  data: {
    height?: number;
    width?: number;
    error?: string;
    event?: string;
  };
}

/**
 * Check if the current page is running inside an iframe
 */
export function isInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

/**
 * Get the current document height for iframe sizing
 */
export function getDocumentHeight(): number {
  return Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  );
}

/**
 * Send message to parent window (Webflow)
 */
export function postMessageToParent(message: EmbedMessage): void {
  if (!isInIframe()) return;
  
  try {
    window.parent.postMessage(message, '*');
  } catch (error) {
    console.error('Failed to send message to parent:', error);
  }
}

/**
 * Setup automatic iframe resizing based on content changes
 */
export function setupIframeResizing(): void {
  if (!isInIframe()) return;

  let lastHeight = 0;
  const minHeight = 300;
  const maxHeight = 2000;

  const updateHeight = () => {
    const currentHeight = getDocumentHeight();
    const clampedHeight = Math.max(minHeight, Math.min(maxHeight, currentHeight));
    
    if (Math.abs(clampedHeight - lastHeight) > 5) { // Only update if significant change
      lastHeight = clampedHeight;
      
      postMessageToParent({
        type: 'resize',
        data: { height: clampedHeight }
      });
    }
  };

  // Initial height
  updateHeight();

  // Watch for DOM changes
  const observer = new MutationObserver(() => {
    // Debounce the height update
    setTimeout(updateHeight, 100);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });

  // Watch for window resize
  window.addEventListener('resize', updateHeight);

  // Watch for dynamic content changes (questionnaire progression)
  document.addEventListener('DOMContentLoaded', updateHeight);
  
  // Custom event for manual height updates
  document.addEventListener('widget:content-changed', updateHeight);

  // Send ready signal
  postMessageToParent({
    type: 'ready',
    data: { height: lastHeight }
  });
}

/**
 * Get embed configuration from URL parameters
 */
export function getEmbedConfig(): EmbedConfig {
  if (typeof window === 'undefined') {
    return { autoResize: true };
  }

  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    theme: (urlParams.get('theme') as 'light' | 'dark') || 'light',
    maxWidth: urlParams.get('maxWidth') ? parseInt(urlParams.get('maxWidth')!) : undefined,
    parentDomain: document.referrer ? new URL(document.referrer).hostname : undefined,
    autoResize: urlParams.get('autoResize') !== 'false',
    debugMode: urlParams.get('debug') === 'true'
  };
}

/**
 * Trigger height recalculation (use this when content changes dynamically)
 */
export function triggerHeightUpdate(): void {
  const event = new CustomEvent('widget:content-changed');
  document.dispatchEvent(event);
}

/**
 * Log debug information if debug mode is enabled
 */
export function debugLog(message: string, data?: any): void {
  const config = getEmbedConfig();
  if (config.debugMode) {
    console.log(`[OutdoorableWidget] ${message}`, data);
  }
}