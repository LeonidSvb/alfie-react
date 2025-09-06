/**
 * Flow Feature - Быстрое тестирование inspire/plan флоуов с готовыми анкетами
 */

const { testRegistry, createFixture, createAction } = require('../registry.js');

// Готовые фикстуры для inspire flow
const inspireFixtures = [
  createFixture(
    'adventure-seeker',
    '🏔️ Adventure Seeker',
    {
      flowType: 'inspire-me',
      answers: {
        home_base: 'San Francisco',
        travel_radius: 'Medium flight (5–8 hrs)',
        regions_interest: ['Europe', 'Asia'],
        specific_regions: 'Iceland, Norway, Japan',
        terrain_prefs: ['Mountains', 'Winter / Snow'],
        setting_pref: 'Off the grid / remote',
        trip_structure: 'Single destination (one home base, can include day trips)',
        budget_style: '✨ Comfortable / Mid-range',
        season_window: 'Winter (Dec–Feb)',
        trip_length_days: '2 weeks+',
        lodging_style: ['Boutique / Guesthouse', 'B&B / Farm stay'],
        transport_pref: '🚗 Rental car / self-drive',
        party_type: 'Couple',
        fitness_level: 'High (long hikes, skiing, multi-day treks)',
        balance_ratio: '70% Outdoors / 30% Culture',
        outdoor_activities: ['Hiking', 'Skiing / Snowboarding', 'Scenic drives'],
        non_outdoor_interests: ['Historic & archaeological sites', 'Food experiences (cooking classes, food tours, wine/beer tastings)'],
        guided_experiences: ['Guided outdoor activities (hikes, climbs, paddles)'],
        food_prefs: ['Adventurous eats', 'Super local / traditional spots'],
        dealbreakers: 'No crowded tourist spots, avoid extreme heat',
        trip_feel: 'Epic adventure with authentic local experiences'
      }
    },
    ['winter', 'adventure', 'couple']
  ),

  createFixture(
    'luxury-traveler', 
    '💎 Luxury Beach Lover',
    {
      flowType: 'inspire-me',
      answers: {
        home_base: 'New York',
        travel_radius: 'Long haul — anywhere goes',
        regions_interest: ['Latin America (incl. Mexico / Central America)', 'Asia'],
        specific_regions: 'Maldives, Bali, Costa Rica',
        terrain_prefs: ['Ocean / Coastline', 'Beach'],
        setting_pref: 'Rural countryside',
        trip_structure: 'Single destination (one home base, can include day trips)',
        budget_style: '💎 Luxe',
        season_window: 'Spring (Mar–May)',
        trip_length_days: '1 week',
        lodging_style: ['Chain hotel or resort'],
        transport_pref: '🚐 Private transfers / guided transport',
        party_type: 'Couple',
        fitness_level: 'Low-key (short walks, light activity)',
        balance_ratio: '30% Outdoors / 70% Culture',
        outdoor_activities: ['Beaches & swimming', 'Water activities (kayak, paddle, snorkel)'],
        non_outdoor_interests: ['Spa / Wellness', 'Fine dining'],
        guided_experiences: ['Guided day trips', 'Food/wine tours, cooking classes'],
        food_prefs: ['Fine dining', 'Cooking classes'],
        dealbreakers: 'No backpacking, no hostels',
        trip_feel: 'Relaxing luxury with some cultural immersion'
      }
    },
    ['luxury', 'beach', 'relaxing']
  ),

  createFixture(
    'family-fun',
    '👨‍👩‍👧‍👦 Family Adventure',
    {
      flowType: 'inspire-me', 
      answers: {
        home_base: 'Chicago',
        travel_radius: 'Within driving distance',
        regions_interest: ['USA'],
        specific_regions: 'Colorado, Utah, Arizona',
        terrain_prefs: ['Mountains', 'Desert'],
        setting_pref: '❓ Open to a mix',
        trip_structure: 'Multi-destination (changing locations/lodging)',
        budget_style: '✨ Comfortable / Mid-range',
        season_window: 'Summer (Jun–Aug)',
        trip_length_days: '2 weeks+',
        lodging_style: ['RV / Campervan', 'Family-friendly resort'],
        transport_pref: '🚗 Rental car / self-drive',
        party_type: 'Family with kids 12–18',
        party_details: '4 people, summer vacation',
        fitness_level: 'Moderate (day hikes, biking, city walking)',
        balance_ratio: '50% Outdoors / 50% Culture',
        outdoor_activities: ['Hiking', 'Scenic drives', 'Family-friendly outdoor activities'],
        non_outdoor_interests: ['Historic & archaeological sites', 'Markets'],
        guided_experiences: ['Guided day trips'],
        food_prefs: ['Markets', 'Family-friendly restaurants'],
        dealbreakers: 'No extreme activities, keep driving under 4 hours per day',
        trip_feel: 'Educational fun for teens with awesome nature'
      }
    },
    ['family', 'usa', 'roadtrip']
  )
];

