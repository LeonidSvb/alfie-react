'use client';

import React, { useState, useEffect } from 'react';

// MOCK DATA - полностью изолированные тестовые данные
const MOCK_TRIP_CONTENT = `🏔️ Mountain Adventure in Colorado

## 🎯 Trip Overview
Your perfect Colorado mountain adventure awaits! Based on your preferences for hiking and scenic views, I've crafted a 5-day itinerary that balances adventure with relaxation.

**Best Time to Visit:** September-October for fall colors
**Budget Range:** $800-1,200 per person
**Difficulty:** Moderate

## 🗓️ Day-by-Day Itinerary

### Day 1: Denver to Rocky Mountain National Park
- **Morning:** Pick up rental car in Denver ($45/day)
- **Afternoon:** Drive to Estes Park (1.5 hours)
- **Evening:** Check into Stanley Hotel ($180/night)
- **Dinner:** The Tavern Restaurant - elk burgers ($28)

### Day 2: Trail Ridge Road Adventure
- **6:00 AM:** Early start to beat crowds
- **Morning:** Drive Trail Ridge Road (3 hours with stops)
- **Lunch:** Alpine Visitor Center ($15)
- **Afternoon:** Bear Lake hike (easy, 0.8 miles)
- **Evening:** Sunset at Sprague Lake

### Day 3: Challenging Hike Day
- **7:00 AM:** Emerald Lake Trail (3.2 miles, moderate)
- **Lunch:** Pack trail lunch ($12)
- **Afternoon:** Rest and explore Estes Park
- **Evening:** Local brewery tour ($25)

### Day 4: Scenic Drive to Boulder
- **Morning:** Check out and drive to Boulder (1 hour)
- **Afternoon:** Flatirons hiking trail (2.4 miles)
- **Evening:** Pearl Street Mall dining ($40)
- **Stay:** Boulder Creek Quality Inn ($120/night)

### Day 5: Final Adventures
- **Morning:** Chautauqua Park easy walk
- **Afternoon:** Drive back to Denver
- **Evening:** Flight departure

## 🎒 Packing Essentials
- Layered clothing (temperatures vary 30-70°F)
- Waterproof hiking boots
- Sunscreen SPF 50+ (high altitude!)
- Water bottles (stay hydrated)
- Camera for stunning views

## 💰 Budget Breakdown
- **Accommodation:** $600 (2 nights)
- **Car Rental:** $225 (5 days)
- **Food & Dining:** $200
- **Activities:** $100
- **Gas:** $80
- **Total:** $1,205 per person

## 🌟 Local Insider Tips
- Download offline maps - cell service is spotty
- Start hikes early (parking fills up by 9 AM)
- Bring cash for park entrance fees
- Try the local green chile - it's everywhere!
- Check weather conditions daily

## 📍 Emergency Contacts
- Rocky Mountain National Park: (970) 586-1206
- Estes Park Medical Center: (970) 586-2317
- Road Conditions: Call 511

Have an amazing adventure! 🏔️✨`;

