/**
 * Test Registry - Система управления тест-фичами (JavaScript version)
 */

class TestRegistry {
  constructor() {
    this.features = new Map();
    this.logger = this.createLogger();
  }

  createLogger() {
    const logs = [];

    const createLogEntry = (level, scope, event, data, message) => ({
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

  sanitizeData(data) {
    if (!data) return data;
    
    const sanitized = JSON.parse(JSON.stringify(data));
    
    // Маскируем email адреса
    const maskEmail = (str) => {
      return str.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, 
        (email) => {
          const [local, domain] = email.split('@');
          return `${local[0]}***@${domain}`;
        }
      );
    };

    // Рекурсивно обрабатываем объект
    const processValue = (value) => {
      if (typeof value === 'string') {
        return maskEmail(value);
      }
      if (Array.isArray(value)) {
        return value.map(processValue);
      }
      if (typeof value === 'object' && value !== null) {
        const result = {};
        for (const [key, val] of Object.entries(value)) {
          result[key] = processValue(val);
        }
        return result;
      }
      return value;
    };

    return processValue(sanitized);
  }

  register(feature) {
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

  unregister(featureId) {
    if (this.features.has(featureId)) {
      this.features.delete(featureId);
      this.logger.info('registry', 'feature_unregistered', { featureId });
      return true;
    }
    return false;
  }

  getFeature(featureId) {
    return this.features.get(featureId);
  }

  getAllFeatures() {
    return Array.from(this.features.values()).filter(f => f.enabled !== false);
  }

  getFeatureIds() {
    return Array.from(this.features.keys());
  }

  getLogger() {
    return this.logger;
  }

  clear() {
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
const testRegistry = new TestRegistry();

// Хелпер для создания простых фикстур
function createFixture(id, label, data, tags) {
  return {
    id,
    label,
    data,
    tags
  };
}

// Хелпер для создания простых действий
function createAction(id, label, runFn, description, requires) {
  return {
    id,
    label,
    description,
    run: runFn,
    requires
  };
}

module.exports = {
  testRegistry,
  createFixture,
  createAction,
  TestRegistry
};