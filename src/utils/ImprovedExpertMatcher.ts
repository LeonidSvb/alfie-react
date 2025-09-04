// Улучшенная логика фильтрации экспертов с использованием тегов
// Адаптировано для TypeScript и React

export interface ExpertMatchRequest {
  destination?: string;        // "Utah", "Grand Canyon", "Norway"
  specific_location?: string;  // "Zion National Park", "Lofoten"  
  activities?: string[];       // ["hiking", "photography"]
  traveler_type?: string;      // "families", "solo", "beginners"
  experience_level?: string;   // "beginner", "advanced", "extreme"
  languages?: string[];        // ["spanish", "german"]
  group_size?: string;         // "solo", "small_group", "large_group"
  special_needs?: string[];    // ["accessibility", "kids_under_5"]
}

export interface ExpertRecord {
  id: string;
  fields: {
    Name: string;
    Location_Tags?: string[];
    Activity_Tags?: string[];
    Traveler_Tags?: string[];
    Expertise_Tags?: string[];
    Language_Tags?: string[];
    All_Tags?: string[];
    Geographic_areas_raw?: string;
    Professional_expertise_raw?: string;
    Travel_types_experience?: string;
    Languages_raw?: string;
    Bio?: string;
    Contact_Link?: string;
    Image?: string;
    Rating?: number;
    Review_Count?: number;
  };
}

export interface FilterStep {
  step: string;
  criteria: string;
  remaining: number;
  logic: string;
}

export interface ExpertMatchResult {
  expert: ExpertRecord;
  score: number;
  reasons: string[];
}

export interface FallbackSuggestions {
  geographic_expansion?: string | null;
  activity_alternatives?: string[][] | null;
  experience_adjustment?: string[] | null;
}

export interface ExpertSearchResult {
  totalFound: number;
  experts: ExpertMatchResult[];
  filterSteps: FilterStep[];
  fallbackSuggestions: FallbackSuggestions | null;
}

export class ImprovedExpertMatcher {
  private experts: ExpertRecord[] = [];
  private readonly AIRTABLE_API_KEY: string;
  private readonly BASE_ID: string;
  private readonly TABLE_ID: string;

  constructor() {
    this.AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || 'patt4GHq4ij1rNAdK.9b230d9e4002e265f7a89f6e208fd0d3145d1f495d66eb092252b8da7559da9d';
    this.BASE_ID = 'apptAJxE6IudBH8fW';
    this.TABLE_ID = 'tblgvgDuQm20rNVPV';
  }

