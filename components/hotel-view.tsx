"use client";

import { motion } from "framer-motion";

interface Hotel {
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
}

interface HotelViewProps {
  hotels: Hotel[];
  searchQuery?: string;
}

export const HotelView = ({ hotels, searchQuery }: HotelViewProps) => {
  return (
    <div className="md:max-w-[600px] max-w-[calc(100dvw-80px)] w-full pb-6">
      <div className="flex flex-col gap-4">
        {searchQuery && (
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
            {hotels.length > 0 
              ? `Found ${hotels.length} hotel(s) for "${searchQuery}"`
              : `No hotels found for "${searchQuery}"`
            }
          </div>
        )}
        
        {hotels.length === 0 ? (
          <div className="text-center text-zinc-500 py-8">
            No hotels found. Try searching by location or hotel name.
          </div>
        ) : (
          hotels.map((hotel, index) => (
            <motion.div
              key={hotel.name}
              className="border rounded-lg overflow-hidden dark:border-zinc-700 border-zinc-200 bg-white dark:bg-zinc-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="aspect-video w-full relative">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white dark:bg-zinc-800 px-2 py-1 rounded text-sm font-semibold">
                  ${hotel.price}/night
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{hotel.name}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-yellow-500">★</span>
                    <span>{hotel.rating}</span>
                    <span className="text-zinc-500">({hotel.reviews})</span>
                  </div>
                </div>
                
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  📍 {hotel.location}
                </p>
                
                <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
                  {hotel.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {hotel.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="text-xs bg-zinc-100 dark:bg-zinc-700 px-2 py-1 rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      hotel.availability === "Available"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {hotel.availability}
                  </span>
                  
                  {hotel.availability === "Available" && !hotel.booked && (
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                      Book Now
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}; 