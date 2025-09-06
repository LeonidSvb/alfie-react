/**
 * ФАЗА 1: Тесты базовой инфраструктуры Test Mode
 * 5 критически важных тестов для проверки корректной работы
 */

// Мокаем React для серверной среды тестирования
const mockReact = {
  useEffect: jest.fn(),
  createElement: jest.fn((type, props, ...children) => ({ type, props, children }))
};

// Мокаем window для серверной среды
const mockWindow = {
  navigator: {
    userAgent: 'test-user-agent'
  }
};

// Подготавливаем глобальные моки
global.React = mockReact;
global.window = mockWindow;

describe('Phase 1: Basic Infrastructure Tests', () => {
  
  let testRegistry, createFixture, createAction;
  
  beforeAll(() => {
    // Динамически подгружаем модули после настройки моков
    const registryModule = require('../registry');
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
   * ТЕСТ 1: Проверка изоляции от production кода
   * Критически важно - убедиться что тест-режим не влияет на обычную работу
   */
  test('1. Test Mode Isolation - Normal mode должен работать без изменений', () => {
    const { TestModeWrapper } = require('../TestModeWrapper');
    
    // Проверяем что без TestMod=1 возвращается только children
    const mockChildren = '<div>Normal Widget</div>';
    
    const result = TestModeWrapper({ 
      children: mockChildren, 
      searchParams: {} // Обычный режим
    });
    
    // В обычном режиме должен вернуться только mockChildren
    expect(result).toBe(mockChildren);
  });

  /**
   * ТЕСТ 2: Активация тест-режима
   * Проверяем что TestMod=1 корректно активирует test mode
   */
  test('2. Test Mode Activation - TestMod=1 должен активировать тест-режим', () => {
    const { TestModeWrapper } = require('../TestModeWrapper');
    
    const mockChildren = '<div>Widget</div>';
    
    const result = TestModeWrapper({ 
      children: mockChildren, 
      searchParams: { TestMod: '1' } // Тест-режим
    });
    
    // В тест-режиме должна быть обертка с классом test-mode-environment
    expect(result.props.className).toBe('test-mode-environment');
    expect(result.props.children).toBeDefined();
  });

  /**
   * ТЕСТ 3: Test Registry - регистрация и получение фич
   * Проверяем что система регистрации работает корректно
   */
  test('3. Test Registry - Регистрация и получение features должно работать', async () => {
    const mockFeature = {
      featureId: 'test-feature',
      name: 'Test Feature',
      actions: [
        createAction('test-action', 'Test Action', async () => ({ success: true, data: 'test', executionTime: 100, timestamp: new Date() }))
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
   * ТЕСТ 4: Data Sanitization - маскировка PII данных
   * Критически важно для безопасности - проверяем что emails маскируются
   */
  test('4. Data Sanitization - Email адреса должны маскироваться в логах', () => {
    const logger = testRegistry.getLogger();
    
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
   * ТЕСТ 5: Error Handling - валидация и обработка ошибок
   * Проверяем что система корректно обрабатывает некорректные данные
   */
  test('5. Error Handling - Некорректные features должны вызывать ошибки', () => {
    // Тест 5.1: Feature без featureId
    expect(() => {
      testRegistry.register({
        name: 'Invalid Feature',
        actions: [createAction('test', 'Test', async () => ({ success: true, executionTime: 0, timestamp: new Date() }))]
      });
    }).toThrow('Feature must have featureId and name');

    // Тест 5.2: Feature без actions
    expect(() => {
      testRegistry.register({
        featureId: 'invalid',
        name: 'Invalid Feature',
        actions: []
      });
    }).toThrow('Feature must have at least one action');

    // Тест 5.3: Action без run function
    expect(() => {
      testRegistry.register({
        featureId: 'invalid-action',
        name: 'Invalid Action Feature',
        actions: [{ id: 'test', label: 'Test' }] // Нет run function
      });
    }).toThrow('Each action must have id, label, and run function');
  });

});

/**
 * ДОПОЛНИТЕЛЬНЫЕ INTEGRATION ТЕСТЫ
 */
describe('Phase 1: Integration Tests', () => {
  
  beforeEach(() => {
    testRegistry.clear();
  });

  test('Integration: Registry + Logger работают вместе', () => {
    const feature = {
      featureId: 'integration-test',
      name: 'Integration Test',
      actions: [createAction('action1', 'Action 1', async () => ({ success: true, executionTime: 0, timestamp: new Date() }))]
    };

    testRegistry.register(feature);
    
    const logger = testRegistry.getLogger();
    const logs = logger.getLogs();
    
    // Должен быть лог о регистрации фичи
    expect(logs.some(log => log.event === 'feature_registered')).toBe(true);
  });

});

// Экспортируем для использования в других тестах (CommonJS)
module.exports = { testRegistry, createFixture, createAction };