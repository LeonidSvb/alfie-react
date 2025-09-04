import type { NextApiRequest, NextApiResponse } from 'next';

interface ExpertMatch {
  id: string;
  name: string;
  profession: string;
  email: string;
  shortBio: string;
  profileUrl: string;
  matchScore: number;
  matchedTags: string[];
}

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = 'apptAJxE6IudBH8fW';
const AIRTABLE_TABLE_ID = 'tblgvgDuQm20rNVPV';

// Mock data for testing if Airtable fails
const mockExperts = [
  {
    id: 'mock1',
    fields: {
      Name: 'Lura Snow',
      Profession: 'Utah Operations Manager & Guide',
      Email: 'lura.snow@gmail.com',
      Short_Bio: 'Lura has spent her entire life exploring the outdoors, from childhood camping trips to 16 years as a professional guide across Utah and Arizona.',
      Profile_URL: 'https://www.outdoorable.co/expert/lura-snow',
      All_Tags: ['region_utah', 'activity_hiking', 'traveler_solo', 'traveler_families', 'spec_backcountry']
    }
  },
  {
    id: 'mock2', 
    fields: {
      Name: 'Owen Eigenbrot',
      Profession: 'Long Distance Backpacker', 
      Email: 'hikefordays@gmail.com',
      Short_Bio: 'Owen has hiked over 13,000 miles since 2015, including some of the most rugged and rewarding long-distance trails in the world.',
      Profile_URL: 'https://www.outdoorable.co/expert/owen-eigenbrot',
      All_Tags: ['activity_hiking', 'traveler_solo', 'level_extreme', 'spec_backcountry']
    }
  }
];

// Получить экспертов из Airtable
async function fetchExperts(): Promise<any[]> {
  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка Airtable API: ${response.status}`);
    }

    const data = await response.json();
    return data.records || [];

  } catch (error) {
    console.error('Ошибка получения экспертов:', error);
    console.log('🔄 Используем mock данные');
    return mockExperts;
  }
}

// Простой алгоритм подбора эксперта
function matchExpert(formData: any, experts: any[]): ExpertMatch | null {
  for (const record of experts) {
    const fields = record.fields;
    if (!fields.Name || !fields.Email) continue;

    const expertTags = fields.All_Tags || [];
    let matchScore = 0;
    const matchedTags: string[] = [];

    // Проверяем соответствия
    if (formData.destination) {
      const dest = formData.destination.toLowerCase();
      if (dest.includes('utah') || dest.includes('юта')) {
        if (expertTags.includes('region_utah')) {
          matchScore += 30;
          matchedTags.push('Utah Expert');
        }
      }
      if (dest.includes('grand canyon') || dest.includes('гранд каньон')) {
        if (expertTags.includes('dest_grand_canyon')) {
          matchScore += 40;
          matchedTags.push('Grand Canyon');
        }
      }
      if (dest.includes('europe') || dest.includes('европа')) {
        if (expertTags.some(tag => tag.startsWith('country_'))) {
          matchScore += 25;
          matchedTags.push('Europe');
        }
      }
    }

    if (formData.activities) {
      const activities = formData.activities.toLowerCase();
      if (activities.includes('hiking') || activities.includes('поход')) {
        if (expertTags.includes('activity_hiking')) {
          matchScore += 25;
          matchedTags.push('Hiking');
        }
      }
      if (activities.includes('photography') || activities.includes('фото')) {
        if (expertTags.includes('activity_photography')) {
          matchScore += 20;
          matchedTags.push('Photography');
        }
      }
    }

    if (formData.travelerType) {
      const type = formData.travelerType.toLowerCase();
      if (type.includes('solo') || type.includes('один')) {
        if (expertTags.includes('traveler_solo')) {
          matchScore += 15;
          matchedTags.push('Solo Travel');
        }
      }
      if (type.includes('family') || type.includes('семья')) {
        if (expertTags.includes('traveler_families')) {
          matchScore += 15;
          matchedTags.push('Family Travel');
        }
      }
    }

    if (formData.experienceLevel) {
      const level = formData.experienceLevel.toLowerCase();
      if (level.includes('extreme') || level.includes('экстрим')) {
        if (expertTags.includes('level_extreme')) {
          matchScore += 20;
          matchedTags.push('Extreme Level');
        }
      }
      if (level.includes('beginner') || level.includes('начинающ')) {
        if (expertTags.includes('traveler_beginners')) {
          matchScore += 20;
          matchedTags.push('Beginner Friendly');
        }
      }
    }

    // Если есть совпадения, возвращаем эксперта
    if (matchScore > 20) {
      return {
        id: record.id,
        name: fields.Name,
        profession: fields.Profession || 'Travel Expert',
        email: fields.Email,
        shortBio: fields.Short_Bio || 'Опытный гид по активному отдыху.',
        profileUrl: fields.Profile_URL || '#',
        matchScore: Math.min(matchScore, 100),
        matchedTags: matchedTags,
      };
    }
  }

  // Если точных совпадений нет, возвращаем первого доступного
  const firstExpert = experts.find(r => r.fields.Name && r.fields.Email);
  if (firstExpert) {
    const fields = firstExpert.fields;
    return {
      id: firstExpert.id,
      name: fields.Name,
      profession: fields.Profession || 'Travel Expert',
      email: fields.Email,
      shortBio: fields.Short_Bio || 'Опытный гид по активному отдыху.',
      profileUrl: fields.Profile_URL || '#',
      matchScore: 60,
      matchedTags: ['General Expert'],
    };
  }

  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const formData = req.body;
    console.log('🔵 Получены данные для тестирования:', formData);

    // Получаем экспертов из Airtable
    const experts = await fetchExperts();
    console.log(`✅ Загружено ${experts.length} экспертов`);

    if (experts.length === 0) {
      return res.status(500).json({ 
        success: false, 
        error: 'Не удалось загрузить экспертов из Airtable' 
      });
    }

    // Находим подходящего эксперта
    const matchedExpert = matchExpert(formData, experts);

    if (!matchedExpert) {
      return res.status(404).json({
        success: false,
        error: 'Эксперт не найден'
      });
    }

    console.log(`✅ Найден эксперт: ${matchedExpert.name} (${matchedExpert.matchScore}%)`);

    return res.status(200).json({
      success: true,
      expert: matchedExpert,
    });

  } catch (error) {
    console.error('❌ Ошибка подбора эксперта:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
    });
  }
}