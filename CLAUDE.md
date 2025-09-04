# 🤖 Claude Development Guidelines

## 📋 Project Context

**Project**: Outdoorable Widget - AI-powered travel planning widget
**Stack**: Next.js 15.5.2 + TypeScript + Tailwind + OpenAI API
**Status**: Production Ready (September 2025)
**Architecture**: Clean, minimal, iframe-ready widget

## 🏗️ Current Architecture (Always Check First!)

```
outdoorable-widget/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx           # Home page
│   │   ├── widget/page.tsx    # Main widget page
│   │   └── demo/page.tsx      # Demo page
│   ├── components/
│   │   ├── OutdoorableWidget.tsx  # ⭐ MAIN COMPONENT
│   │   └── ui/                    # UI components (minimal set)
│   ├── context/
│   │   └── WidgetContext.tsx      # State management
│   ├── data/
│   │   ├── inspire-me-questions.ts
│   │   ├── planning-questions.ts
│   │   └── prompts/              # OpenAI prompts
│   ├── pages/api/
│   │   └── generate-trip.ts      # ⭐ MAIN API ENDPOINT
│   ├── styles/
│   │   └── widget.css            # ⭐ MAIN STYLES
│   └── types/index.ts            # TypeScript definitions
├── public/images/               # Static assets
├── CHANGELOG.md                 # ⭐ COMPLETE PROJECT HISTORY
└── package.json                 # Clean dependencies
```

## ⚡ Development Rules (ALWAYS FOLLOW)

### 🎯 Rule #1: Plan-Then-Execute Philosophy
- **Step 1**: Plan ALL related changes before coding (identify all files to modify)
- **Step 2**: Execute changes in batches across multiple files simultaneously
- **Goal**: Maximum efficiency through coordinated bulk changes
- **Principle**: Plan comprehensively, execute massively, test thoroughly

### 🔍 Rule #2: Architecture First Analysis
**ALWAYS do this before any change:**

1. **Read current architecture** (check CHANGELOG.md for context)
2. **Identify the minimal change point** (which existing file to modify)
3. **Check for existing patterns** (how similar features are implemented)
4. **Verify style consistency** (use existing CSS variables and classes)

### 🛠️ Rule #3: Component Development
- **Main widget logic**: `OutdoorableWidget.tsx` (DO NOT create separate pages)
- **New UI elements**: Add to `src/components/ui/` (check existing first)
- **Styles**: Extend `widget.css` with `alfie-` prefixed classes
- **State**: Use existing `WidgetContext` (do not create new contexts)

### 🎨 Rule #4: Style Consistency
**ALWAYS use existing CSS variables:**
```css
--alfie-primary: #22C55E     /* Main green */
--alfie-text: #374151        /* Text */
--alfie-background: #F9FAFB  /* Background */
--alfie-border: #E5E7EB      /* Borders */
```

**Class naming**: `alfie-[component]-[element]` (e.g., `alfie-enhanced-nav`)

### 🧪 Rule #5: Testing Strategy
- **Dynamic URLs**: Use `window.location.origin` or relative paths
- **Query params for testing**: `/widget?test=component-name`
- **Dev playground**: Single file `src/app/dev/page.tsx` (if needed)
- **Port flexibility**: Code should work on any port

## 🚀 Massive Change Implementation Pattern

### Step 1: Planning Phase
```typescript
// 🎯 IDENTIFY ALL FILES TO CHANGE:
// 1. OutdoorableWidget.tsx - main logic
// 2. widget.css - styles  
// 3. types/index.ts - interfaces
// 4. context/WidgetContext.tsx - state (if needed)
// 5. Test parameters in existing pages
```

### Step 2: Coordinated Execution
```typescript
// Execute ALL changes in one session:
// ✅ MultiEdit tool for multiple files
// ✅ Batch CSS updates
// ✅ Update all related TypeScript interfaces
// ✅ Add test modes simultaneously
```

### Pattern 2: Adding Test Mode
```typescript
// ❌ DON'T: Create test routes or hardcode URLs
// ✅ DO: Use query parameters + dynamic URLs

// In existing page
const { test } = searchParams;

if (test === 'enhanced-results') {
  return <TestComponent />;
}

// For links, use dynamic URLs
const testUrl = `${window.location.origin}/widget?test=enhanced-results`;
// Or relative: `/widget?test=enhanced-results`
```

