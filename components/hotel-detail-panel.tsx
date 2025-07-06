"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, MapPinIcon, StarIcon, PhotoIcon } from './icons';
import { Hotel } from './types';

interface HotelDetailPanelProps {
  hotel: Hotel | null;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const HotelDetailPanel: React.FC<HotelDetailPanelProps> = ({
  hotel,
  isOpen,
  onClose,
  className = ""
}) => {
  const [tab, setTab] = useState<'overview' | 'amenities' | 'location'>('overview');
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [checkIn, setCheckIn] = useState('Sep 24');
  const [checkOut, setCheckOut] = useState('Sep 28');
  const [adults, setAdults] = useState(2);

  if (!hotel) return null;

  const generateImageGrid = () => {
    const baseImage = hotel.image;
    return [baseImage, baseImage, baseImage, baseImage, baseImage];
  };

  const images = generateImageGrid();
  const descriptionPreview = hotel.description.length > 200 && !showFullDesc
    ? hotel.description.slice(0, 200) + '...'
    : hotel.description;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`fixed inset-y-0 right-0 w-full bg-white shadow-2xl z-50 overflow-y-auto ${className}`}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white p-4 z-10">
            <div className="flex items-center justify-between">
              <span className="inline-block px-7 py-2 rounded-full bg-black text-white text-sm font-bold">Hotel</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-6 w-full">
            {/* Hotel Info Header (above image grid) */}
            <div className="mb-4">
              <h2 className="text-3xl font-bold text-zinc-900">{hotel.name}</h2>
              <div className="flex items-center gap-2 text-zinc-800 text-base mt-1">
                <span className="flex items-center gap-1 font-semibold">
                  <StarIcon className="w-5 h-5 text-black" />
                  {hotel.rating}
                </span>
                <span className="text-zinc-500">·</span>
                <span className="text-zinc-500">{hotel.reviews} reviews</span>
                <span className="text-zinc-500">·</span>
                <span className="text-zinc-500 flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4" />
                  {hotel.location}
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500 text-base mt-1">
                <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5.5 11.188h13.875a1.5 1.5 0 0 1 1.5 1.5v3.562H4v-3.563a1.5 1.5 0 0 1 1.5-1.5ZM4 16.25v2.25M20.875 16.25v2.25"></path><path d="M19.188 11.188V6.125A1.125 1.125 0 0 0 18.063 5H6.813a1.125 1.125 0 0 0-1.125 1.125v5.063"></path><path d="M9.813 8.375h5.25a.75.75 0 0 1 .75.75v2.063h-6.75V9.124a.75.75 0 0 1 .75-.75Z"></path></svg>
                Hotel
              </div>
            </div>

