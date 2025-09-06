/**
 * ФАЗА 1: Упрощенные тесты базовой инфраструктуры Test Mode
 * 5 критически важных тестов для проверки корректной работы (без React)
 */

describe('Phase 1: Basic Infrastructure Tests', () => {
  
  let testRegistry, createFixture, createAction;
  
  beforeAll(() => {
    // Подгружаем модули
    const registryModule = require('../registry.js');
    testRegistry = registryModule.testRegistry;
    createFixture = registryModule.createFixture;
    createAction = registryModule.createAction;
  });
  
  beforeEach(() => {
    if (testRegistry && testRegistry.clear) {
      testRegistry.clear();
    }
    jest.clearAllMocks();
  });

  /**
   * ТЕСТ 1: Test Registry - базовая функциональность
   * Проверяем что система регистрации работает корректно
   */
  test('1. Test Registry - Basic functionality должен работать', async () => {
    const mockFeature = {
      featureId: 'test-feature',
      name: 'Test Feature',
      actions: [
        createAction('test-action', 'Test Action', async () => ({ 
          success: true, 
          data: 'test', 
          executionTime: 100, 
          timestamp: new Date() 
        }))
      ],
      fixtures: [
        createFixture('test-fixture', 'Test Fixture', { testData: 'value' })
      ]
    };

    // Регистрируем фичу
    testRegistry.register(mockFeature);

    // Проверяем что фича зарегистрировалась
    const registeredFeature = testRegistry.getFeature('test-feature');
    expect(registeredFeature).toBeDefined();
    expect(registeredFeature.name).toBe('Test Feature');
    
    // Проверяем статистику
    const stats = testRegistry.getStats();
    expect(stats.featuresCount).toBe(1);
    expect(stats.actionsCount).toBe(1);
    expect(stats.fixturesCount).toBe(1);
  });

  /**
   * ТЕСТ 2: Data Sanitization - маскировка PII данных
   * Критически важно для безопасности - проверяем что emails маскируются
   */
  test('2. Data Sanitization - Email адреса должны маскироваться в логах', () => {
    const logger = testRegistry.getLogger();
    
    // Очищаем логи перед тестом
    logger.clear();
    
    const testData = {
      userEmail: 'test@example.com',
      userName: 'Test User',
      emails: ['user1@test.com', 'user2@test.com'],
      nested: {
        email: 'nested@example.com'
      }
    };

    logger.info('test-scope', 'test-event', testData);
    
    const logs = logger.getLogs();
    expect(logs).toHaveLength(1);
    
    const logEntry = logs[0];
    
    // Проверяем что emails замаскированы
    expect(logEntry.data.userEmail).toBe('t***@example.com');
    expect(logEntry.data.emails[0]).toBe('u***@test.com');
    expect(logEntry.data.nested.email).toBe('n***@example.com');
    
    // Проверяем что другие данные не изменились
    expect(logEntry.data.userName).toBe('Test User');
  });

  /**
   * ТЕСТ 3: Error Handling - валидация фич
   * Проверяем что система корректно обрабатывает некорректные данные
   */
  test('3. Error Handling - Некорректные features должны вызывать ошибки', () => {
    // Тест 3.1: Feature без featureId
    expect(() => {
      testRegistry.register({
        name: 'Invalid Feature',
        actions: [createAction('test', 'Test', async () => ({ 
          success: true, 
          executionTime: 0, 
          timestamp: new Date() 
        }))]
      });
    }).toThrow('Feature must have featureId and name');

    // Тест 3.2: Feature без actions
    expect(() => {
      testRegistry.register({
        featureId: 'invalid',
        name: 'Invalid Feature',
        actions: []
      });
    }).toThrow('Feature must have at least one action');

    // Тест 3.3: Action без run function
    expect(() => {
      testRegistry.register({
        featureId: 'invalid-action',
        name: 'Invalid Action Feature',
        actions: [{ id: 'test', label: 'Test' }] // Нет run function
      });
    }).toThrow('Each action must have id, label, and run function');
  });

  /**
   * ТЕСТ 4: Logger functionality - система логирования
   * Проверяем что логирование работает корректно
   */
  test('4. Logger Functionality - Логирование должно работать корректно', () => {
    const logger = testRegistry.getLogger();
    
    // Очищаем логи перед тестом
    logger.clear();
    
    // Тест различных уровней логирования
    logger.info('test', 'info-event', { data: 'info' });
    logger.warn('test', 'warn-event', { data: 'warn' });
    logger.error('test', 'error-event', { data: 'error' });
    logger.debug('test', 'debug-event', { data: 'debug' });
    
    const logs = logger.getLogs();
    expect(logs).toHaveLength(4);
    
    // Проверяем структуру логов
    logs.forEach(log => {
      expect(log.id).toBeDefined();
      expect(log.timestamp).toBeInstanceOf(Date);
      expect(log.level).toBeDefined();
      expect(log.scope).toBe('test');
      expect(log.event).toBeDefined();
    });
    
    // Проверяем экспорт логов
    const exported = logger.exportLogs();
    expect(typeof exported).toBe('string');
    expect(() => JSON.parse(exported)).not.toThrow();
  });

  /**
   * ТЕСТ 5: Registry Management - управление фичами
   * Проверяем регистрацию/удаление фич и статистику
   */
  test('5. Registry Management - Управление features должно работать', () => {
    // Регистрируем несколько фич
    const feature1 = {
      featureId: 'feature-1',
      name: 'Feature 1',
      actions: [createAction('action1', 'Action 1', async () => ({ success: true, executionTime: 0, timestamp: new Date() }))]
    };
    
    const feature2 = {
      featureId: 'feature-2',
      name: 'Feature 2',
      actions: [
        createAction('action2a', 'Action 2A', async () => ({ success: true, executionTime: 0, timestamp: new Date() })),
        createAction('action2b', 'Action 2B', async () => ({ success: true, executionTime: 0, timestamp: new Date() }))
      ],
      fixtures: [
        createFixture('fixture2', 'Fixture 2', { test: 'data' })
      ]
    };

    testRegistry.register(feature1);
    testRegistry.register(feature2);

    // Проверяем статистику
    const stats = testRegistry.getStats();
    expect(stats.featuresCount).toBe(2);
    expect(stats.actionsCount).toBe(3);
    expect(stats.fixturesCount).toBe(1);

    // Проверяем получение всех фич
    const allFeatures = testRegistry.getAllFeatures();
    expect(allFeatures).toHaveLength(2);

    // Проверяем удаление фичи
    const removed = testRegistry.unregister('feature-1');
    expect(removed).toBe(true);
    
    const statsAfterRemoval = testRegistry.getStats();
    expect(statsAfterRemoval.featuresCount).toBe(1);
    
    // Попытка удалить несуществующую фичу
    const notRemoved = testRegistry.unregister('non-existent');
    expect(notRemoved).toBe(false);
  });

});

describe('Phase 1: Helper Functions Tests', () => {
  
  let createFixture, createAction;
  
  beforeAll(() => {
    const registryModule = require('../registry.js');
    createFixture = registryModule.createFixture;
    createAction = registryModule.createAction;
  });

  test('createFixture helper должен работать корректно', () => {
    const fixture = createFixture('test-id', 'Test Label', { data: 'value' }, ['tag1', 'tag2']);
    
    expect(fixture.id).toBe('test-id');
    expect(fixture.label).toBe('Test Label');
    expect(fixture.data).toEqual({ data: 'value' });
    expect(fixture.tags).toEqual(['tag1', 'tag2']);
  });

  test('createAction helper должен работать корректно', () => {
    const mockRun = jest.fn();
    const action = createAction('action-id', 'Action Label', mockRun, 'Description');
    
    expect(action.id).toBe('action-id');
    expect(action.label).toBe('Action Label');
    expect(action.description).toBe('Description');
    expect(action.run).toBe(mockRun);
  });
  
});

// Экспортируем для использования в других тестах (CommonJS)
module.exports = { testRegistry: null, createFixture: null, createAction: null };