### Pattern 3: Adding Styles
```css
/* ❌ DON'T: Create new CSS file */
/* ✅ DO: Extend widget.css */

.alfie-enhanced-feature {
  background: var(--alfie-primary);
  color: white;
  /* Use existing variables */
}
```

## 🎯 Development Priorities (Current Focus)

### 🔥 High Priority: Enhanced Trip Results
- **Goal**: Improve OpenAI response display
- **Method**: Extend `OutdoorableWidget.tsx` result rendering (lines 249-253)
- **Components needed**: Progressive typing, section navigation, key phrase highlighting
- **Files to modify**: `OutdoorableWidget.tsx`, `widget.css`
- **Testing**: `/widget?test=enhanced-results`

### 🔶 Medium Priority: Expert System v2
- **Status**: Currently removed (archived)
- **Goal**: Re-implement with AI-powered matching
- **Method**: New API endpoint + Airtable integration
- **Files to create**: `src/pages/api/experts/ai-search.ts`

## 📖 Key References

### Essential Files to Read Before Changes:
1. **CHANGELOG.md** - Complete project history and context
2. **OutdoorableWidget.tsx** - Main component logic
3. **widget.css** - Style system and variables
4. **generate-trip.ts** - API integration patterns

### Current Status Indicators:
- ✅ **Production Ready**: Core widget functionality complete
- ✅ **Clean Architecture**: No legacy code, TypeScript strict
- ✅ **Style System**: Consistent Alfie green theme
- 🔄 **Enhancement Phase**: Ready for improved results display

## 🛡️ Development Guidelines

### ❌ Avoid When Possible:
- Creating new pages for simple features (prefer query params)
- Adding new CSS files (prefer extending widget.css)  
- Duplicating existing functionality
- Hardcoding URLs, ports, or environment-specific values
- Creating unnecessary complex folder structures

### ✅ Best Practices:
- Check CHANGELOG.md for context first
- Use existing CSS variables and classes
- Prefer extending existing components over creating new ones
- Use dynamic URLs (`window.location.origin` or relative paths)
- Follow existing TypeScript interfaces
- Maintain iframe compatibility
- Balance code reuse with feature complexity

## 🎯 Current Development Focus

**Next Implementation**: Enhanced Trip Results Display
- **Target File**: `OutdoorableWidget.tsx` (lines 249-253)
- **Method**: Replace simple text display with interactive component
- **Features**: Progressive typing, section navigation, highlighting
- **Testing**: Query parameter testing on any available port

## 🚀 Топ-12 практик для экспоненциального роста эффективности

### 🎯 **Для небольших проектов и начинающих:**

1. **📋 "Планирование перед кодом"**
   - Всегда составляй список файлов для изменения ПЕРЕД началом
   - Пиши план в комментариях, потом реализуй

2. **⚡ "Батчевые изменения"**
   - Меняй сразу все связанные файлы за один подход
   - Используй MultiEdit для одновременного редактирования

3. **🔍 "Сначала читай, потом пиши"**
   - Всегда изучай существующий код перед добавлением
   - 5 минут чтения = экономия 30 минут отладки

4. **🎨 "Копируй существующие паттерны"**
   - Не изобретай велосипед - используй то, что уже работает
   - Ищи похожие компоненты и повторяй их структуру

5. **🧪 "Query-параметры для тестирования"**
   - `?test=feature-name` вместо создания новых страниц
   - Быстрое переключение между режимами

6. **📝 "Веди changelog и документацию"**
   - Записывай каждое изменение - потом легче вспомнить
   - CHANGELOG.md как дневник проекта

7. **🔧 "Используй существующие CSS переменные"**
   - Не создавай новые цвета - используй уже определённые
   - Консистентность = профессионализм

8. **⚠️ "Фиксированный порт для dev"**
   - Один порт = меньше путаницы = быстрее работа
   - Можно делать закладки на localhost

9. **🎯 "Относительные пути всегда"**
   - Никаких хардкодов URL
   - `window.location.origin` или `/relative/path`

10. **🏗️ "Архитектура в одном файле"**
    - Держи структуру проекта в CLAUDE.md
    - Быстро понять что где лежит

11. **🚀 "TodoWrite для планирования"**
    - Разбивай большие задачи на маленькие
    - Трекинг прогресса мотивирует

12. **🎨 "Префиксы классов"**
    - `alfie-component-element` = легко найти и изменить
    - Никаких конфликтов стилей

---

*This file should be updated when architecture changes occur*
*Last Updated: September 2025*