// Готовые фикстуры для plan flow
const planFixtures = [
  createFixture(
    'iceland-single',
    '🇮🇸 Iceland Base',
    {
      flowType: 'i-know-where',
      answers: {
        trip_structure: '🏠 Single destination (one home base, can include day trips)',
        destination_main: 'Reykjavik, Iceland',
        transport_mode: 'Rental car / Self‑drive',
        day_trips_interest: 'Yes',
        anchors_single: 'Blue Lagoon booking on day 3',
        season_window_shared: 'March 2025',
        trip_length_days_shared: '5 days',
        lodging_booked: 'No, I need recommendations',
        lodging_type: 'Boutique hotel / Guesthouse',
        lodging_budget: '$200-300/night',
        party_type_shared: 'Couple',
        fitness_level_shared: 'Moderate (day hikes, biking, city walking)',
        balance_ratio_shared: '70% Outdoors / 30% Culture',
        travel_style: 'Active Explorer',
        activities: ['🥾 Hiking', '🛣️ Scenic drives', '🏛️ Historic & archeological sites'],
        food_prefs_shared: ['Adventurous eats', 'Super local / traditional spots'],
        guided_prefs: ['Guided outdoor activities']
      }
    },
    ['iceland', 'single-destination', 'spring']
  ),

  createFixture(
    'italy-multi',
    '🇮🇹 Italy Multi-City',
    {
      flowType: 'i-know-where',
      answers: {
        trip_structure: '🧳 Multi‑destination (changing locations/lodging)',
        stops: 'Florence, Rome, Naples',
        intercity_transport: 'Train / Public transport',
        stops_order_flex: 'Flexible',
        anchors_multi: 'Vatican tour booked in Rome',
        season_window_shared: 'October 2025',
        trip_length_days_shared: '12 days',
        lodging_booked: 'No, I need recommendations',
        lodging_type: 'Boutique hotel / Guesthouse',
        lodging_budget: '$150-250/night',
        party_type_shared: 'Friends',
        fitness_level_shared: 'Moderate (day hikes, biking, city walking)',
        balance_ratio_shared: '30% Outdoors / 70% Culture',
        travel_style: 'Balanced Mix',
        activities: ['🚶 Walking tours', '🎨 Art & museums', '🏛️ Historic & archeological sites', '🍷 Wine / Breweries'],
        food_prefs_shared: ['Fine dining', 'Food tours', 'Cooking classes'],
        guided_prefs: ['Guided city tours', 'Food tours', 'Cooking classes']
      }
    },
    ['italy', 'multi-destination', 'culture']
  )
];

