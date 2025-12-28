/**
 * MEDICATIONS LIST WITH SEARCH & FILTERS
 * Enhanced medication list with search, filters, and sorting
 * Elderly-friendly with large controls
 */

import React, { useState, useMemo } from 'react';
import { Pill, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import SearchBar from './SearchBar';
import FilterBar, { SelectedFiltersPills, type FilterGroup } from './FilterBar';
import SortBar, { sortMedications, MEDICATION_SORT_OPTIONS } from './SortBar';
import EmptyState from './EmptyState';

interface MedicationsListWithSearchProps {
  medications: any[];
  darkMode: boolean;
  onAddMedication: () => void;
  onEditMedication: (med: any) => void;
  onDeleteMedication: (id: string) => void;
  onPrint: () => void;
}

const MedicationsListWithSearch: React.FC<MedicationsListWithSearchProps> = ({
  medications,
  darkMode,
  onAddMedication,
  onEditMedication,
  onDeleteMedication,
  onPrint,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortValue, setSortValue] = useState('name-asc');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    form: [],
    mealTiming: [],
    timeOfDay: [],
  });

  // Define filter groups
  const filterGroups: FilterGroup[] = [
    {
      id: 'form',
      label: 'Form',
      options: [
        { id: 'form-tablet', label: 'Tablet', value: 'Tablet', count: medications.filter(m => m.form === 'Tablet').length },
        { id: 'form-capsule', label: 'Capsule', value: 'Capsule', count: medications.filter(m => m.form === 'Capsule').length },
        { id: 'form-liquid', label: 'Liquid/Syrup', value: 'Liquid/Syrup', count: medications.filter(m => m.form === 'Liquid/Syrup').length },
        { id: 'form-other', label: 'Other', value: 'Other', count: medications.filter(m => !['Tablet', 'Capsule', 'Liquid/Syrup'].includes(m.form || '')).length },
      ],
    },
    {
      id: 'mealTiming',
      label: 'Meal Timing',
      options: [
        { id: 'meal-before', label: 'Before Meal', value: 'before meal', count: medications.filter(m => m.mealTiming === 'before meal').length },
        { id: 'meal-with', label: 'With Meal', value: 'with meal', count: medications.filter(m => m.mealTiming === 'with meal').length },
        { id: 'meal-after', label: 'After Meal', value: 'after meal', count: medications.filter(m => m.mealTiming === 'after meal').length },
        { id: 'meal-anytime', label: 'Anytime', value: 'anytime', count: medications.filter(m => m.mealTiming === 'anytime').length },
      ],
    },
    {
      id: 'timeOfDay',
      label: 'Time of Day',
      options: [
        { id: 'time-morning', label: 'Morning', value: 'morning', count: medications.filter(m => m.timeOfDay?.morning).length },
        { id: 'time-afternoon', label: 'Afternoon', value: 'afternoon', count: medications.filter(m => m.timeOfDay?.afternoon).length },
        { id: 'time-evening', label: 'Evening', value: 'evening', count: medications.filter(m => m.timeOfDay?.evening).length },
      ],
    },
  ];

  // Filter and sort medications
  const filteredAndSortedMedications = useMemo(() => {
    let filtered = [...medications];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(med =>
        med.name.toLowerCase().includes(search) ||
        med.dosage?.toLowerCase().includes(search)
      );
    }

    // Form filter
    if (selectedFilters.form?.length > 0) {
      filtered = filtered.filter(med => {
        if (selectedFilters.form.includes('Other')) {
          return selectedFilters.form.includes(med.form) || 
                 !['Tablet', 'Capsule', 'Liquid/Syrup'].includes(med.form || '');
        }
        return selectedFilters.form.includes(med.form);
      });
    }

    // Meal timing filter
    if (selectedFilters.mealTiming?.length > 0) {
      filtered = filtered.filter(med =>
        selectedFilters.mealTiming.includes(med.mealTiming)
      );
    }

    // Time of day filter
    if (selectedFilters.timeOfDay?.length > 0) {
      filtered = filtered.filter(med => {
        return selectedFilters.timeOfDay.some(time =>
          med.timeOfDay?.[time as 'morning' | 'afternoon' | 'evening']
        );
      });
    }

    // Sort
    return sortMedications(filtered, sortValue);
  }, [medications, searchTerm, selectedFilters, sortValue]);

  const handleFilterChange = (groupId: string, values: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      [groupId]: values,
    }));
  };

  const handleClearFilters = () => {
    setSelectedFilters({
      form: [],
      mealTiming: [],
      timeOfDay: [],
    });
  };

  const hasActiveFilters = Object.values(selectedFilters).some(v => v.length > 0);

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="space-y-3">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search medications..."
          darkMode={darkMode}
        />

        <div className="flex flex-wrap items-center gap-3">
          <FilterBar
            groups={filterGroups}
            selectedFilters={selectedFilters}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
            darkMode={darkMode}
          />

          <SortBar
            options={MEDICATION_SORT_OPTIONS}
            value={sortValue}
            onChange={setSortValue}
            darkMode={darkMode}
            className="ml-auto"
          />
        </div>

        {/* Selected Filters Pills */}
        {hasActiveFilters && (
          <SelectedFiltersPills
            groups={filterGroups}
            selectedFilters={selectedFilters}
            onChange={handleFilterChange}
            darkMode={darkMode}
          />
        )}
      </div>

      {/* Results Count */}
      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Showing {filteredAndSortedMedications.length} of {medications.length} medications
        {(searchTerm || hasActiveFilters) && (
          <Button
            onClick={() => {
              setSearchTerm('');
              handleClearFilters();
            }}
            variant="ghost"
            size="sm"
            className="ml-2 h-8"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Medications List */}
      {filteredAndSortedMedications.length === 0 ? (
        <EmptyState
          icon={Pill}
          title={searchTerm || hasActiveFilters ? 'No medications found' : 'No medications yet'}
          description={
            searchTerm || hasActiveFilters
              ? 'Try adjusting your search or filters'
              : 'Add your first medication to get started'
          }
          actionLabel={searchTerm || hasActiveFilters ? undefined : 'Add Medication'}
          onAction={searchTerm || hasActiveFilters ? undefined : onAddMedication}
          darkMode={darkMode}
        />
      ) : (
        <div className="space-y-3">
          {filteredAndSortedMedications.map((med) => (
            <Card
              key={med.id}
              className={`p-4 sm:p-5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg sm:text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {med.name}
                  </h3>
                  <p className={`text-sm sm:text-base mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {med.dosage}
                  </p>
                  <div className={`flex flex-wrap gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span>{med.form}</span>
                    <span>•</span>
                    <span>{med.time || med.morningTime}</span>
                    <span>•</span>
                    <span>{med.mealTiming}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => onEditMedication(med)}
                    variant="outline"
                    size="sm"
                    className="h-12 sm:h-14 touch-manipulation"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => onDeleteMedication(med.id)}
                    variant="destructive"
                    size="sm"
                    className="h-12 sm:h-14 touch-manipulation"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {medications.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-4">
          <Button onClick={onAddMedication} className="h-12 sm:h-14">
            <Plus className="w-5 h-5 mr-2" />
            Add Medication
          </Button>
          <Button onClick={onPrint} variant="outline" className="h-12 sm:h-14">
            Print Schedule
          </Button>
        </div>
      )}
    </div>
  );
};

export default MedicationsListWithSearch;
