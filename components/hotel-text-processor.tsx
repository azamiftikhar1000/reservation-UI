"use client";

import React from 'react';
import { HotelLink } from './hotel-link';
import { Hotel } from './types';

interface ProcessedTextSegment {
  type: 'text' | 'hotel';
  content: string;
  hotel?: Hotel;
}

export const processTextForHotels = (text: string, hotels: Hotel[]): ProcessedTextSegment[] => {
  const segments: ProcessedTextSegment[] = [];
  let remainingText = text;

  // Remove markdown bold/italic from the text for matching
  remainingText = remainingText.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');

  // Sort hotels by name length (longest first) to avoid partial matches
  const sortedHotels = [...hotels].sort((a, b) => b.name.length - a.name.length);

  while (remainingText.length > 0) {
    let foundHotel = false;
    let earliestMatch = { hotel: null as Hotel | null, index: -1 };

    // Find the earliest hotel match in the remaining text
    for (const hotel of sortedHotels) {
      const index = remainingText.toLowerCase().indexOf(hotel.name.toLowerCase());
      if (index !== -1 && (earliestMatch.index === -1 || index < earliestMatch.index)) {
        earliestMatch = { hotel, index };
      }
    }

    if (earliestMatch.hotel && earliestMatch.index !== -1) {
      // Add text before the hotel name
      if (earliestMatch.index > 0) {
        segments.push({
          type: 'text',
          content: remainingText.substring(0, earliestMatch.index)
        });
      }

      // Add the hotel segment
      segments.push({
        type: 'hotel',
        content: earliestMatch.hotel.name,
        hotel: earliestMatch.hotel
      });

      // Update remaining text
      remainingText = remainingText.substring(earliestMatch.index + earliestMatch.hotel.name.length);
      foundHotel = true;
    }

    if (!foundHotel) {
      // No more hotels found, add remaining text
      segments.push({
        type: 'text',
        content: remainingText
      });
      break;
    }
  }

  return segments;
};

interface HotelTextProcessorProps {
  text: string;
  hotels: Hotel[];
  className?: string;
  onHotelClick?: (hotel: Hotel) => void;
}

export const HotelTextProcessor: React.FC<HotelTextProcessorProps> = ({ 
  text, 
  hotels, 
  className = "",
  onHotelClick
}) => {
  const segments = processTextForHotels(text, hotels);

  console.log("HotelTextProcessor segments:", segments);

  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (segment.type === 'hotel' && segment.hotel) {
          return (
            <HotelLink key={index} hotel={segment.hotel} onClick={onHotelClick}>
              {segment.content}
            </HotelLink>
          );
        }
        return <span key={index}>{segment.content}</span>;
      })}
    </span>
  );
}; 