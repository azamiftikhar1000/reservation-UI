"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Hotel } from "./types";
import { HotelIcon } from "./icons";
import { useState, useEffect, useRef } from "react";

interface HotelViewProps {
  hotels: Hotel[];
  searchQuery?: string;
  onHotelClick?: (hotel: Hotel) => void;
}

const TAGS = [
  "For you",
  "Hotels",
  "People",
  "Things to do",
  "|",
  "Guides",
  // "People"
];

// Mock data for People, Things to do, Guides
const PEOPLE = [
  { name: "Alice Johnson", role: "Concierge", image: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Bob Smith", role: "Manager", image: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Carol Lee", role: "Chef", image: "https://randomuser.me/api/portraits/women/65.jpg" },
  { name: "David Kim", role: "Receptionist", image: "https://randomuser.me/api/portraits/men/76.jpg" },
  { name: "Eva Green", role: "Housekeeping", image: "https://randomuser.me/api/portraits/women/12.jpg" },
  { name: "Frank Miller", role: "Bellhop", image: "https://randomuser.me/api/portraits/men/23.jpg" },
];
const THINGS = [
  { title: "Visit the Rooftop Bar", desc: "Enjoy city views and cocktails.", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400" },
  { title: "Relax at the Spa", desc: "Full-service spa and wellness.", image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400" },
  { title: "Swim in the Pool", desc: "Heated outdoor pool.", image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400" },
  { title: "Fitness Center", desc: "Modern gym facilities.", image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400" },
  { title: "Guided City Tour", desc: "Explore local attractions.", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400" },
  { title: "Fine Dining", desc: "Award-winning restaurant.", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400" },
];
const GUIDES = [
  { title: "New York Guide", desc: "Top places to visit in NYC.", image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400" },
  { title: "Paris Guide", desc: "Must-see attractions in Paris.", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400" },
  { title: "LA Guide", desc: "Explore Los Angeles.", image: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=400" },
  { title: "Chicago Guide", desc: "Best of Chicago.", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400" },
  { title: "Miami Guide", desc: "Miami's hidden gems.", image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400" },
  { title: "London Guide", desc: "London for first-timers.", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400" },
];

export const HotelView = ({ hotels, searchQuery, onHotelClick }: HotelViewProps) => {
  const [activeTag, setActiveTag] = useState("For you");
  const [search, setSearch] = useState("");
  const INITIAL_VISIBLE = 6;
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [visiblePeople, setVisiblePeople] = useState(INITIAL_VISIBLE);
  const [visibleThings, setVisibleThings] = useState(INITIAL_VISIBLE);
  const [visibleGuides, setVisibleGuides] = useState(INITIAL_VISIBLE);

  // Filter hotels by search
  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(search.toLowerCase()) ||
    hotel.location.toLowerCase().includes(search.toLowerCase())
  );
  const hotelsToShow = filteredHotels.slice(0, visibleCount);

  // Helper to render hotel cards with staggered animation
  const renderHotels = (hotelsList: Hotel[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {hotelsList.map((hotel, index) => (
        <motion.div
          key={hotel.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: index * 0.15, 
            ease: "easeOut" 
          }}
          className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-zinc-200 cursor-pointer group overflow-hidden"
          onClick={() => onHotelClick?.(hotel)}
        >
          <div className="relative h-56">
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <button
              className="absolute top-3 right-3 bg-white/80 rounded-full p-2 shadow hover:bg-white"
              onClick={e => e.stopPropagation()}
              aria-label="Add to favorites"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-500 hover:text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.014-4.5-4.5-4.5-1.74 0-3.223 1.01-3.972 2.475C11.223 4.76 9.74 3.75 8 3.75 5.514 3.75 3.5 5.765 3.5 8.25c0 7.22 8.25 11.25 8.25 11.25s8.25-4.03 8.25-11.25z" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold truncate">{hotel.name}</h3>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-yellow-500">★</span>
                <span className="font-semibold">{hotel.rating}</span>
                <span className="text-zinc-400">({hotel.reviews})</span>
              </div>
            </div>
            <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 transform-cpu size-[1em] relative mr-0.5 mt-[-.125em] inline-block text-[1.25em]">
                <path d="M5.5 11.188h13.875a1.5 1.5 0 0 1 1.5 1.5v3.562H4v-3.563a1.5 1.5 0 0 1 1.5-1.5ZM4 16.25v2.25M20.875 16.25v2.25"></path>
                <path d="M19.188 11.188V6.125A1.125 1.125 0 0 0 18.063 5H6.813a1.125 1.125 0 0 0-1.125 1.125v5.063"></path>
                <path d="M9.813 8.375h5.25a.75.75 0 0 1 .75.75v2.063h-6.75V9.124a.75.75 0 0 1 .75-.75Z"></path>
              </svg>
              Hotel
            </div>
            <div className="text-xs text-zinc-500 mb-2 truncate">
              {hotel.location}
            </div>
            <div className="text-base font-bold text-zinc-900 mb-1">
              ${hotel.price} <span className="text-xs font-normal text-zinc-500">night</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Helper to render people cards with staggered animation
  const renderPeople = (peopleList: typeof PEOPLE) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {peopleList.map((person, index) => (
        <motion.div
          key={person.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: index * 0.15, 
            ease: "easeOut" 
          }}
          className="bg-white rounded-2xl shadow-md border border-zinc-200 p-4 flex flex-col items-center"
        >
          <img src={person.image} alt={person.name} className="w-20 h-20 rounded-full object-cover mb-2" />
          <div className="font-bold text-base mb-1">{person.name}</div>
          <div className="text-zinc-500 text-sm">{person.role}</div>
        </motion.div>
      ))}
    </div>
  );

  // Helper to render things/guides cards with staggered animation
  const renderThings = (list: typeof THINGS | typeof GUIDES) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {list.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: index * 0.15, 
            ease: "easeOut" 
          }}
          className="bg-white rounded-2xl shadow-md border border-zinc-200 p-4 flex flex-col items-center"
        >
          <img src={item.image} alt={item.title} className="w-full h-32 object-cover rounded-lg mb-2" />
          <div className="font-bold text-base mb-1">{item.title}</div>
          <div className="text-zinc-500 text-sm text-center">{item.desc}</div>
        </motion.div>
      ))}
    </div>
  );

  // Section rendering logic
  const renderSection = (section: string) => {
    switch (section) {
      case "Hotels": {
        const hasMore = hotels.length > visibleCount;
        return (
          <section id="hotels-section" className="mb-12">
            <h2 className="text-xl font-bold mb-4">Hotels</h2>
            {renderHotels(hotels.slice(0, visibleCount))}
            {hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  className="px-8 py-3 rounded-full border border-zinc-300 bg-white hover:bg-zinc-50 text-base font-medium"
                  onClick={() => setVisibleCount(c => c + 6)}
                >See more</button>
              </div>
            )}
          </section>
        );
      }
      case "People": {
        const hasMore = PEOPLE.length > visiblePeople;
        return (
          <section id="people-section" className="mb-12">
            <h2 className="text-xl font-bold mb-4">People</h2>
            {renderPeople(PEOPLE.slice(0, visiblePeople))}
            {hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  className="px-8 py-3 rounded-full border border-zinc-300 bg-white hover:bg-zinc-50 text-base font-medium"
                  onClick={() => setVisiblePeople(c => c + 6)}
                >See more</button>
              </div>
            )}
          </section>
        );
      }
      case "Things to do": {
        const hasMore = THINGS.length > visibleThings;
        return (
          <section id="things-section" className="mb-12">
            <h2 className="text-xl font-bold mb-4">Things to do</h2>
            {renderThings(THINGS.slice(0, visibleThings))}
            {hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  className="px-8 py-3 rounded-full border border-zinc-300 bg-white hover:bg-zinc-50 text-base font-medium"
                  onClick={() => setVisibleThings(c => c + 6)}
                >See more</button>
              </div>
            )}
          </section>
        );
      }
      case "Guides": {
        const hasMore = GUIDES.length > visibleGuides;
        return (
          <section id="guides-section" className="mb-12">
            <h2 className="text-xl font-bold mb-4">Guides</h2>
            {renderThings(GUIDES.slice(0, visibleGuides))}
            {hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  className="px-8 py-3 rounded-full border border-zinc-300 bg-white hover:bg-zinc-50 text-base font-medium"
                  onClick={() => setVisibleGuides(c => c + 6)}
                >See more</button>
              </div>
            )}
          </section>
        );
      }
      default:
        return null;
    }
  };

  // Main render
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 bg-white">
      {/* Header and Search Bar always visible */}
       {/* Category Tag */}
       {/* {(searchQuery && searchQuery.trim().length > 0) && (
       <div className="mb-4">
            <span className="inline-block px-7 py-2 rounded-full bg-black text-white text-sm font-bold">Hotel</span>
        </div>
        )} */}
      <div className="flex items-center justify-between mb-6">
      {(!searchQuery || searchQuery.trim().length === 0) && (
        <h1 className="text-2xl font-bold flex items-center gap-1">
          Hotels
          <svg className="inline-block w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </h1>
      )}
        {(!searchQuery || searchQuery.trim().length === 0) && (
          <button className="flex items-center gap-2 border border-zinc-300 rounded-full px-4 py-2 bg-white hover:bg-zinc-50 text-sm font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75" /></svg>
            Filters
          </button>
        )}
      </div>
      {/* Search Bar always visible */}
      <div className="flex items-center mb-4">
        <div className="flex items-center bg-zinc-100 rounded-full w-full px-4 py-3">
          <svg className="text-zinc-500 w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-base"
          />
        </div>
      </div>
      {/* Tag Bar - horizontally scrollable on mobile with right arrow indicator */}
      {(!searchQuery || searchQuery.trim().length === 0) && (
        <div className="relative mb-8 border-b-0">
          <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-hide pr-8 sm:pr-0 pb-3 pt-3">
            {TAGS.map((tag, idx) =>
              tag === "|" ? (
                <span key={idx} className="mx-2 h-5 border-l border-zinc-300 inline-block align-middle" />
              ) : (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-4 py-1 rounded-full text-sm font-bold transition-colors inline-block align-middle ${
                    activeTag === tag
                      ? "bg-black text-white font-bold"
                      : "bg-transparent text-zinc-800 hover:bg-zinc-100"
                  }`}
                >
                  {tag}
                </button>
              )
            )}
          </div>
          {/* Right arrow indicator for overflow */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-8 flex items-center justify-end bg-gradient-to-l from-white via-white/80 to-transparent sm:hidden">
            <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>
      )}
      {/* Main content: show hotel grid if searchQuery, else multi-section */}
      {(searchQuery && searchQuery.trim().length > 0) ? (
        // Only show hotel grid with filtered hotels
        filteredHotels.length === 0 ? (
          <div className="text-center text-zinc-500 py-16 text-lg">
            No hotels found. Try searching by location or hotel name.
          </div>
        ) : (
          <>
            {renderHotels(filteredHotels)}
            {filteredHotels.length > 6 && (
              <div className="flex justify-center mt-6">
                <button className="px-8 py-3 rounded-full border border-zinc-300 bg-white hover:bg-zinc-50 text-base font-medium">See more</button>
              </div>
            )}
          </>
        )
      ) : (
        // Multi-section For You or single section for tag with fade transitions
        <AnimatePresence mode="wait">
          {activeTag === "For you" ? (
            <motion.div
              key="for-you"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {renderSection("Hotels")}
              {renderSection("People")}
              {renderSection("Things to do")}
              {renderSection("Guides")}
            </motion.div>
          ) : (
            <motion.div
              key={activeTag}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {renderSection(activeTag)}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}; 