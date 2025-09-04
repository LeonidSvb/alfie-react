import { Expert } from '@/types';

// Парсинг экспертов из CSV данных (первые несколько для демонстрации)
export const expertsList: Expert[] = [
  {
    id: "rectCQNkXUH0FGWxb",
    name: "Abby Burlingame",
    profession: "Former Park Ranger",
    bio: "Abby grew up in the Seattle area, hiking and camping the Cascades in the summer and skiing them in the winter. She worked for a decade with the Washington Trails Association, followed by a decade-long career with the National Park Service.",
    profileUrl: "https://www.outdoorable.co/expert/abby-burlingame",
    email: "abbysburlingame@gmail.com",
    expertise: ["Outdoor Educator/Instructor", "Park Ranger"],
    travelTypes: ["Solo travelers", "Families with young kids", "Multi-generational groups with varying skill sets", "Travelers aged 60+", "First-time adventurers"],
    locations: [
      "United States: Washington: Whole State",
      "United States: Washington: Northern Idaho", 
      "Canada: British Columbia: Vancouver, Victoria, Alaska Highway",
      "United States: Alaska: Seward Peninsula: Kenai Fjords National Park",
      "United States: New Mexico: Carlsbad",
      "United States: Oregon: Eastern Oregon: Bend, Crater Lake, Klamath Falls, John Day Fossil Beds",
      "United States: California: Northern California: Lassen, Mount Shasta, Lava Beds National Monument"
    ],
    profileImage: "/3.png", // Используем имеющееся изображение Alfie
    calendlyUrl: "https://calendly.com/abby-outdoorable" // Placeholder
  },
  {
    id: "rec0YIfUDO3JONpsr",
    name: "Alexandra Long", 
    profession: "Former professional guide",
    bio: "Alexandra is a rule-loving child turned adventurous adult who fell in love with the outdoors on her very first backpacking trip in Wyoming's Wind River Range. Today, she lives in Pittsburgh, PA, working to protect and enhance outdoor spaces as part of the Pennsylvania Environmental Council.",
    profileUrl: "https://www.outdoorable.co/expert/alexandra-long",
    email: "alexandraloulevi@gmail.com",
    expertise: ["Former Professional Guide", "Outdoor Educator/Instructor", "Wilderness First Responder", "Extreme Athlete (Mountaineer, Ultramarathoner, Big Wave Surfer, etc)"],
    travelTypes: ["Solo travelers", "Families with young kids", "Multi-generational groups with varying skill sets", "Travelers aged 60+", "First-time adventurers", "Extreme athletes"],
    locations: [
      "United States: Pennsylvania: Western Pennsylvania: Laurel Highlands: Whole Region",
      "United States: Pennsylvania: Western Pennsylvania: Erie to Pittsburgh Corridor",
      "United States: Pennsylvania: The PA Wilds", 
      "United States: Pennsylvania: Eastern Pennsylvania: Philadelphia Metropolitan and its outlying suburban regions",
      "United States: Pennsylvania: Central Pennsylvania: Harrisburg and its surrounding rural counties",
      "United States: Wyoming: Wind River Range",
      "United States: Wyoming: Wilson, Jackson, Moose, Kelly, Moran corridor"
    ],
    profileImage: "/3.png",
    calendlyUrl: "https://calendly.com/alexandra-outdoorable"
  },
  {
    id: "recNZPL1OW3kTztoU",
    name: "Andie Cornish",
    profession: "Professional trail runner",
    bio: "Andie grew up in Jackson, Wyoming, with the Tetons as her backyard and playground. She now travels the world as a professional trail runner and elite ski mountaineer.",
    profileUrl: "https://www.outdoorable.co/expert/andie-cornish", 
    email: "andiecornish@gmail.com",
    expertise: ["Outdoor Educator/Instructor", "Extreme Athlete (Mountaineer, Ultramarathoner, Big Wave Surfer, etc)"],
    travelTypes: ["Solo travelers", "Multi-generational groups with varying skill sets", "First-time adventurers", "Extreme athletes"],
    locations: [
      "USA: Wyoming, entire Jackson Hole area and surrounding vicinity",
      "USA: Idaho: Driggs/Victor, Sun Valley:Galena Pass, Sawtooth Mountains",
      "USA: Utah: Salt Lake City, Park City",
      "USA: Vermont: Extremely familiar with entire state, Green Mountains, Mad River Valley",
      "Norway: Southern:Oslo, South West: Hemsedal, Andalsnes, Alesund",
      "Switzerland: Veysonnaz, Crans Montana", 
      "France: Chamonix, Paris",
      "Denmark: Copenhagen"
    ],
    profileImage: "/3.png",
    calendlyUrl: "https://calendly.com/andie-outdoorable"
  },
  {
    id: "rec123ExampleId",
    name: "Andreas Frese",
    profession: "Outdoor Educator and van life expert",
    bio: "Andreas has travelled all across the US, while living the \"van life\", mapped out long-distance trails, hiked thousands of miles across five continents, and led groups ranging from first-timers to seasoned hikers.",
    profileUrl: "https://www.outdoorable.co/expert/andreas-frese",
    email: "andyf0722@gmail.com", 
    expertise: ["Outdoor Educator", "Van Life Expert", "Trail Mapper", "Thru-Hiking Guide"],
    travelTypes: ["Solo travelers", "Multi-generational groups with varying skill sets", "Travelers aged 60+", "First-time adventurers"],
    locations: [
      "United States: New Hampshire: White Mountain National Forest",
      "United States: New Hampshire: Lakes Region",
      "United States: New Hampshire: Appalachian Trail",
      "United States: Maine: Acadia National Park",
      "United States: Maine: Baxter State Park",
      "United States: Montana: Glacier National Park",
      "United States: Wyoming: Yellowstone National Park",
      "United States: Wyoming: Grand Tetons National Park",
      "United States: California: Yosemite National Park",
      "United States: Arizona: The Arizona Trail",
      "United States: Arizona: Grand Canyon National Park",
      "United States: Colorado: Rocky Mountains",
      "United States: Utah: The \"Big Five\" National Parks"
    ],
    profileImage: "/3.png",
    calendlyUrl: "https://calendly.com/andreas-outdoorable"
  }
  // Можно добавить больше экспертов по мере необходимости
];

