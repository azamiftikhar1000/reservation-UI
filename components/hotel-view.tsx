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
    <div className="w-full">
      <div className="flex flex-col gap-4">
        {searchQuery && (
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2 text+[200%]">
            {hotels.length > 0 
              ? `Found ${hotels.length} hotel(s) for "${searchQuery}":`
              : `No hotels found for "${searchQuery}"`
            }
          </div>
        )}
        
        {hotels.length === 0 ? (
          <div className="text-center text-zinc-500 py-8">
            {searchQuery
              ? 'No hotels found. Try searching by location or hotel name.'
              : 'Hotels you find will appear here.'}
          </div>
        ) : (
          hotels.map((hotel, index) => (
            <motion.div
              key={hotel.name}
              className="border rounded-lg overflow-hidden dark:border-zinc-700 border-zinc-200 bg-white dark:bg-zinc-800 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Header section: name, rating, reviews, location */}
              <div className="p-4 pb-0">
                <h2 className="no-translate text-pretty text-2xl font-semibold">{hotel.name}</h2>
                <div className="mt-0 text-zinc-500 dark:text-zinc-400 text-sm flex flex-wrap items-center gap-0.5">
                  <span className="flex items-center group">
                    <span className="text-yellow-500 mr-1">
                      {/* Star SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 inline-block align-baseline">
                        <path d="m12.63 4.401 2.044 4.128a.656.656 0 0 0 .527.385l4.513.669a.695.695 0 0 1 .386 1.196l-3.253 3.227a.682.682 0 0 0-.206.617l.785 4.538a.707.707 0 0 1-1.029.746l-4.063-2.147a.758.758 0 0 0-.668 0l-4.063 2.147a.707.707 0 0 1-1.029-.746l.785-4.59a.682.682 0 0 0-.206-.617L3.862 10.78a.695.695 0 0 1 .424-1.196l4.513-.669a.656.656 0 0 0 .527-.385L11.37 4.4a.695.695 0 0 1 1.26 0Z" />
                      </svg>
                    </span>
                    <span className="group-hover:underline">{hotel.rating}</span>
                  </span>
                  <span className="mx-1">·</span>
                  <span className="group-hover:text-foreground">{hotel.reviews} reviews</span>
                  <span className="mx-1">·</span>
                  <span>{hotel.location}</span>
                </div>
                <div className="mt-0 flex items-center leading-tight text-zinc-500 dark:text-zinc-400 text-sm">
                  <div className="flex gap-1 leading-tight">
                    {/* Hotel SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 inline-block align-baseline">
                      <path d="M5.5 11.188h13.875a1.5 1.5 0 0 1 1.5 1.5v3.562H4v-3.563a1.5 1.5 0 0 1 1.5-1.5ZM4 16.25v2.25M20.875 16.25v2.25"></path>
                      <path d="M19.188 11.188V6.125A1.125 1.125 0 0 0 18.063 5H6.813a1.125 1.125 0 0 0-1.125 1.125v5.063"></path>
                      <path d="M9.813 8.375h5.25a.75.75 0 0 1 .75.75v2.063h-6.75V9.124a.75.75 0 0 1 .75-.75Z"></path>
                    </svg>
                    <span className="capitalize">Hotel</span>
                  </div>
                </div>
              </div>

              {/* Image section */}
              <div className="h-48 w-full relative mt-4">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white dark:bg-zinc-800 px-2 py-1 rounded text-sm font-semibold">
                  ${hotel.price}/night
                </div>
              </div>
              
              {/* Details section */}
              <div className="p-4 pt-2">
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