  // Получение всех экспертов с тегами
  async getAllExperts(): Promise<ExpertRecord[]> {
    let allRecords: any[] = [];
    let offset: string | undefined = undefined;

    do {
      const url = `https://api.airtable.com/v0/${this.BASE_ID}/${this.TABLE_ID}${offset ? `?offset=${offset}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.AIRTABLE_API_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status}`);
      }

      const data = await response.json();
      allRecords = allRecords.concat(data.records);
      offset = data.offset;

    } while (offset);

    this.experts = allRecords
      .filter(record => record.fields.Name)
      .map(record => ({
        id: record.id,
        fields: record.fields
      }));
    
    return this.experts;
  }

  // УЛУЧШЕННАЯ ЛОГИКА ФИЛЬТРАЦИИ
  findExperts(userRequest: ExpertMatchRequest): ExpertSearchResult {
    const {
      destination,
      specific_location,
      activities,
      traveler_type,
      experience_level,
      languages,
      group_size,
      special_needs
    } = userRequest;

    console.log('🔍 ПОИСК ЭКСПЕРТОВ ПО ЗАПРОСУ:');
    console.log(JSON.stringify(userRequest, null, 2));

    let candidates = [...this.experts];
    const filterSteps: FilterStep[] = [];

    // ШАГ 1: ГЕОГРАФИЯ (Более умная)
    if (destination || specific_location) {
      const locationFilters = [];
      
      if (destination) locationFilters.push(this.createLocationFilter(destination));
      if (specific_location) locationFilters.push(this.createLocationFilter(specific_location));

      candidates = candidates.filter(expert => {
        return locationFilters.some(filter => this.matchesLocationFilter(expert, filter));
      });

      filterSteps.push({
        step: 'География',
        criteria: `${destination || ''} ${specific_location || ''}`.trim(),
        remaining: candidates.length,
        logic: 'Поиск по Location_Tags с умными синонимами'
      });
    }

    // ШАГ 2: АКТИВНОСТИ (Более гибкий)
    if (activities && activities.length > 0) {
      candidates = candidates.filter(expert => {
        return activities.some(activity => this.matchesActivity(expert, activity));
      });

      filterSteps.push({
        step: 'Активности',
        criteria: activities.join(', '),
        remaining: candidates.length,
        logic: 'Поиск по Activity_Tags + синонимы'
      });
    }

    // ШАГ 3: ТИП ПУТЕШЕСТВЕННИКА (Более точный)
    if (traveler_type) {
      candidates = candidates.filter(expert => {
        return this.matchesTravelerType(expert, traveler_type);
      });

      filterSteps.push({
        step: 'Тип путешественника',
        criteria: traveler_type,
        remaining: candidates.length,
        logic: 'Поиск по Traveler_Tags'
      });
    }

    // ШАГ 4: УРОВЕНЬ ОПЫТА И ЭКСПЕРТИЗА
    if (experience_level) {
      candidates = candidates.filter(expert => {
        return this.matchesExperienceLevel(expert, experience_level);
      });

      filterSteps.push({
        step: 'Уровень опыта',
        criteria: experience_level,
        remaining: candidates.length,
        logic: 'Поиск по Expertise_Tags (level_*)'
      });
    }

    // ШАГ 5: ЯЗЫКИ
    if (languages && languages.length > 0) {
      candidates = candidates.filter(expert => {
        return languages.some(lang => this.matchesLanguage(expert, lang));
      });

      filterSteps.push({
        step: 'Языки',
        criteria: languages.join(', '),
        remaining: candidates.length,
        logic: 'Поиск по Language_Tags'
      });
    }

    // РАНЖИРОВАНИЕ РЕЗУЛЬТАТОВ
    const rankedResults = this.rankExperts(candidates, userRequest);

    return {
      totalFound: rankedResults.length,
      experts: rankedResults,
      filterSteps: filterSteps,
      fallbackSuggestions: this.generateFallbacks(userRequest, rankedResults)
    };
  }

  // УМНЫЕ ПОМОЩНИКИ ДЛЯ ФИЛЬТРАЦИИ

  private createLocationFilter(location: string): string[] {
    const synonyms: { [key: string]: string[] } = {
      // Страны
      'usa': ['country_us', 'united states', 'america'],
      'utah': ['region_utah', 'country_us'],
      'colorado': ['region_colorado', 'country_us'],
      'norway': ['country_norway', 'scandinavian'],
      'canada': ['country_canada'],

      // Конкретные места
      'grand canyon': ['dest_grand_canyon'],
      'yellowstone': ['dest_yellowstone'], 
      'zion': ['dest_zion'],
      'yosemite': ['dest_yosemite'],
      'mount rainier': ['dest_mt_rainier'],
      'lofoten': ['dest_lofoten'],
      'patagonia': ['dest_patagonia'],

      // Регионы
      'pacific northwest': ['region_washington', 'dest_cascades', 'dest_mt_rainier'],
      'california': ['region_california'],
      'alaska': ['region_alaska'],
    };

    const locationLower = location.toLowerCase();
    return synonyms[locationLower] || [locationLower];
  }

  private matchesLocationFilter(expert: ExpertRecord, filter: string[]): boolean {
    const locationTags = expert.fields.Location_Tags || [];
    const allTags = expert.fields.All_Tags || [];
    
    return filter.some(term => {
      return locationTags.some(tag => tag.includes(term)) ||
             allTags.some(tag => tag.includes(term)) ||
             this.textContains(expert.fields.Geographic_areas_raw, term);
    });
  }

  private matchesActivity(expert: ExpertRecord, activity: string): boolean {
    const activitySynonyms: { [key: string]: string[] } = {
      'hiking': ['activity_hiking', 'activity_mountaineering', 'hiking', 'backpacking'],
      'photography': ['activity_photography', 'photographer', 'filming'],
      'diving': ['activity_diving', 'scuba', 'snorkeling'],
      'skiing': ['activity_skiing', 'ski', 'snowboarding'],
      'climbing': ['activity_climbing', 'mountaineering', 'rock climbing'],
      'canyoning': ['activity_canyoning', 'canyoneering', 'canyon'],
      'wildlife': ['activity_wildlife', 'safari', 'birding']
    };

    const activityLower = activity.toLowerCase();
    const synonymsToCheck = activitySynonyms[activityLower] || [activityLower];

    const activityTags = expert.fields.Activity_Tags || [];
    const allTags = expert.fields.All_Tags || [];

    return synonymsToCheck.some(term => {
      return activityTags.some(tag => tag.includes(term)) ||
             allTags.some(tag => tag.includes(term)) ||
             this.textContains(expert.fields.Professional_expertise_raw, term);
    });
  }

  private matchesTravelerType(expert: ExpertRecord, type: string): boolean {
    const typeSynonyms: { [key: string]: string[] } = {
      'families': ['traveler_families', 'family', 'kids', 'children'],
      'solo': ['traveler_solo', 'solo'],
      'beginners': ['traveler_beginners', 'first-time', 'novice'],
      'extreme': ['traveler_extreme', 'advanced', 'expert'],
      'seniors': ['traveler_60plus', 'senior', 'elderly']
    };

    const typeLower = type.toLowerCase();
    const synonymsToCheck = typeSynonyms[typeLower] || [typeLower];

    const travelerTags = expert.fields.Traveler_Tags || [];
    const allTags = expert.fields.All_Tags || [];

    return synonymsToCheck.some(term => {
      return travelerTags.some(tag => tag.includes(term)) ||
             allTags.some(tag => tag.includes(term)) ||
             this.textContains(expert.fields.Travel_types_experience, term);
    });
  }

  private matchesExperienceLevel(expert: ExpertRecord, level: string): boolean {
    const levelSynonyms: { [key: string]: string[] } = {
      'beginner': ['level_beginner', 'first-time', 'novice'],
      'advanced': ['level_advanced', 'experienced'],
      'extreme': ['level_extreme', 'professional', 'expert']
    };

    const levelLower = level.toLowerCase();
    const synonymsToCheck = levelSynonyms[levelLower] || [levelLower];

    const expertiseTags = expert.fields.Expertise_Tags || [];
    const allTags = expert.fields.All_Tags || [];

    return synonymsToCheck.some(term => {
      return expertiseTags.some(tag => tag.includes(term)) ||
             allTags.some(tag => tag.includes(term));
    });
  }

  private matchesLanguage(expert: ExpertRecord, language: string): boolean {
    const languageSynonyms: { [key: string]: string[] } = {
      'spanish': ['lang_spanish', 'spanish'],
      'german': ['lang_german', 'german', 'deutsch'],
      'french': ['lang_french', 'french'],
      'japanese': ['lang_japanese', 'japanese']
    };

    const langLower = language.toLowerCase();
    const synonymsToCheck = languageSynonyms[langLower] || [`lang_${langLower}`];

    const languageTags = expert.fields.Language_Tags || [];
    const allTags = expert.fields.All_Tags || [];

    return synonymsToCheck.some(term => {
      return languageTags.some(tag => tag.includes(term)) ||
             allTags.some(tag => tag.includes(term)) ||
             this.textContains(expert.fields.Languages_raw, term);
    });
  }

  // РАНЖИРОВАНИЕ ЭКСПЕРТОВ ПО РЕЛЕВАНТНОСТИ
  private rankExperts(experts: ExpertRecord[], userRequest: ExpertMatchRequest): ExpertMatchResult[] {
    return experts.map(expert => {
      const score = this.calculateRelevanceScore(expert, userRequest);
      return {
        expert: expert,
        score: score,
        reasons: this.explainMatch(expert, userRequest)
      };
    }).sort((a, b) => b.score - a.score);
  }

  private calculateRelevanceScore(expert: ExpertRecord, userRequest: ExpertMatchRequest): number {
    let score = 0;

    // Бонусы за точные совпадения
    if (userRequest.destination && this.matchesLocationFilter(expert, this.createLocationFilter(userRequest.destination))) {
      score += 10;
    }

    if (userRequest.activities) {
      userRequest.activities.forEach(activity => {
        if (this.matchesActivity(expert, activity)) score += 8;
      });
    }

    if (userRequest.traveler_type && this.matchesTravelerType(expert, userRequest.traveler_type)) {
      score += 6;
    }

    if (userRequest.experience_level && this.matchesExperienceLevel(expert, userRequest.experience_level)) {
      score += 5;
    }

    if (userRequest.languages) {
      userRequest.languages.forEach(lang => {
        if (this.matchesLanguage(expert, lang)) score += 7;
      });
    }

    // Бонус за количество отзывов/опыт (если поле есть)
    const expertiseTags = expert.fields.Expertise_Tags || [];
    if (expertiseTags.includes('role_guide')) score += 3;
    if (expertiseTags.includes('cert_wfr')) score += 2;
    
    return score;
  }

  private explainMatch(expert: ExpertRecord, userRequest: ExpertMatchRequest): string[] {
    const reasons: string[] = [];
    
    if (userRequest.destination) {
      if (this.matchesLocationFilter(expert, this.createLocationFilter(userRequest.destination))) {
        reasons.push(`Expert for region: ${userRequest.destination}`);
      }
    }

    if (userRequest.activities) {
      userRequest.activities.forEach(activity => {
        if (this.matchesActivity(expert, activity)) {
          reasons.push(`Specializes in: ${activity}`);
        }
      });
    }

    if (userRequest.traveler_type) {
      if (this.matchesTravelerType(expert, userRequest.traveler_type)) {
        reasons.push(`Experience with: ${userRequest.traveler_type}`);
      }
    }

    return reasons;
  }

  // FALLBACK стратегии
  private generateFallbacks(userRequest: ExpertMatchRequest, foundExperts: ExpertMatchResult[]): FallbackSuggestions | null {
    if (foundExperts.length === 0) {
      return {
        geographic_expansion: this.expandGeographicSearch(userRequest),
        activity_alternatives: this.findActivityAlternatives(userRequest),
        experience_adjustment: this.adjustExperienceLevel(userRequest)
      };
    }

    return null;
  }

  private expandGeographicSearch(userRequest: ExpertMatchRequest): string | null {
    if (userRequest.specific_location && !userRequest.destination) {
      return `Try broader region search for ${userRequest.specific_location}`;
    }
    return null;
  }

  private findActivityAlternatives(userRequest: ExpertMatchRequest): string[][] | null {
    const alternatives: { [key: string]: string[] } = {
      'ice_climbing': ['rock_climbing', 'mountaineering'],
      'mushroom_foraging': ['hiking', 'nature_photography'],
      'base_jumping': ['skydiving', 'extreme_sports']
    };

    if (userRequest.activities) {
      return userRequest.activities.map(activity => {
        return alternatives[activity] || [`general_${activity}`, 'adventure_guide'];
      });
    }
    return null;
  }

  private adjustExperienceLevel(userRequest: ExpertMatchRequest): string[] | null {
    const adjustments: { [key: string]: string[] } = {
      'extreme': ['advanced', 'professional'],
      'beginner': ['intermediate', 'general']
    };

    return userRequest.experience_level ? adjustments[userRequest.experience_level] || null : null;
  }

  // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
  private textContains(text?: string, term?: string): boolean {
    if (!text || !term) return false;
    return text.toLowerCase().includes(term.toLowerCase());
  }
}