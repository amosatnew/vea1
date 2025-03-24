import { Artist, Event, Venue } from './types';

// Mock Artists Data
export const artists: Artist[] = [
  {
    id: 'art1',
    name: 'Cosmic Vibe',
    genre: 'Electronic',
    description: 'An electronic music producer and DJ known for atmospheric soundscapes and energetic performances.',
    image: 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?q=80&w=800&auto=format&fit=crop',
    popularEvents: ['Neon Nights', 'Bass Dimension'],
    eventIds: ['evt2', 'evt5'],
    socialLinks: {
      instagram: '@cosmicvibe',
      twitter: '@cosmic_vibe',
      website: 'cosmicvibe.com'
    },
    tags: ['electronic', 'dj', 'producer']
  },
  {
    id: 'art2',
    name: 'Melody Ravens',
    genre: 'Indie Rock',
    description: 'A four-piece indie rock band bringing raw energy and introspective lyrics to the stage.',
    image: 'https://images.unsplash.com/photo-1598387846148-47e82a5e751a?q=80&w=800&auto=format&fit=crop',
    popularEvents: ['Rock Revolution', 'Indie Summit'],
    eventIds: ['evt1', 'evt4'],
    socialLinks: {
      instagram: '@melodyravens',
      twitter: '@melody_ravens'
    },
    tags: ['indie', 'rock', 'band', 'live']
  },
  {
    id: 'art3',
    name: 'Luna Frost',
    genre: 'Pop',
    description: 'Rising pop star known for powerful vocals and captivating stage presence.',
    image: 'https://images.unsplash.com/photo-1534086156751-1fd6c5938c2d?q=80&w=800&auto=format&fit=crop',
    popularEvents: ['Pop Sensation Tour', 'Summer Vibes Festival'],
    eventIds: ['evt3', 'evt6'],
    socialLinks: {
      instagram: '@lunafrost',
      twitter: '@luna_frost',
      website: 'lunafrost.com'
    },
    tags: ['pop', 'vocal', 'performance']
  },
  {
    id: 'art4',
    name: 'Quantum Beats',
    genre: 'Hip Hop',
    description: 'Innovative hip hop collective pushing boundaries with their unique production and lyrical prowess.',
    image: 'https://images.unsplash.com/photo-1618478594486-c65b899c4936?q=80&w=800&auto=format&fit=crop',
    popularEvents: ['Flow Masters', 'Rhythm & Rhymes'],
    eventIds: ['evt2', 'evt7'],
    socialLinks: {
      instagram: '@quantumbeats',
      twitter: '@quantum_beats'
    },
    tags: ['hiphop', 'rap', 'collective']
  },
  {
    id: 'art5',
    name: 'Echo Valley',
    genre: 'Folk',
    description: 'Folk ensemble with roots in traditional sounds and contemporary storytelling.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    popularEvents: ['Woodland Sessions', 'Acoustic Journeys'],
    eventIds: ['evt5', 'evt8'],
    socialLinks: {
      instagram: '@echovalley',
      website: 'echovalley.net'
    },
    tags: ['folk', 'acoustic', 'traditional']
  }
];

