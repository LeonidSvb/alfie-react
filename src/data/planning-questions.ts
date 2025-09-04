import { Question } from '@/types';

// Flow 2: "I know my destination(s) - help with recs & itinerary"
export const planningQuestions: Question[] = [
  // 1) Trip structure (branch first)
  {
    id: "Q0",
    flow: "planning",
    type: "single_select",
    key: "trip_structure",
    text: "What kind of trip is this?",
    options: [
      "🏠 Single destination (one home base, can include day trips)",
      "🧳 Multi‑destination (changing locations/lodging)",
      "🚙 Roadtrip"
    ]
  },

  // A) If Single destination
  {
    id: "Q12A",
    flow: "planning",
    type: "text",
    key: "destination_main",
    text: "Where will your home base be?",
    example: "Kyoto",
    condition: { 
      equals: { 
        key: "trip_structure", 
        value: "🏠 Single destination (one home base, can include day trips)" 
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
      "Rental car / Self‑drive",
      "Tours & transfers",
      "Mix"
    ],
    condition: { 
      equals: { 
        key: "trip_structure", 
        value: "🏠 Single destination (one home base, can include day trips)" 
      } 
    }
  },
  {
    id: "Q15A",
    flow: "planning",
    type: "single_select",
    key: "day_trips_interest",
    text: "Want me to suggest day trips out from your base?",
    options: ["Yes", "No, I want to stay in my home base"],
    condition: { 
      equals: { 
        key: "trip_structure", 
        value: "🏠 Single destination (one home base, can include day trips)" 
      } 
    }
  },
  {
    id: "Q16A",
    flow: "planning",
    type: "text",
    key: "anchors",
    text: "Got anything set in stone — flights, tours, hotels?",
    example: "Dinner reso night 2; food tour day 3",
    condition: { 
      equals: { 
        key: "trip_structure", 
        value: "🏠 Single destination (one home base, can include day trips)" 
      } 
    }
  },

  // B) If Multi‑destination
  {
    id: "Q12B",
    flow: "planning",
    type: "text",
    key: "stops",
    text: "List your stops or places you're interested in.",
    example: "Florence, Siena, Rome...",
    condition: { 
      equals: { 
        key: "trip_structure", 
        value: "🧳 Multi‑destination (changing locations/lodging)" 
      } 
    }
  },
  {
    id: "Q13B",
    flow: "planning",
    type: "single_select",
    key: "intercity_transport",
    text: "What's your preferred mode of transport?",
    options: [
      "Train / Public transport",
      "Rental car / Self‑drive",
      "Mix",
      "Not sure yet"
    ],
    condition: { 
      equals: { 
        key: "trip_structure", 
        value: "🧳 Multi‑destination (changing locations/lodging)" 
      } 
    }
  },
  {
    id: "Q16B",
    flow: "planning",
    type: "text",
    key: "anchors",
    text: "Flights, hotels, or tours already set in stone?",
    example: "Flight into Florence; Vatican tour booked",
    condition: { 
      equals: { 
        key: "trip_structure", 
        value: "🧳 Multi‑destination (changing locations/lodging)" 
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
    example: "Southwest loop: Vegas to the parks",
    condition: { 
      equals: { 
        key: "trip_structure", 
        value: "🚙 Roadtrip" 
      } 
    }
  },
  {
    id: "Q13C",
    flow: "planning",
    type: "text",
    key: "roadtrip_start_end",
    text: "Same start and end, or one‑way?",
    example: "Start Vegas, end Phoenix",
    condition: { 
      equals: { 
        key: "trip_structure", 
        value: "🚙 Roadtrip" 
      } 
    }
  },
  {
    id: "Q14C",
    flow: "planning",
    type: "text",
    key: "max_drive_hours",
    text: "What's your comfortable max drive time in a single day?",
    example: "4 hours/day",
    condition: { 
      equals: { 
        key: "trip_structure", 
        value: "🚙 Roadtrip" 
      } 
    }
  },
  {
    id: "Q15C",
    flow: "planning",
    type: "text",
    key: "roadtrip_musts",
    text: "Any towns, parks, or sights you want locked in along the way?",
    example: "Horseshoe Bend, Monument Valley",
    condition: { 
      equals: { 
        key: "trip_structure", 
        value: "🚙 Roadtrip" 
      } 
    }
  },
  {
    id: "Q16C",
    flow: "planning",
    type: "single_select",
    key: "overnight_rhythm",
    text: "How do you like to split nights?",
    options: [
      "2–3 nights minimum in each stop",
      "Okay with 1‑night stays where it makes sense"
    ],
    condition: { 
      equals: { 
        key: "trip_structure", 
        value: "🚙 Roadtrip" 
      } 
    }
  },

  // 2) Shared core (asked after the branch setup)
  {
    id: "Q1",
    flow: "planning",
    type: "text",
    key: "season_window",
    text: "Got dates, or even just a season?",
    example: "Late May 2025"
  },
  {
    id: "Q2",
    flow: "planning",
    type: "text",
    key: "trip_length_days",
    text: "So I know how to pace things — how many days do you have start to finish?",
    example: "7 days"
  },

  // Lodging logic (light, near the top)
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
    condition: { 
      equals: { 
        key: "lodging_booked", 
        value: "No, I need recommendations" 
      } 
    }
  },
  {
    id: "Q2c",
    flow: "planning",
    type: "text",
    key: "lodging_budget",
    text: "What's your ballpark budget per night?",
    example: "$150–200/night",
    condition: { 
      equals: { 
        key: "lodging_booked", 
        value: "No, I need recommendations" 
      } 
    }
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
      "Multi‑gen family",
      "Work trip / Colleagues"
    ]
  },

  // Style & Balance
  {
    id: "Q4",
    flow: "planning",
    type: "single_select",
    key: "fitness_level",
    text: "How intense do you want your outdoor activity recommendations to be?",
    options: [
      "Low‑key (short walks, light activity)",
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
    options: [
      "Luxe & Leisure",
      "Balanced Mix",
      "Active Explorer"
    ]
  },
  {
    id: "Q7",
    flow: "planning",
    type: "multi_select",
    key: "activities",
    text: "What kinds of things light you up on trips? Pick all that fit.",
    options: [
      "🥾 Hiking",
      "🚴 Biking",
      "🚶 Walking tours",
      "🏊 Beaches & swimming",
      "🌊 Water activities (kayak, paddle, snorkel)",
      "🎿 Skiing / Snowboarding",
      "🛣️ Scenic drives",
      "🎨 Art & museums",
      "🏛️ Historic & archeological sites",
      "🍷 Wine / Breweries",
      "🎶 Live music / Nightlife",
      "🐾 Wildlife viewing",
      "👨‍👩‍👧 Family‑friendly activities",
      "💆 Spa / Wellness",
      "✨ Other… (free form)"
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
    text: "Do you like having a guide for certain activities — or are you all about going fully independent?",
    options: [
      "Guided outdoor activities",
      "Guided day trips",
      "Guided city tours",
      "Food tours",
      "Wine tours",
      "Cooking classes",
      "❌ Prefer to be fully independent"
    ]
  }
];

// Helper function to get planning questions
export const getPlanningQuestions = (): Question[] => {
  return planningQuestions;
};