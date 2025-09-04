import { Question } from '@/types';

// Flow 1: Inspire Me - полная система вопросов
export const inspireQuestions: Question[] = [
  {
    id: "Q0",
    flow: "inspire",
    type: "text",
    key: "home_base",
    text: "Where are you starting from? Helps me know what's realistic."
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
    text: "Any specific countries, cities, or areas you're leaning toward?"
  },
  {
    id: "Q3",
    flow: "inspire",
    type: "text",
    key: "no_go_regions", 
    text: "Any places or trip types you definitely don't want me to suggest?"
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
      "Single destination",
      "Multi-destination", 
      "Roadtrip",
      "Not sure yet — open to ideas"
    ]
  },
  {
    id: "Q5",
    flow: "inspire",
    type: "single_select",
    key: "budget_style",
    text: "What's the budget vibe you're picturing?",
    options: [
      "Luxe", 
      "Comfortable / Mid-range",
      "Budget / Simple", 
      "Not sure yet"
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
      "2 weeks",
      "3 weeks"
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
      "Trains", 
      "Rental car / self-drive",
      "Public transit",
      "Private transfers / guided transport",
      "Not sure yet — open to suggestions"
    ]
  },
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
    text: "Tell me the headcount — or the occasion if there's one."
  },
  {
    id: "Q8b",
    flow: "inspire", 
    type: "text",
    key: "activity_ability",
    text: "Dynamic question depending on party_type", // Will be handled dynamically
    condition: { dependsOn: "party_type" }
  },
  {
    id: "Q9",
    flow: "inspire",
    type: "single_select",
    key: "fitness_level",
    text: "How active do you want this trip to feel?",
    options: [
      "Low-key",
      "Moderate", 
      "High"
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
      "Water activities", 
      "Skiing / Snowboarding",
      "Scenic drives",
      "Wildlife viewing", 
      "Family-friendly outdoor activities",
      "Other…"
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
      "Food experiences"
    ]
  },
  {
    id: "Q13",
    flow: "inspire",
    type: "multi_select",
    key: "guided_experiences",
    text: "Are you interested in guided experiences, or would you rather explore fully on your own?",
    options: [
      "Guided outdoor activities",
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
  {
    id: "Q15",
    flow: "inspire",
    type: "text",
    key: "dealbreakers",
    text: "What should I skip suggesting? Crowds, long drives, extreme heat…?"
  },
  {
    id: "Q16",
    flow: "inspire",
    type: "text", 
    key: "trip_feel",
    text: "Last one — tell me how you want this trip to feel."
  }
];

// Flow 2: Planning - система вопросов с условиями
export const planningQuestions: Question[] = [
  // 1) Trip structure (branch first)
  {
    id: "Q0_planning",
    flow: "planning",
    type: "single_select",
    key: "trip_structure",
    text: "Okay, start me off — what kind of trip is this?", 
    options: [
      "Single destination (one home base, can include day trips)",
      "Multi-destination (changing locations/lodging)",
      "Roadtrip"
    ]
  },

  // A) If Single destination
  {
    id: "Q12A",
    flow: "planning",
    type: "text",
    key: "destination_main",
    text: "Where are you basing yourself?",
    condition: { 
      equals: { 
        key: "trip_structure", 
        value: "Single destination (one home base, can include day trips)" 
      } 
    }
  },
  {
    id: "Q13A",
    flow: "planning",
    type: "text", 
    key: "stay_details",
    text: "Got a neighborhood, hotel, or town locked in?",
    condition: { 
      equals: { 
        key: "trip_structure", 
        value: "Single destination (one home base, can include day trips)" 
      } 
    }
  },
  {
    id: "Q14A",
    flow: "planning",
    type: "single_select",
    key: "transport_mode",
    text: "How will you get around?", 
    options: [
      "Walking / Public transit",
      "Rental car / Self-drive",
      "Tours & transfers",
      "Mix",
      "Not sure — open to whatever's best"
    ],
    condition: { 
      equals: { 
        key: "trip_structure", 
        value: "Single destination (one home base, can include day trips)" 
      } 
    }
  },
  {
    id: "Q15A",
    flow: "planning",
    type: "single_select",
    key: "day_trips_interest",
    text: "Want me to suggest day trips out from your base?",
    options: ["Yes", "No"],
    condition: { 
      equals: { 
        key: "trip_structure", 
        value: "Single destination (one home base, can include day trips)" 
      } 
    }
  },
  {
    id: "Q15A_1",
    flow: "planning",
    type: "text",
    key: "max_daytrip_distance",
    text: "How far are you willing to go one-way for a day trip?",
    condition: {
      all: [
        { equals: { key: "trip_structure", value: "Single destination (one home base, can include day trips)" } },
        { equals: { key: "day_trips_interest", value: "Yes" } }
      ]
    }
  },
  {
    id: "Q16A",
    flow: "planning",
    type: "text",
    key: "anchors",
    text: "Got anything set in stone — flights, tours, hotels?",
    condition: { 
      equals: { 
        key: "trip_structure", 
        value: "Single destination (one home base, can include day trips)" 
      } 
    }
  },

  // B) If Multi-destination 
  {
    id: "Q12B",
    flow: "planning",
    type: "text",
    key: "stops",
    text: "Drop your stops in order with how many nights in each.",
    condition: { 
      equals: { 
        key: "trip_structure", 
        value: "Multi-destination (changing locations/lodging)" 
      } 
    }
  },
  {
    id: "Q13B",
    flow: "planning", 
    type: "single_select",
    key: "intercity_transport",
    text: "How do you plan to get around?",
    options: [
      "Train / Public transport", 
      "Rental car / Self-drive", 
      "Mix", 
      "Not sure yet"
    ],
    condition: { 
      equals: { 
        key: "trip_structure", 
        value: "Multi-destination (changing locations/lodging)" 
      } 
    }
  },
  {
    id: "Q14B",
    flow: "planning",
    type: "single_select",
    key: "stops_order_flex",
    text: "Is that order locked, or can I shuffle to save time or flow better?",
    options: ["Fixed", "Flexible"],
    condition: { 
      equals: { 
        key: "trip_structure", 
        value: "Multi-destination (changing locations/lodging)" 
      } 
    }
  },
  {
    id: "Q15B",
    flow: "planning",
    type: "single_select",
    key: "nights_flex", 
    text: "Could I shift a night or two between stops if it makes the trip flow better?",
    options: [
      "Yes, up to 2 nights", 
      "Maybe, 1 night", 
      "No, keep it fixed"
    ],
    condition: { 
      equals: { 
        key: "trip_structure", 
        value: "Multi-destination (changing locations/lodging)" 
      } 
    }
  },
  {
    id: "Q16B",
    flow: "planning",
    type: "text", 
    key: "anchors",
    text: "Flights, hotels, or tours already set in stone?",
    condition: { 
      equals: { 
        key: "trip_structure", 
        value: "Multi-destination (changing locations/lodging)" 
      } 
    }
  },

  // C) If Roadtrip
  {
    id: "Q12C",
    flow: "planning",
    type: "text",
    key: "roadtrip_region",
    text: "Paint me the broad strokes — what region are we driving?",
    condition: { equals: { key: "trip_structure", value: "Roadtrip" } }
  },
  {
    id: "Q13C",
    flow: "planning",
    type: "text",
    key: "roadtrip_start_end",
    text: "Same start and end, or one-way?",
    condition: { equals: { key: "trip_structure", value: "Roadtrip" } }
  },
  {
    id: "Q14C",
    flow: "planning",
    type: "text",
    key: "max_drive_hours", 
    text: "What's your comfortable max drive time in a single day?",
    condition: { equals: { key: "trip_structure", value: "Roadtrip" } }
  },
  {
    id: "Q15C",
    flow: "planning",
    type: "text",
    key: "roadtrip_musts",
    text: "Any towns, parks, or sights you want locked in along the way?", 
    condition: { equals: { key: "trip_structure", value: "Roadtrip" } }
  },
  {
    id: "Q16C",
    flow: "planning",
    type: "single_select",
    key: "overnight_rhythm",
    text: "How do you like to split nights?",
    options: [
      "2–3 nights minimum in each stop",
      "Okay with 1-night stays where it makes sense"
    ],
    condition: { equals: { key: "trip_structure", value: "Roadtrip" } }
  },

  // 2) Shared core (asked after the branch setup)
  {
    id: "Q1_shared",
    flow: "planning",
    type: "text",
    key: "season_window",
    text: "Got dates, or even just a season?"
  },
  {
    id: "Q2_shared",
    flow: "planning",
    type: "text", 
    key: "trip_length_days",
    text: "So I know how to pace things — how many days do you have start to finish?"
  },

  // Lodging logic (near the top)
  {
    id: "Q2a",
    flow: "planning",
    type: "single_select",
    key: "lodging_booked",
    text: "Have you already booked your accommodation?",
    options: ["Yes", "No, I need recommendations"]
  },
  {
    id: "Q2b",
    flow: "planning",
    type: "single_select",
    key: "lodging_type",
    text: "What type of stay are you leaning toward?",
    options: [
      "Camping",
      "Chain hotel / Resort",
      "Boutique hotel / Guesthouse", 
      "Airbnb / Apartment rental",
      "B&B / Farm stay",
      "RV / Campervan"
    ],
    condition: { equals: { key: "lodging_booked", value: "No, I need recommendations" } }
  },
  {
    id: "Q2c",
    flow: "planning",
    type: "text",
    key: "lodging_budget",
    text: "What's your ballpark budget per night?", 
    condition: { equals: { key: "lodging_booked", value: "No, I need recommendations" } }
  },

  // Travel party
  {
    id: "Q3",
    flow: "planning",
    type: "single_select",
    key: "party_type",
    text: "Who is going?",
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
    id: "Q3a",
    flow: "planning",
    type: "text",
    key: "party_details",
    text: "Tell me the headcount — or the occasion if there is one.",
    condition: { notIn: { key: "party_type", values: ["Couple", "Solo"] } }
  },

  // Q3b depends on party_type
  {
    id: "Q3b_solo",
    flow: "planning",
    type: "text",
    key: "solo_activity_pref",
    text: "How active do you want your days to feel?",
    condition: { equals: { key: "party_type", value: "Solo" } }
  },
  {
    id: "Q3b_group",
    flow: "planning",
    type: "text",
    key: "group_ability",
    text: "How active is the crew overall?",
    condition: { notEquals: { key: "party_type", value: "Solo" } }
  },

  // Style & Balance
  {
    id: "Q4",
    flow: "planning",
    type: "single_select",
    key: "fitness_level", 
    text: "How active do you want the trip to feel?",
    options: [
      "Low-key (short walks, light activity)",
      "Moderate (day hikes, biking, city walking)",
      "High (long hikes, big days, steeps)"
    ]
  },
  {
    id: "Q5",
    flow: "planning",
    type: "single_select",
    key: "balance_ratio",
    text: "Let's set the mix. Outdoors vs culture — what feels right?\n(By culture I mean museums, local tours, city wandering, historic or archeological sites.)",
    options: [
      "70% Outdoors / 30% Culture",
      "50% Outdoors / 50% Culture", 
      "30% Outdoors / 70% Culture"
    ]
  },
  {
    id: "Q6",
    flow: "planning",
    type: "single_select",
    key: "travel_style",
    text: "Would you say your vibe is more…",
    options: ["Luxe & Leisure", "Balanced Mix", "Active Explorer"]
  },
  {
    id: "Q7",
    flow: "planning",
    type: "multi_select",
    key: "activities",
    text: "What kinds of things light you up on trips? Pick all that fit.", 
    options: [
      "Hiking",
      "Biking",
      "Walking tours",
      "Beaches & swimming",
      "Water activities (kayak, paddle, snorkel)",
      "Skiing / Snowboarding",
      "Scenic drives", 
      "Art & museums",
      "Historic & archeological sites",
      "Wine / Breweries",
      "Live music / Nightlife",
      "Wildlife viewing",
      "Family-friendly activities",
      "Spa / Wellness",
      "Other…"
    ],
    other_text_key: "activities_other_text"
  },
  {
    id: "Q8",
    flow: "planning",
    type: "multi_select",
    key: "food_prefs",
    text: "Food's half the fun. What sounds good?",
    options: [
      "Adventurous eats",
      "Super local / traditional spots",
      "Fine dining", 
      "Cooking classes",
      "Food tours",
      "Markets"
    ]
  },
  {
    id: "Q9",
    flow: "planning",
    type: "multi_select",
    key: "guided_prefs",
    text: "Do you like having a guide — or are you all about going fully independent?",
    options: [
      "Guided outdoor activities",
      "Guided day trips", 
      "Guided city tours",
      "Food tours",
      "Wine tours",
      "Cooking classes",
      "No thanks — fully independent"
    ]
  },

  // Final two — full question texts (not labels)
  {
    id: "Q10",
    flow: "planning",
    type: "text",
    key: "must_haves",
    text: "Is there anything you have to include — a site, a trail, a dish, a vibe?"
  },
  {
    id: "Q11",
    flow: "planning",
    type: "text",
    key: "dealbreakers",
    text: "And what should I steer clear of? Long drives, big crowds, steeps…?"
  }
];

// Combine all questions
export const allQuestions: Question[] = [...inspireQuestions, ...planningQuestions];

// Export questions by flow for easy filtering
export const questionsByFlow = {
  inspire: inspireQuestions,
  planning: planningQuestions
};

// Helper function to get questions for a specific flow
export const getQuestionsByFlow = (flow: 'inspire' | 'planning'): Question[] => {
  return questionsByFlow[flow];
};

// Helper function to get dynamic question text for Q8b in inspire flow
export const getDynamicQ8bText = (partyType: string): string => {
  if (partyType === 'Solo') {
    return "How active do you want your days to feel?";
  } else if (partyType === 'Couple') {
    return "What's your energy level together on trips?";
  } else {
    return "How active is the crew overall?";
  }
};