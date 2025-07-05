import { createContext, useContext } from 'react';
import { Hotel } from './types';

export const HotelClickContext = createContext<((hotel: Hotel) => void) | undefined>(undefined);

export const useHotelClick = () => useContext(HotelClickContext); 