// Mock Venues Data
export const venues: Venue[] = [
  {
    id: 'ven1',
    name: 'Nebula Arena',
    location: 'Los Angeles',
    address: '123 Starlight Blvd, Los Angeles, CA',
    capacity: 15000,
    description: 'Massive arena venue featuring state-of-the-art sound systems and immersive lighting.',
    image: 'https://images.unsplash.com/photo-1575900693760-4c7206bffeef?q=80&w=800&auto=format&fit=crop',
    amenities: ['VIP areas', 'Food court', 'Parking', 'Accessible facilities'],
    upcomingEvents: ['Rock Revolution', 'Pop Sensation Tour'],
    eventIds: ['evt1', 'evt3'],
    tags: ['large', 'arena', 'modern']
  },
  {
    id: 'ven2',
    name: 'Twilight Club',
    location: 'New York',
    address: '456 Downtown Ave, New York, NY',
    capacity: 800,
    description: 'Intimate club venue with excellent acoustics and vibrant atmosphere.',
    image: 'https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?q=80&w=800&auto=format&fit=crop',
    amenities: ['Bar service', 'Dance floor', 'VIP booths'],
    upcomingEvents: ['Neon Nights', 'Flow Masters'],
    eventIds: ['evt2', 'evt7'],
    tags: ['club', 'intimate', 'nightlife']
  },
  {
    id: 'ven3',
    name: 'Harmony Hall',
    location: 'Chicago',
    address: '789 Music Row, Chicago, IL',
    capacity: 2500,
    description: 'Historic concert hall known for perfect acoustics and classical architecture.',
    image: 'https://images.unsplash.com/photo-1588693273928-92d5b0c24315?q=80&w=800&auto=format&fit=crop',
    amenities: ['Premium seating', 'Bar service', 'Coat check', 'Historical tours'],
    upcomingEvents: ['Indie Summit', 'Acoustic Journeys'],
    eventIds: ['evt4', 'evt8'],
    tags: ['historic', 'acoustic', 'seated']
  },
  {
    id: 'ven4',
    name: 'Horizon Amphitheater',
    location: 'Miami',
    address: '321 Beachside Dr, Miami, FL',
    capacity: 10000,
    description: 'Stunning outdoor venue with ocean views and tropical surroundings.',
    image: 'https://images.unsplash.com/photo-1578509557324-c49c535cea38?q=80&w=800&auto=format&fit=crop',
    amenities: ['Lawn seating', 'Premium pavilion', 'Food vendors', 'Spectacular views'],
    upcomingEvents: ['Bass Dimension', 'Summer Vibes Festival'],
    eventIds: ['evt5', 'evt6'],
    tags: ['outdoor', 'amphitheater', 'scenic']
  },
  {
    id: 'ven5',
    name: 'Velvet Lounge',
    location: 'Austin',
    address: '555 Music Lane, Austin, TX',
    capacity: 300,
    description: 'Cozy lounge featuring local talent and specialty cocktails in a vintage setting.',
    image: 'https://images.unsplash.com/photo-1603380380982-40d14d079366?q=80&w=800&auto=format&fit=crop',
    amenities: ['Craft cocktails', 'Intimate stage', 'Vintage decor'],
    upcomingEvents: ['Rhythm & Rhymes', 'Woodland Sessions'],
    eventIds: ['evt7', 'evt8'],
    tags: ['lounge', 'cozy', 'vintage', 'cocktails']
  }
];

