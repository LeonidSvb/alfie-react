import { Question } from '@/types';

// Flow 1: "Inspire me — I'm not sure where to go yet"
export const inspireQuestions: Question[] = [
  // 1. Geography & Reach
  {
    id: "Q0",
    flow: "inspire",
    type: "text",
    key: "home_base",
    text: "Where are you starting from? Helps me know what's realistic.",
    example: "Based in Chicago"
  },
  {
    id: "Q1",
    flow: "inspire",
    type: "single_select",
    key: "travel_radius",
    text: "How far are you open to going?",
    options: [
      "Within driving distance",
      "Short flight (2–4 hrs)",
      "Medium flight (5–8 hrs)",
      "Long haul — anywhere goes"
    ]
  },
  {
    id: "Q2",
    flow: "inspire",
    type: "multi_select",
    key: "regions_interest",
    text: "Which parts of the world sound most interesting right now?",
    options: [
      "USA",
      "Canada",
      "Europe",
      "Latin America (incl. Mexico / Central America)",
      "South America",
      "Asia",
      "Africa",
      "Middle East",
      "Open to anywhere"
    ]
  },
  {
    id: "Q2a",
    flow: "inspire",
    type: "text",
    key: "specific_regions",
    text: "Any specific countries, cities, or areas you're leaning toward?",
    example: "Portugal, Kyoto, Kenya..."
  },
  {
    id: "Q3",
    flow: "inspire",
    type: "text",
    key: "no_go_regions",
    text: "Any places or trip types you definitely don't want me to suggest?",
    example: "No deserts, not into tropical humidity"
  },
  {
    id: "Q4",
    flow: "inspire",
    type: "multi_select",
    key: "terrain_prefs",
    text: "What kinds of terrain sound most appealing?",
    options: [
      "Mountains",
      "Forest",
      "Ocean / Coastline",
      "Lake",
      "Beach",
      "Desert",
      "Winter / Snow"
    ]
  },
  {
    id: "Q4a",
    flow: "inspire",
    type: "single_select",
    key: "setting_pref",
    text: "What kind of setting are you most drawn to?",
    options: [
      "Big city",
      "Small town / village",
      "Rural countryside",
      "Off the grid / remote",
      "Open to a mix"
    ]
  },
  {
    id: "Q4b",
    flow: "inspire",
    type: "single_select",
    key: "trip_structure",
    text: "Do you see this trip as…",
    options: [
      "Single destination (one home base, can include day trips)",
      "Multi-destination (changing locations/lodging)",
      "Roadtrip (on the move every day or two)",
      "Not sure yet — open to ideas"
    ]
  },

  // 2. Framing the Trip
  {
    id: "Q5",
    flow: "inspire",
    type: "single_select",
    key: "budget_style",
    text: "What's your style?",
    options: [
      "💎 Luxe",
      "✨ Comfortable / Mid-range",
      "🛶 Budget / Simple",
      "❓ Not sure yet"
    ]
  },
  {
    id: "Q6",
    flow: "inspire",
    type: "single_select",
    key: "season_window",
    text: "When are you hoping to travel?",
    options: [
      "Winter (Dec–Feb)",
      "Spring (Mar–May)",
      "Summer (Jun–Aug)",
      "Fall (Sep–Nov)",
      "Not sure yet"
    ]
  },
  {
    id: "Q7",
    flow: "inspire",
    type: "single_select",
    key: "trip_length_days",
    text: "How much time do you have?",
    options: [
      "Short trip: 2–4 days",
      "1 week",
      "2 weeks+",
      "3 weeks+"
    ]
  },
  {
    id: "Q7a",
    flow: "inspire",
    type: "multi_select",
    key: "lodging_style",
    text: "What kind of stay are you leaning toward?",
    options: [
      "Camping / Rustic",
      "Chain hotel or resort",
      "Boutique / Guesthouse",
      "Airbnb / Apartment rental",
      "B&B / Farm stay",
      "RV / Campervan",
      "Not sure yet"
    ]
  },
  {
    id: "Q7b",
    flow: "inspire",
    type: "single_select",
    key: "transport_pref",
    text: "How do you picture getting around?",
    options: [
      "🚆 Trains",
      "🚗 Rental car / self-drive",
      "🚌 Public transit",
      "🚐 Private transfers / guided transport",
      "A mix"
    ]
  },

  // 3. Travel Party
  {
    id: "Q8",
    flow: "inspire",
    type: "single_select",
    key: "party_type",
    text: "Who's going?",
    options: [
      "Friends",
      "Couple",
      "Solo",
      "Family with young kids (under 12)",
      "Family with kids 12–18",
      "Multi-gen family",
      "Work trip / Colleagues"
    ]
  },
  {
    id: "Q8a",
    flow: "inspire",
    type: "text",
    key: "party_details",
    text: "Tell me the headcount — or the occasion if there's one.",
    example: "6 people, 40th birthday",
    condition: { 
      notIn: { 
        key: "party_type", 
        values: ["Couple", "Solo"] 
      } 
    }
  },

  // 4. Style & Balance
  {
    id: "Q9",
    flow: "inspire",
    type: "single_select",
    key: "fitness_level",
    text: "How intense are you willing to go on outdoor activities?",
    options: [
      "Low-key (short walks, light activity)",
      "Moderate (day hikes, biking, city walking)",
      "High (long hikes, skiing, multi-day treks)"
    ]
  },
  {
    id: "Q10",
    flow: "inspire",
    type: "single_select",
    key: "balance_ratio",
    text: "Set the mix — nature vs culture.",
    options: [
      "70% Outdoors / 30% Culture",
      "50% Outdoors / 50% Culture",
      "30% Outdoors / 70% Culture"
    ]
  },
  {
    id: "Q11",
    flow: "inspire",
    type: "multi_select",
    key: "outdoor_activities",
    text: "Which outdoor activities are most important to you?",
    options: [
      "Hiking",
      "Biking",
      "Beaches & swimming",
      "Surfing",
      "Water activities (kayak, paddle, snorkel)",
      "Skiing / Snowboarding",
      "Scenic drives",
      "Wildlife viewing",
      "Family-friendly outdoor activities",
      "Other… (free form)"
    ]
  },
  {
    id: "Q12",
    flow: "inspire",
    type: "multi_select",
    key: "non_outdoor_interests",
    text: "What about cultural or non-outdoorsy interests?",
    options: [
      "Historic & archaeological sites",
      "Art & museums",
      "Live music / Nightlife",
      "Markets",
      "Spa / Wellness",
      "Food experiences (cooking classes, food tours, wine/beer tastings)",
      "Other (free form)"
    ]
  },
  {
    id: "Q13",
    flow: "inspire",
    type: "multi_select",
    key: "guided_experiences",
    text: "Are you interested in guided experiences, or would you rather explore fully on your own?",
    options: [
      "Guided outdoor activities (hikes, climbs, paddles)",
      "Guided day trips",
      "Guided city/cultural tours",
      "Food/wine tours, cooking classes",
      "No thanks — fully independent"
    ]
  },
  {
    id: "Q14",
    flow: "inspire",
    type: "multi_select",
    key: "food_prefs",
    text: "What kind of food experiences are you into?",
    options: [
      "Adventurous eats",
      "Super local / traditional spots",
      "Fine dining",
      "Cooking classes",
      "Food tours",
      "Markets"
    ]
  },

  // 5. Anchors & Vibe
  {
    id: "Q15",
    flow: "inspire",
    type: "text",
    key: "dealbreakers",
    text: "What should I skip suggesting? Crowds, long drives, extreme heat…?",
    example: "No overnight buses, avoid humid destinations"
  },
  {
    id: "Q16",
    flow: "inspire",
    type: "text",
    key: "trip_feel",
    text: "Last one — tell me how you want this trip to feel or anything else you'd like me to know.",
    example: "Relaxed with a few big active days / I'm super into history"
  }
];

// Helper function to get inspire questions
export const getInspireQuestions = (): Question[] => {
  return inspireQuestions;
};