// Встроенные стили - не трогают основной CSS
const testStyles = `
  .test-enhanced-container {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    max-width: 800px;
    margin: 20px auto;
    background: #f8f9fa;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .test-enhanced-header {
    background: linear-gradient(135deg, #4A8B5C 0%, #2E4B3E 100%);
    color: white;
    padding: 24px;
    text-align: center;
  }

  .test-enhanced-navigation {
    background: white;
    padding: 16px 24px;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .test-nav-item {
    background: #f1f3f4;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
  }

  .test-nav-item:hover {
    background: #e8f5e8;
    color: #4A8B5C;
  }

  .test-nav-item.active {
    background: #4A8B5C;
    color: white;
  }

  .test-enhanced-content {
    background: white;
    padding: 32px;
    line-height: 1.7;
    max-height: 500px;
    overflow-y: auto;
  }

  .test-enhanced-content h1 {
    color: #2E4B3E;
    font-size: 28px;
    margin: 0 0 20px 0;
    border-bottom: 2px solid #4A8B5C;
    padding-bottom: 10px;
  }

  .test-enhanced-content h2 {
    color: #4A8B5C;
    font-size: 22px;
    margin: 32px 0 16px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .test-enhanced-content h3 {
    color: #2E4B3E;
    font-size: 18px;
    margin: 24px 0 12px 0;
  }

  .test-enhanced-content strong {
    color: #2E4B3E;
    font-weight: 600;
  }

  .test-enhanced-content ul {
    margin: 16px 0;
    padding-left: 20px;
  }

  .test-enhanced-content li {
    margin: 8px 0;
  }

  .test-price {
    background: #fff3cd;
    color: #856404;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 600;
  }

  .test-time {
    background: #d4edda;
    color: #155724;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 600;
  }

  .test-typing-animation {
    border-right: 2px solid #4A8B5C;
    animation: blink 1s infinite;
  }

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  .test-controls {
    padding: 16px 24px;
    background: #f8f9fa;
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .test-button {
    background: #4A8B5C;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s;
  }

  .test-button:hover {
    background: #3a6b47;
  }

  .test-button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

// Встроенный компонент - максимальная изоляция
const TestEnhancedResults: React.FC = () => {
  const [content, setContent] = useState('');
  const [sections, setSections] = useState<Array<{id: string, title: string, emoji: string}>>([]);
  const [activeSection, setActiveSection] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(50);

  // Парсинг контента в секции
  useEffect(() => {
    const lines = MOCK_TRIP_CONTENT.split('\n');
    const parsedSections: Array<{id: string, title: string, emoji: string}> = [];
    
    lines.forEach(line => {
      if (line.startsWith('## ')) {
        const title = line.replace('## ', '');
        const emoji = title.match(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u)?.[0] || '📋';
        const cleanTitle = title.replace(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic})\s*/u, '');
        const id = cleanTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        parsedSections.push({ id, title: cleanTitle, emoji });
      }
    });
    
    setSections(parsedSections);
    if (parsedSections.length > 0) {
      setActiveSection(parsedSections[0].id);
    }
  }, []);

  // Функция печатающей анимации
  const startTypingAnimation = () => {
    setContent('');
    setIsTyping(true);
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < MOCK_TRIP_CONTENT.length) {
        setContent(MOCK_TRIP_CONTENT.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, typingSpeed);
  };

  // Показать весь контент сразу
  const showFullContent = () => {
    setContent(MOCK_TRIP_CONTENT);
    setIsTyping(false);
  };

  // Сброс
  const resetContent = () => {
    setContent('');
    setIsTyping(false);
  };

  // Обработка цен и времени
  const highlightContent = (text: string) => {
    return text
      .replace(/\$\d+(?:\/[a-z]+)?/gi, '<span class="test-price">$&</span>')
      .replace(/\d{1,2}:\d{2}\s*(?:AM|PM)/gi, '<span class="test-time">$&</span>');
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: testStyles }} />
      <div className="test-enhanced-container">
        <div className="test-enhanced-header">
          <h1>🧪 Enhanced Results Test Page</h1>
          <p>Полностью изолированное тестирование новых результатов</p>
        </div>

        <div className="test-enhanced-navigation">
          {sections.map(section => (
            <button
              key={section.id}
              className={`test-nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.emoji} {section.title}
            </button>
          ))}
        </div>

        <div className="test-enhanced-content">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: highlightContent(content).replace(/\n/g, '<br>') 
            }}
            className={isTyping ? 'test-typing-animation' : ''}
          />
          {!content && (
            <p style={{ color: '#666', textAlign: 'center', fontSize: '18px' }}>
              Нажмите кнопку ниже для тестирования анимации
            </p>
          )}
        </div>

        <div className="test-controls">
          <button 
            className="test-button" 
            onClick={startTypingAnimation}
            disabled={isTyping}
          >
            {isTyping ? 'Печатаю...' : '⚡ Анимация печати'}
          </button>
          
          <button 
            className="test-button" 
            onClick={showFullContent}
            disabled={isTyping}
          >
            📄 Показать всё сразу
          </button>
          
          <button 
            className="test-button" 
            onClick={resetContent}
            disabled={isTyping}
          >
            🔄 Сброс
          </button>

          <select 
            value={typingSpeed} 
            onChange={(e) => setTypingSpeed(Number(e.target.value))}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value={20}>Очень быстро</option>
            <option value={50}>Быстро</option>
            <option value={100}>Нормально</option>
            <option value={200}>Медленно</option>
          </select>
        </div>
      </div>
    </>
  );
};

// Главная страница теста
const TestEnhancedPage: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f0f2f5',
      padding: '20px 0'
    }}>
      <TestEnhancedResults />
    </div>
  );
};

export default TestEnhancedPage;