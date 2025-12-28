/**
 * UNIVERSAL SEARCH BAR COMPONENT
 * Elderly-friendly search with large input and clear button
 * Reusable across all screens (medications, patients, dependents)
 */

import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  darkMode?: boolean;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  darkMode = false,
  className = '',
}: SearchBarProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search className={`w-5 h-5 sm:w-6 sm:h-6 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />
      </div>
      
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          pl-12 sm:pl-14 pr-12 sm:pr-14
          h-14 sm:h-16
          text-lg sm:text-xl
          ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}
        `}
      />
      
      {value && (
        <Button
          type="button"
          onClick={handleClear}
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0"
          aria-label="Clear search"
        >
          <X className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}

export default SearchBar;
