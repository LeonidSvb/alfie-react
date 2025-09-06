// Базовые типы для Test Mode системы

export interface TestContext {
  isTestMode: boolean;
  selectedFixture?: TestFixture;
  settings: TestSettings;
  logger: TestLogger;
}

export interface TestSettings {
  crmEnabled: boolean;
  gateEnabled: boolean;
  debugMode: boolean;
}

export interface TestResult {
  success: boolean;
  data?: any;
  error?: string;
  warnings?: string[];
  executionTime: number;
  timestamp: Date;
}

export interface TestAction {
  id: string;
  label: string;
  description?: string;
  run: (ctx: TestContext) => Promise<TestResult>;
  requires?: TestRequirement[];
}

export interface TestRequirement {
  type: 'fixture' | 'crm' | 'gate' | 'live';
  optional?: boolean;
}

export interface TestFixture {
  id: string;
  label: string;
  description?: string;
  data: Record<string, any>;
  tags?: string[];
}

export interface TestFeature {
  featureId: string;
  name: string;
  description?: string;
  actions: TestAction[];
  fixtures?: TestFixture[];
  enabled?: boolean;
}

export interface TestLogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  scope: string;
  event: string;
  data?: any;
  message?: string;
}

export interface TestLogger {
  info: (scope: string, event: string, data?: any, message?: string) => void;
  warn: (scope: string, event: string, data?: any, message?: string) => void;
  error: (scope: string, event: string, data?: any, message?: string) => void;
  debug: (scope: string, event: string, data?: any, message?: string) => void;
  getLogs: () => TestLogEntry[];
  exportLogs: () => string;
  clear: () => void;
}

export interface DevPanelState {
  selectedFeature?: string;
  selectedAction?: string;
  selectedFixture?: string;
  isRunning: boolean;
  lastResult?: TestResult;
  logs: TestLogEntry[];
  settings: TestSettings;
}