            {/* Image Grid */}
            <div className="relative grid grid-cols-4 grid-rows-2 gap-2 rounded-xl overflow-hidden w-full">
              <div className="col-span-2 row-span-2 relative">
                <img
                  src={images[0]}
                  alt={hotel.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              {images.slice(1, 5).map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`${hotel.name} - Photo ${index + 2}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
              <div className="absolute bottom-2 right-2">
                <button className="bg-white text-sm px-3 py-1 rounded-full shadow hover:bg-gray-100">
                  Show all photos
                </button>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex flex-col md:flex-row gap-8 w-full">
              {/* Left: Overview and Details */}
              <div className="flex-[0.65] min-w-0 space-y-6">
                {/* Tabs */}
                <div className="flex gap-3 text-sm mb-2">
                  {['overview', 'amenities', 'location'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t as any)}
                      className={`px-3 py-1 rounded-full transition font-medium ${tab === t ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700'}`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Overview */}
                {tab === 'overview' && (
                  <div className="space-y-4">
                    <div className="text-zinc-700 leading-relaxed">
                      {descriptionPreview}
                      {hotel.description.length > 200 && !showFullDesc && (
                        <button
                          className="ml-2 text-blue-600 underline text-xs"
                          onClick={() => setShowFullDesc(true)}
                        >
                          Read more
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {tab === 'amenities' && (
                  <div className="grid grid-cols-2 gap-2">
                    {hotel.amenities.map((a, i) => (
                      <div key={i} className="text-sm text-zinc-700">✓ {a}</div>
                    ))}
                  </div>
                )}

                {/* Location */}
                {tab === 'location' && (
                  <div className="h-48 w-full bg-zinc-200 rounded-lg flex items-center justify-center text-xs text-zinc-500">
                    Map Placeholder
                  </div>
                )}

                {/* Contact Details */}
                <hr className="my-6 border-zinc-200" />
                <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-6 text-sm text-zinc-700">
                  {/* Address: spans 2 rows on desktop */}
                  <div className="flex items-start gap-3 md:row-span-2">
                    <MapPinIcon className="w-5 h-5 mt-0.5 text-zinc-500" />
                    <div>
                      <div className="font-semibold text-zinc-900 mb-0.5">Address</div>
                      <div className="text-zinc-600 whitespace-pre-line">
                        {hotel.location}
                      </div>
                    </div>
                  </div>
                  {/* Website: top right */}
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 transform-cpu w-5 h-5 mt-0.5 text-zinc-500"><path d="M20 13.23v5.54A1.23 1.23 0 0 1 18.77 20H5.23A1.23 1.23 0 0 1 4 18.77V5.23A1.23 1.23 0 0 1 5.23 4h5.54M15.692 4H20v4.308M20 4l-8 8"></path></svg>
                    <div>
                      <div className="font-semibold text-zinc-900 mb-0.5">Website</div>
                      <div className="text-zinc-600">
                        <a href={hotel.website || 'https://www.example.com'} target="_blank" rel="noopener noreferrer" className="underline">
                          {(hotel.website || 'https://www.example.com').replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* Phone: bottom right */}
                  <div className="flex items-start gap-3 md:col-start-2 md:row-start-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 transform-cpu w-5 h-5 mt-0.5 text-zinc-500"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.1.75.3 1.49.57 2.2a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.88-1.88a2 2 0 0 1 2.11-.45c.71.27 1.45.47 2.2.57A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <div>
                      <div className="font-semibold text-zinc-900 mb-0.5">Phone</div>
                      <div className="text-zinc-600">
                        {hotel.phone || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="my-6 border-zinc-200" />
              </div>

              {/* Right: Booking Card */}
              <div className="flex-[0.35] min-w-[260px] max-w-sm md:max-w-xs flex-shrink-0">
                <div className="bg-white shadow-2xl ring-1 ring-zinc-200 rounded-xl p-6 flex flex-col gap-4 sticky top-24">
                  {/* Booking Details Box */}
                  <div className="bg-zinc-50 rounded-xl border border-zinc-200 mb-4">
                    <div className="grid grid-cols-2 divide-x divide-zinc-200">
                      <div className="p-3 flex flex-col items-start">
                        <div className="text-xs text-zinc-500">Check in</div>
                        <div className="font-semibold text-base text-zinc-900">{checkIn}</div>
                      </div>
                      <div className="p-3 flex flex-col items-start">
                        <div className="text-xs text-zinc-500">Check out</div>
                        <div className="font-semibold text-base text-zinc-900">{checkOut}</div>
                      </div>
                    </div>
                    <div className="border-t border-zinc-200 mx-5" />
                    <div className="px-3 pb-2 pt-1 text-sm text-zinc-500">{adults} adult{adults > 1 ? 's' : ''}</div>
                  </div>
                  {/* Price Row */}
                  {/* <div className="flex items-end gap-2 mb-6">
                    <span className="text-3xl font-extrabold text-zinc-900">${hotel.price}</span>
                    <span className="text-base font-normal text-zinc-500 mb-0.5">per night</span>
                  </div> */}
                  <div className="flex flex-col gap-4">
                    <button className="w-full bg-black text-white py-2 rounded-full font-semibold hover:bg-zinc-900 transition">Book</button>
                    <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-100 via-white to-purple-100 text-zinc-700 py-2 rounded-full font-medium border border-zinc-200">+ Add to trip</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
