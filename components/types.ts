export interface Hotel {
  name: string;
  location: string;
  price: number;
  description: string;
  image: string;
  amenities: string[];
  rating: number;
  reviews: number;
  availability: string;
  booked: boolean;
  website?: string;
  phone?: string;
} 