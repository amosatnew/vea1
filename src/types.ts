export interface Event {
  id: string;
  name: string;
  date: string;
  venue: string;
  venueId: string;
  artists: string[];
  artistIds: string[];
  description: string;
  image: string;
  price: number;
  category: string;
  tags: string[];
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  description: string;
  image: string;
  popularEvents: string[];
  eventIds: string[];
  socialLinks: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  tags: string[];
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  address: string;
  capacity: number;
  description: string;
  image: string;
  amenities: string[];
  upcomingEvents: string[];
  eventIds: string[];
  tags: string[];
}

export type SortOption = 'name' | 'date' | 'price' | 'capacity' | 'genre' | 'popularity' | 'location';
export type FilterCategory = 'category' | 'tags' | 'price' | 'genre' | 'amenities' | 'location';