// Функция для получения всех экспертов
export const getAllExperts = (): Expert[] => {
  return expertsList;
};

// Функция для поиска эксперта по ID
export const getExpertById = (id: string): Expert | undefined => {
  return expertsList.find(expert => expert.id === id);
};

// Функция для фильтрации экспертов по локации
export const getExpertsByLocation = (searchLocation: string): Expert[] => {
  return expertsList.filter(expert => 
    expert.locations.some(location => 
      location.toLowerCase().includes(searchLocation.toLowerCase())
    )
  );
};

// Функция для фильтрации экспертов по типу путешественника
export const getExpertsByTravelType = (travelType: string): Expert[] => {
  return expertsList.filter(expert =>
    expert.travelTypes.includes(travelType)
  );
};

// Функция для фильтрации экспертов по экспертизе
export const getExpertsByExpertise = (expertise: string): Expert[] => {
  return expertsList.filter(expert =>
    expert.expertise.some(exp => 
      exp.toLowerCase().includes(expertise.toLowerCase())
    )
  );
};

// Вспомогательные функции для парсинга географических данных
export const parseLocation = (locationString: string) => {
  const parts = locationString.split(':').map(part => part.trim());
  return {
    continent: parts[0] || '',
    country: parts[1] || '',
    region: parts[2] || '',
    city: parts[3] || '',
    specificLocation: parts[4] || ''
  };
};

// Функция для получения уникальных стран из всех экспертов
export const getAllCountries = (): string[] => {
  const countries = new Set<string>();
  
  expertsList.forEach(expert => {
    expert.locations.forEach(location => {
      const parsed = parseLocation(location);
      if (parsed.country) {
        countries.add(parsed.country);
      }
    });
  });
  
  return Array.from(countries).sort();
};

// Функция для получения уникальных регионов
export const getAllRegions = (): string[] => {
  const regions = new Set<string>();
  
  expertsList.forEach(expert => {
    expert.locations.forEach(location => {
      const parsed = parseLocation(location);
      if (parsed.region) {
        regions.add(parsed.region);
      }
    });
  });
  
  return Array.from(regions).sort();
};