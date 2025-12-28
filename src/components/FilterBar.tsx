/**
 * UNIVERSAL FILTER BAR COMPONENT
 * Multi-select filters with pills UI
 * Elderly-friendly with large touch targets
 */

import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

interface FilterBarProps {
  groups: FilterGroup[];
  selectedFilters: Record<string, string[]>;
  onChange: (groupId: string, values: string[]) => void;
  onClear?: () => void;
  darkMode?: boolean;
  className?: string;
}

export function FilterBar({
  groups,
  selectedFilters,
  onChange,
  onClear,
  darkMode = false,
  className = '',
}: FilterBarProps) {
  const totalSelected = Object.values(selectedFilters).reduce(
    (sum, values) => sum + values.length,
    0
  );

  const handleToggleOption = (groupId: string, optionValue: string) => {
    const currentValues = selectedFilters[groupId] || [];
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter(v => v !== optionValue)
      : [...currentValues, optionValue];
    
    onChange(groupId, newValues);
  };

  const handleClearGroup = (groupId: string) => {
    onChange(groupId, []);
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* Filter Groups */}
      {groups.map((group) => {
        const selectedCount = (selectedFilters[group.id] || []).length;
        const hasSelection = selectedCount > 0;

        return (
          <Popover key={group.id}>
            <PopoverTrigger asChild>
              <Button
                variant={hasSelection ? 'default' : 'outline'}
                size="sm"
                className={`h-12 sm:h-14 gap-2 touch-manipulation ${
                  hasSelection ? 'bg-blue-600 hover:bg-blue-700' : ''
                }`}
              >
                <Filter className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>{group.label}</span>
                {hasSelection && (
                  <Badge variant="secondary" className="ml-1 px-1.5 min-w-[20px] h-5">
                    {selectedCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className={`w-72 p-4 ${
                darkMode ? 'bg-gray-800 border-gray-700' : ''
              }`}
              align="start"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className={`font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {group.label}
                  </h4>
                  {hasSelection && (
                    <Button
                      onClick={() => handleClearGroup(group.id)}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                    >
                      Clear
                    </Button>
                  )}
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {group.options.map((option) => {
                    const isSelected = (selectedFilters[group.id] || []).includes(
                      option.value
                    );

                    return (
                      <div
                        key={option.id}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        onClick={() => handleToggleOption(group.id, option.value)}
                      >
                        <Checkbox
                          id={option.id}
                          checked={isSelected}
                          onCheckedChange={() => handleToggleOption(group.id, option.value)}
                          className="h-5 w-5"
                        />
                        <Label
                          htmlFor={option.id}
                          className={`flex-1 cursor-pointer text-base ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          <span>{option.label}</span>
                          {option.count !== undefined && (
                            <span className={`ml-2 text-sm ${
                              darkMode ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                              ({option.count})
                            </span>
                          )}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        );
      })}

      {/* Clear All Button */}
      {totalSelected > 0 && onClear && (
        <Button
          onClick={onClear}
          variant="ghost"
          size="sm"
          className="h-12 sm:h-14 gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 touch-manipulation"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>Clear All ({totalSelected})</span>
        </Button>
      )}
    </div>
  );
}

/**
 * Display selected filters as removable pills
 */
interface SelectedFiltersPillsProps {
  groups: FilterGroup[];
  selectedFilters: Record<string, string[]>;
  onChange: (groupId: string, values: string[]) => void;
  darkMode?: boolean;
  className?: string;
}

export function SelectedFiltersPills({
  groups,
  selectedFilters,
  onChange,
  darkMode = false,
  className = '',
}: SelectedFiltersPillsProps) {
  const pills: { groupId: string; value: string; label: string }[] = [];

  groups.forEach((group) => {
    const selectedValues = selectedFilters[group.id] || [];
    selectedValues.forEach((value) => {
      const option = group.options.find((opt) => opt.value === value);
      if (option) {
        pills.push({
          groupId: group.id,
          value: option.value,
          label: `${group.label}: ${option.label}`,
        });
      }
    });
  });

  if (pills.length === 0) {
    return null;
  }

  const handleRemove = (groupId: string, value: string) => {
    const currentValues = selectedFilters[groupId] || [];
    const newValues = currentValues.filter((v) => v !== value);
    onChange(groupId, newValues);
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {pills.map((pill) => (
        <Badge
          key={`${pill.groupId}-${pill.value}`}
          variant="secondary"
          className={`h-10 px-3 gap-2 cursor-pointer ${
            darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'
          }`}
          onClick={() => handleRemove(pill.groupId, pill.value)}
        >
          <span>{pill.label}</span>
          <X className="w-4 h-4" />
        </Badge>
      ))}
    </div>
  );
}

export default FilterBar;