// Actions для тестирования
const flowActions = [
  createAction(
    'test-inspire-flow',
    '🌟 Test Inspire Flow',
    async (ctx) => {
      const startTime = Date.now();
      
      try {
        // Получаем данные из фикстуры или используем дефолтные
        const testData = ctx.selectedFixture?.data || inspireFixtures[0].data;
        
        ctx.logger.info('flow-testing', 'inspire_test_started', {
          fixtureId: ctx.selectedFixture?.id || 'default',
          answersCount: Object.keys(testData.answers).length
        });

        // Вызываем API генерации трип-гида
        const response = await fetch('/api/generate-trip-guide', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...testData,
            __testMode: true
          }),
        });

        const result = await response.json();
        const executionTime = Date.now() - startTime;

        if (!response.ok || !result.success) {
          throw new Error(result.error || `API Error (${response.status})`);
        }

        ctx.logger.info('flow-testing', 'inspire_test_completed', {
          success: true,
          executionTime,
          guideId: result.guide?.id,
          guideLength: result.guide?.content?.length || 0
        });

        return {
          success: true,
          data: {
            type: 'trip-guide',
            guide: result.guide,
            summary: {
              title: result.guide.title,
              tags: result.guide.tags,
              contentLength: result.guide.content.length,
              flowType: result.guide.flowType
            }
          },
          executionTime,
          timestamp: new Date()
        };

      } catch (error) {
        const executionTime = Date.now() - startTime;
        
        ctx.logger.error('flow-testing', 'inspire_test_failed', {
          error: error.message,
          executionTime
        });

        return {
          success: false,
          error: error.message,
          executionTime,
          timestamp: new Date()
        };
      }
    },
    'Тестирует полный inspire-me флоу с генерацией трип-гида'
  ),

  createAction(
    'test-plan-flow',
    '🗺️ Test Plan Flow', 
    async (ctx) => {
      const startTime = Date.now();
      
      try {
        // Получаем данные из фикстуры или используем дефолтные
        const testData = ctx.selectedFixture?.data || planFixtures[0].data;
        
        ctx.logger.info('flow-testing', 'plan_test_started', {
          fixtureId: ctx.selectedFixture?.id || 'default',
          answersCount: Object.keys(testData.answers).length,
          tripStructure: testData.answers.trip_structure
        });

        // Вызываем API генерации трип-гида
        const response = await fetch('/api/generate-trip-guide', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...testData,
            __testMode: true
          }),
        });

        const result = await response.json();
        const executionTime = Date.now() - startTime;

        if (!response.ok || !result.success) {
          throw new Error(result.error || `API Error (${response.status})`);
        }

        ctx.logger.info('flow-testing', 'plan_test_completed', {
          success: true,
          executionTime,
          guideId: result.guide?.id,
          guideLength: result.guide?.content?.length || 0
        });

        return {
          success: true,
          data: {
            type: 'trip-guide',
            guide: result.guide,
            summary: {
              title: result.guide.title,
              tags: result.guide.tags,
              contentLength: result.guide.content.length,
              flowType: result.guide.flowType
            }
          },
          executionTime,
          timestamp: new Date()
        };

      } catch (error) {
        const executionTime = Date.now() - startTime;
        
        ctx.logger.error('flow-testing', 'plan_test_failed', {
          error: error.message,
          executionTime
        });

        return {
          success: false,
          error: error.message,
          executionTime,
          timestamp: new Date()
        };
      }
    },
    'Тестирует полный i-know-where флоу с генерацией трип-гида'
  ),

  createAction(
    'quick-inspire-test',
    '⚡ Quick Inspire Test',
    async (ctx) => {
      const startTime = Date.now();
      
      try {
        ctx.logger.info('flow-testing', 'quick_inspire_started', {});

        // Используем минимальные данные для быстрого теста
        const quickData = {
          flowType: 'inspire-me',
          answers: {
            home_base: 'San Francisco',
            travel_radius: 'Short flight (2–4 hrs)',
            regions_interest: ['USA'],
            terrain_prefs: ['Mountains'],
            setting_pref: 'Rural countryside',
            trip_structure: 'Single destination (one home base, can include day trips)',
            budget_style: '✨ Comfortable / Mid-range',
            season_window: 'Summer (Jun–Aug)',
            trip_length_days: '1 week',
            party_type: 'Solo',
            fitness_level: 'Moderate (day hikes, biking, city walking)',
            balance_ratio: '70% Outdoors / 30% Culture',
            outdoor_activities: ['Hiking'],
            non_outdoor_interests: ['Food experiences (cooking classes, food tours, wine/beer tastings)']
          }
        };

        const response = await fetch('/api/generate-trip-guide', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...quickData,
            __testMode: true
          }),
        });

        const result = await response.json();
        const executionTime = Date.now() - startTime;

        if (!response.ok || !result.success) {
          throw new Error(result.error || `API Error (${response.status})`);
        }

        return {
          success: true,
          data: {
            type: 'quick-test',
            message: '✅ Quick test successful!',
            guide: {
              title: result.guide.title,
              contentPreview: result.guide.content.substring(0, 200) + '...',
              tags: result.guide.tags.slice(0, 3)
            }
          },
          executionTime,
          timestamp: new Date()
        };

      } catch (error) {
        const executionTime = Date.now() - startTime;
        
        return {
          success: false,
          error: error.message,
          executionTime,
          timestamp: new Date()
        };
      }
    },
    'Быстрый тест с минимальными данными'
  )
];

// Регистрируем фичу
const flowFeature = {
  featureId: 'flow-testing',
  name: '🌟 Flow Testing',
  description: 'Test inspire-me and i-know-where flows with predefined questionnaires',
  actions: flowActions,
  fixtures: [...inspireFixtures, ...planFixtures],
  enabled: true
};

// Автоматически регистрируем при импорте
testRegistry.register(flowFeature);

module.exports = { flowFeature };