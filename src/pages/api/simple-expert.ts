export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Mock expert based on input
  const formData = req.body;
  let expert;

  if (formData.destination?.toLowerCase().includes('utah')) {
    expert = {
      id: '1',
      name: 'Lura Snow',
      profession: 'Utah Operations Manager & Guide',
      email: 'lura.snow@gmail.com',
      shortBio: 'Lura has spent her entire life exploring the outdoors, from childhood camping trips to 16 years as a professional guide across Utah and Arizona. She oversees multi-day backpacking and basecamp trips through the region\'s most stunning landscapes.',
      profileUrl: 'https://www.outdoorable.co/expert/lura-snow',
      matchScore: 92,
      matchedTags: ['Utah Expert', 'Hiking', 'Family Friendly', 'Backcountry']
    };
  } else if (formData.experienceLevel?.toLowerCase().includes('extreme')) {
    expert = {
      id: '2',
      name: 'Owen Eigenbrot',
      profession: 'Long Distance Backpacker',
      email: 'hikefordays@gmail.com',
      shortBio: 'Owen has hiked over 13,000 miles since 2015, including some of the most rugged and rewarding long-distance trails in the world. Whether you\'re planning your first backpacking trip or a thru-hike, he can help with route selection and gear.',
      profileUrl: 'https://www.outdoorable.co/expert/owen-eigenbrot',
      matchScore: 95,
      matchedTags: ['Extreme Sports', 'Solo Travel', 'Backpacking', 'Long Distance']
    };
  } else {
    expert = {
      id: '3',
      name: 'Dino Katalenic',
      profession: 'Professional Active Travel Guide',
      email: 'dino@dinokatalenic.com',
      shortBio: 'Dino spent the past 15+ years designing and leading itineraries across Europe, South America, and southern Africa, blending world-class dining and active adventure with immersive cultural experiences.',
      profileUrl: 'https://www.outdoorable.co/expert/dino-katalenic',
      matchScore: 87,
      matchedTags: ['Europe', 'Luxury Travel', 'Cultural Tours', 'Multi-lingual']
    };
  }

  return res.status(200).json({
    success: true,
    expert: expert
  });
}