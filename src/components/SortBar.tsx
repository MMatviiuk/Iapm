/**
 * UNIVERSAL SORT BAR COMPONENT
 * Dropdown sort selector with common sort options
 * Elderly-friendly with large dropdown and clear labels
 */

import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export interface SortOption {
  id: string;
  label: string;
  value: string;
  direction?: 'asc' | 'desc';
}

interface SortBarProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  darkMode?: boolean;
  className?: string;
}

export function SortBar({
  options,
  value,
  onChange,
  darkMode = false,
  className = '',
}: SortBarProps) {
  const currentOption = options.find(opt => opt.value === value);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`text-sm sm:text-base ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Sort by:
      </span>
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`w-48 sm:w-56 h-12 sm:h-14 ${
          darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''
        }`}>
          <div className="flex items-center gap-2">
            {currentOption?.direction === 'asc' ? (
              <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : currentOption?.direction === 'desc' ? (
              <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <ArrowUpDown className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent className={darkMode ? 'bg-gray-800 border-gray-700' : ''}>
          {options.map((option) => (
            <SelectItem
              key={option.id}
              value={option.value}
              className={`h-12 sm:h-14 ${
                darkMode ? 'text-gray-200' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                {option.direction === 'asc' ? (
                  <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : option.direction === 'desc' ? (
                  <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : null}
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/**
 * Common sort options for medications
 */
export const MEDICATION_SORT_OPTIONS: SortOption[] = [
  { id: 'name-asc', label: 'Name (A-Z)', value: 'name-asc', direction: 'asc' },
  { id: 'name-desc', label: 'Name (Z-A)', value: 'name-desc', direction: 'desc' },
  { id: 'time-asc', label: 'Time (Earliest First)', value: 'time-asc', direction: 'asc' },
  { id: 'time-desc', label: 'Time (Latest First)', value: 'time-desc', direction: 'desc' },
  { id: 'meal-timing', label: 'Meal Timing', value: 'meal-timing' },
];

/**
 * Common sort options for patients/dependents
 */
export const PEOPLE_SORT_OPTIONS: SortOption[] = [
  { id: 'name-asc', label: 'Name (A-Z)', value: 'name-asc', direction: 'asc' },
  { id: 'name-desc', label: 'Name (Z-A)', value: 'name-desc', direction: 'desc' },
  { id: 'adherence-asc', label: 'Adherence (Low to High)', value: 'adherence-asc', direction: 'asc' },
  { id: 'adherence-desc', label: 'Adherence (High to Low)', value: 'adherence-desc', direction: 'desc' },
  { id: 'medications-asc', label: 'Medications (Fewest First)', value: 'medications-asc', direction: 'asc' },
  { id: 'medications-desc', label: 'Medications (Most First)', value: 'medications-desc', direction: 'desc' },
];

/**
 * Helper function to sort medications
 */
export function sortMedications(medications: any[], sortValue: string): any[] {
  const sorted = [...medications];

  switch (sortValue) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'time-asc':
      return sorted.sort((a, b) => {
        const timeA = a.time || a.morningTime || '00:00';
        const timeB = b.time || b.morningTime || '00:00';
        return timeA.localeCompare(timeB);
      });
    case 'time-desc':
      return sorted.sort((a, b) => {
        const timeA = a.time || a.morningTime || '00:00';
        const timeB = b.time || b.morningTime || '00:00';
        return timeB.localeCompare(timeA);
      });
    case 'meal-timing':
      const mealOrder = { 'before meal': 0, 'with meal': 1, 'after meal': 2, 'anytime': 3 };
      return sorted.sort((a, b) => {
        const orderA = mealOrder[a.mealTiming as keyof typeof mealOrder] ?? 3;
        const orderB = mealOrder[b.mealTiming as keyof typeof mealOrder] ?? 3;
        return orderA - orderB;
      });
    default:
      return sorted;
  }
}

/**
 * Helper function to sort people (patients/dependents)
 */
export function sortPeople(people: any[], sortValue: string): any[] {
  const sorted = [...people];

  switch (sortValue) {
    case 'name-asc':
      return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    case 'name-desc':
      return sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    case 'adherence-asc':
      return sorted.sort((a, b) => (a.adherence || 0) - (b.adherence || 0));
    case 'adherence-desc':
      return sorted.sort((a, b) => (b.adherence || 0) - (a.adherence || 0));
    case 'medications-asc':
      return sorted.sort((a, b) => (a.medications || 0) - (b.medications || 0));
    case 'medications-desc':
      return sorted.sort((a, b) => (b.medications || 0) - (a.medications || 0));
    default:
      return sorted;
  }
}

export default SortBar;
