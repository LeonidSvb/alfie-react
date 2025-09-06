import { TestFeature, TestLogger, TestLogEntry } from './types';

class TestRegistry {
  private features = new Map<string, TestFeature>();
  private logger: TestLogger;

  constructor() {
    this.logger = this.createLogger();
  }

  private createLogger(): TestLogger {
    const logs: TestLogEntry[] = [];

    const createLogEntry = (
      level: 'info' | 'warn' | 'error' | 'debug',
      scope: string,
      event: string,
      data?: any,
      message?: string
    ): TestLogEntry => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      level,
      scope,
      event,
      data: this.sanitizeData(data),
      message
    });

    return {
      info: (scope, event, data, message) => {
        logs.push(createLogEntry('info', scope, event, data, message));
      },
      warn: (scope, event, data, message) => {
        logs.push(createLogEntry('warn', scope, event, data, message));
        console.warn(`[TestMode:${scope}] ${event}`, data || message);
      },
      error: (scope, event, data, message) => {
        logs.push(createLogEntry('error', scope, event, data, message));
        console.error(`[TestMode:${scope}] ${event}`, data || message);
      },
      debug: (scope, event, data, message) => {
        logs.push(createLogEntry('debug', scope, event, data, message));
      },
      getLogs: () => [...logs],
      exportLogs: () => JSON.stringify(logs, null, 2),
      clear: () => {
        logs.length = 0;
      }
    };
  }

  private sanitizeData(data: any): any {
    if (!data) return data;
    
    const sanitized = JSON.parse(JSON.stringify(data));
    
    // Маскируем email адреса
    const maskEmail = (str: string): string => {
      return str.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, 
        (email) => {
          const [local, domain] = email.split('@');
          return `${local[0]}***@${domain}`;
        }
      );
    };

    // Рекурсивно обрабатываем объект
    const processValue = (value: any): any => {
      if (typeof value === 'string') {
        return maskEmail(value);
      }
      if (Array.isArray(value)) {
        return value.map(processValue);
      }
      if (typeof value === 'object' && value !== null) {
        const result: any = {};
        for (const [key, val] of Object.entries(value)) {
          result[key] = processValue(val);
        }
        return result;
      }
      return value;
    };

    return processValue(sanitized);
  }

  register(feature: TestFeature): void {
    if (this.features.has(feature.featureId)) {
      this.logger.warn('registry', 'feature_overwrite', { featureId: feature.featureId });
    }

    // Валидация фичи
    if (!feature.featureId || !feature.name) {
      this.logger.error('registry', 'invalid_feature', { feature });
      throw new Error('Feature must have featureId and name');
    }

    if (!feature.actions || feature.actions.length === 0) {
      this.logger.error('registry', 'no_actions', { featureId: feature.featureId });
      throw new Error('Feature must have at least one action');
    }

    // Валидация actions
    for (const action of feature.actions) {
      if (!action.id || !action.label || typeof action.run !== 'function') {
        this.logger.error('registry', 'invalid_action', { featureId: feature.featureId, action: action.id });
        throw new Error('Each action must have id, label, and run function');
      }
    }

    this.features.set(feature.featureId, feature);
    this.logger.info('registry', 'feature_registered', {
      featureId: feature.featureId,
      actionsCount: feature.actions.length,
      fixturesCount: feature.fixtures?.length || 0
    });
  }

  unregister(featureId: string): boolean {
    if (this.features.has(featureId)) {
      this.features.delete(featureId);
      this.logger.info('registry', 'feature_unregistered', { featureId });
      return true;
    }
    return false;
  }

  getFeature(featureId: string): TestFeature | undefined {
    return this.features.get(featureId);
  }

  getAllFeatures(): TestFeature[] {
    return Array.from(this.features.values()).filter(f => f.enabled !== false);
  }

  getFeatureIds(): string[] {
    return Array.from(this.features.keys());
  }

  getLogger(): TestLogger {
    return this.logger;
  }

  clear(): void {
    this.features.clear();
    this.logger.clear();
    this.logger.info('registry', 'cleared');
  }

  getStats() {
    const features = this.getAllFeatures();
    return {
      featuresCount: features.length,
      actionsCount: features.reduce((sum, f) => sum + f.actions.length, 0),
      fixturesCount: features.reduce((sum, f) => sum + (f.fixtures?.length || 0), 0),
      logsCount: this.logger.getLogs().length
    };
  }
}

// Глобальный экземпляр реестра
export const testRegistry = new TestRegistry();

// Хелпер для создания простых фикстур
export function createFixture(id: string, label: string, data: Record<string, any>, tags?: string[]) {
  return {
    id,
    label,
    data,
    tags
  };
}

// Хелпер для создания простых действий
export function createAction(
  id: string, 
  label: string, 
  runFn: (ctx: any) => Promise<any>,
  description?: string,
  requires?: any[]
) {
  return {
    id,
    label,
    description,
    run: runFn,
    requires
  };
}