// Mock Events Data
export const events: Event[] = [
  {
    id: 'evt1',
    name: 'Rock Revolution',
    date: '2025-04-15T19:00:00',
    venue: 'Nebula Arena',
    venueId: 'ven1',
    artists: ['Melody Ravens'],
    artistIds: ['art2'],
    description: 'A high-energy rock concert featuring the best indie talents in the industry.',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?q=80&w=800&auto=format&fit=crop',
    price: 75,
    category: 'Concert',
    tags: ['rock', 'live music', 'indie']
  },
  {
    id: 'evt2',
    name: 'Neon Nights',
    date: '2025-04-18T22:00:00',
    venue: 'Twilight Club',
    venueId: 'ven2',
    artists: ['Cosmic Vibe', 'Quantum Beats'],
    artistIds: ['art1', 'art4'],
    description: 'Immersive electronic music experience with stunning visuals and top DJs.',
    image: 'https://images.unsplash.com/photo-1619229666372-3c26c399a733?q=80&w=800&auto=format&fit=crop',
    price: 45,
    category: 'Club Night',
    tags: ['electronic', 'dj', 'nightlife']
  },
  {
    id: 'evt3',
    name: 'Pop Sensation Tour',
    date: '2025-04-22T20:00:00',
    venue: 'Nebula Arena',
    venueId: 'ven1',
    artists: ['Luna Frost'],
    artistIds: ['art3'],
    description: 'Luna Frost brings her captivating pop performance to the big stage.',
    image: 'https://images.unsplash.com/photo-1508252592163-5d3c3c559387?q=80&w=800&auto=format&fit=crop',
    price: 85,
    category: 'Concert',
    tags: ['pop', 'tour', 'performance']
  },
  {
    id: 'evt4',
    name: 'Indie Summit',
    date: '2025-04-29T19:30:00',
    venue: 'Harmony Hall',
    venueId: 'ven3',
    artists: ['Melody Ravens'],
    artistIds: ['art2'],
    description: 'A showcase of the best indie talent from around the country.',
    image: 'https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=800&auto=format&fit=crop',
    price: 55,
    category: 'Festival',
    tags: ['indie', 'showcase', 'multiple artists']
  },
  {
    id: 'evt5',
    name: 'Bass Dimension',
    date: '2025-05-05T21:00:00',
    venue: 'Horizon Amphitheater',
    venueId: 'ven4',
    artists: ['Cosmic Vibe', 'Echo Valley'],
    artistIds: ['art1', 'art5'],
    description: 'Experience deep bass and electronic sounds in a stunning outdoor setting.',
    image: 'https://images.unsplash.com/photo-1574861854164-896b8b05d0a9?q=80&w=800&auto=format&fit=crop',
    price: 65,
    category: 'Concert',
    tags: ['electronic', 'bass', 'outdoor']
  },
  {
    id: 'evt6',
    name: 'Summer Vibes Festival',
    date: '2025-05-12T14:00:00',
    venue: 'Horizon Amphitheater',
    venueId: 'ven4',
    artists: ['Luna Frost'],
    artistIds: ['art3'],
    description: 'All-day festival celebrating summer with music, art, and food.',
    image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=800&auto=format&fit=crop',
    price: 95,
    category: 'Festival',
    tags: ['festival', 'summer', 'all-day']
  },
  {
    id: 'evt7',
    name: 'Flow Masters',
    date: '2025-05-17T20:30:00',
    venue: 'Twilight Club',
    venueId: 'ven2',
    artists: ['Quantum Beats'],
    artistIds: ['art4'],
    description: 'Hip hop showcase featuring lyrical talents and beats.',
    image: 'https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?q=80&w=800&auto=format&fit=crop',
    price: 40,
    category: 'Concert',
    tags: ['hiphop', 'rap', 'urban']
  },
  {
    id: 'evt8',
    name: 'Woodland Sessions',
    date: '2025-05-25T18:00:00',
    venue: 'Velvet Lounge',
    venueId: 'ven5',
    artists: ['Echo Valley'],
    artistIds: ['art5'],
    description: 'Intimate acoustic sessions in a cozy setting.',
    image: 'https://images.unsplash.com/photo-1621618953873-aaead2d82c0d?q=80&w=800&auto=format&fit=crop',
    price: 35,
    category: 'Acoustic',
    tags: ['folk', 'acoustic', 'intimate']
  }
];

// Helper function to get all unique categories
export const getCategories = (): string[] => {
  const categories = events.map(event => event.category);
  return [...new Set(categories)];
};

// Helper function to get all unique tags for a specific type
export const getTags = (type: 'events' | 'artists' | 'venues'): string[] => {
  let allTags: string[] = [];

  if (type === 'events') {
    events.forEach(event => {
      allTags = [...allTags, ...event.tags];
    });
  } else if (type === 'artists') {
    artists.forEach(artist => {
      allTags = [...allTags, ...artist.tags];
    });
  } else if (type === 'venues') {
    venues.forEach(venue => {
      allTags = [...allTags, ...venue.tags];
    });
  }

  return [...new Set(allTags)];
};

// Helper function to get locations
export const getLocations = (): string[] => {
  const locations = venues.map(venue => venue.location);
  return [...new Set(locations)];
};

// Helper function to get genres
export const getGenres = (): string[] => {
  const genres = artists.map(artist => artist.genre);
  return [...new Set(genres)];
};

// Helper function to get price ranges
export const getPriceRanges = (): string[] => {
  return [
    'Under $40',
    '$40 - $60',
    '$60 - $80',
    '$80 - $100',
    '$100+'
  ];
};

// Helper function to get amenities
export const getAmenities = (): string[] => {
  let allAmenities: string[] = [];
  venues.forEach(venue => {
    allAmenities = [...allAmenities, ...venue.amenities];
  });
  return [...new Set(allAmenities)];
};
