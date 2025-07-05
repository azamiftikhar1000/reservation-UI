"use client";

import React from 'react';
import { HotelIcon } from './icons';
import { Hotel } from './types';
import { useHotelClick } from './HotelClickContext';

interface HotelLinkProps {
  hotel: Hotel;
  children: React.ReactNode;
  className?: string;
  onClick?: (hotel: Hotel) => void;
}

export const HotelLink: React.FC<HotelLinkProps> = ({ 
  hotel, 
  children, 
  className = "",
  onClick 
}) => {
  const contextClick = useHotelClick();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("HotelLink clicked:", hotel);
    if (onClick) {
      onClick(hotel);
    } else if (contextClick) {
      contextClick(hotel);
    }
  };
  
  return (
    // <button onClick={() => alert('Clicked!')}>Test Button</button>
    <button
      className={`draggable-place relative -mx-1 -my-0.5 select-text items-baseline rounded-full px-1 py-0.5 font-semibold no-underline transition-colors hover:bg-foreground/5 data-[state=open]:bg-foreground/5 cursor-pointer ${className}`}
      onClick={handleClick}
      type="button"
    >
      <span className="whitespace-nowrap">
        <HotelIcon />
        {children}
      </span>
    </button>
  );
}; 