import { useState, useEffect } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Input } from './ui/input';
import { useDebounce } from '../hooks/useDebounce';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface AdvancedSearchFiltersProps {
  darkMode: boolean;
  onSearch: (query: string) => void;
  onFilter: (filters: FilterState) => void;
  totalResults: number;
  showFilters?: boolean;
}

export interface FilterState {
  status: 'all' | 'active' | 'completed' | 'scheduled';
  form: 'all' | 'tablet' | 'capsule' | 'liquid' | 'injection' | 'cream' | 'inhaler' | 'powder' | 'other';
  mealTiming: 'all' | 'before meal' | 'with meal' | 'after meal' | 'anytime';
  sortBy: 'name' | 'time' | 'adherence' | 'dateAdded';
  sortOrder: 'asc' | 'desc';
}

export default function AdvancedSearchFilters({
  darkMode,
  onSearch,
  onFilter,
  totalResults,
  showFilters = true
}: AdvancedSearchFiltersProps) {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    form: 'all',
    mealTiming: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // Debounce search query (500ms) - critical for elderly users typing slowly
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Trigger search when debounced value changes
  useEffect(() => {
    onSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearch]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // Removed onSearch(value) - now handled by debounced effect
    if ('vibrate' in navigator) navigator.vibrate(10);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
    toast.info('Search cleared');
    if ('vibrate' in navigator) navigator.vibrate(20);
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
    if ('vibrate' in navigator) navigator.vibrate(15);
  };

  const clearAllFilters = () => {
    const defaultFilters: FilterState = {
      status: 'all',
      form: 'all',
      mealTiming: 'all',
      sortBy: 'name',
      sortOrder: 'asc'
    };
    setFilters(defaultFilters);
    setSearchQuery('');
    onSearch('');
    onFilter(defaultFilters);
    toast.success('All filters cleared');
    if ('vibrate' in navigator) navigator.vibrate([20, 30, 20]);
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'sortBy' && value === 'name') return false;
    if (key === 'sortOrder' && value === 'asc') return false;
    return value !== 'all';
  }).length;

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
            darkMode ? 'text-slate-400' : 'text-slate-500'
          }`} />
          <Input
            type="text"
            placeholder="Search medications by name, dosage, or form..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={`pl-10 pr-10 h-14 ${
              darkMode 
                ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400' 
                : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-500'
            }`}
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors ${
                darkMode 
                  ? 'hover:bg-slate-700 text-slate-400 hover:text-white' 
                  : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
              }`}
              aria-label="Clear search"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
          )}
        </div>

        {showFilters && (
          <Button
            onClick={() => {
              setFiltersOpen(!filtersOpen);
              if ('vibrate' in navigator) navigator.vibrate(30);
            }}
            variant="outline"
            className={`h-14 px-4 gap-2 shrink-0 relative ${
              darkMode 
                ? 'border-slate-700 hover:bg-slate-800' 
                : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" strokeWidth={2} />
            <span className="hidden sm:inline">Filters</span>
            {activeFiltersCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-blue-600 text-white text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className={`text-sm ${
          darkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          {totalResults} {totalResults === 1 ? 'result' : 'results'} found
          {searchQuery && <span> for "{searchQuery}"</span>}
        </p>

        {(activeFiltersCount > 0 || searchQuery) && (
          <Button
            onClick={clearAllFilters}
            variant="ghost"
            size="sm"
            className="h-8 text-sm gap-2"
          >
            <X className="w-4 h-4" strokeWidth={2} />
            Clear all
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={`p-4 rounded-xl border-2 space-y-4 ${
              darkMode 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-bold ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Advanced Filters
                </h3>
                <Button
                  onClick={() => setFiltersOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <X className="w-5 h-5" strokeWidth={2} />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Status
                  </label>
                  <Select
                    value={filters.status}
                    onValueChange={(value: any) => updateFilter('status', value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Form Filter */}
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Form Type
                  </label>
                  <Select
                    value={filters.form}
                    onValueChange={(value: any) => updateFilter('form', value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Forms</SelectItem>
                      <SelectItem value="tablet">Tablets</SelectItem>
                      <SelectItem value="capsule">Capsules</SelectItem>
                      <SelectItem value="liquid">Liquids/Syrups</SelectItem>
                      <SelectItem value="injection">Injections</SelectItem>
                      <SelectItem value="cream">Creams/Ointments</SelectItem>
                      <SelectItem value="inhaler">Inhalers</SelectItem>
                      <SelectItem value="powder">Powders</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Meal Timing Filter */}
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Meal Timing
                  </label>
                  <Select
                    value={filters.mealTiming}
                    onValueChange={(value: any) => updateFilter('mealTiming', value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Timings</SelectItem>
                      <SelectItem value="before meal">Before Meal</SelectItem>
                      <SelectItem value="with meal">With Meal</SelectItem>
                      <SelectItem value="after meal">After Meal</SelectItem>
                      <SelectItem value="anytime">Anytime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Sort By
                  </label>
                  <div className="flex gap-2">
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value: any) => updateFilter('sortBy', value)}
                    >
                      <SelectTrigger className="h-12 flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="time">Time</SelectItem>
                        <SelectItem value="adherence">Adherence</SelectItem>
                        <SelectItem value="dateAdded">Date Added</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                      variant="outline"
                      className="h-12 w-12 p-0 shrink-0"
                      title={filters.sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
                    >
                      {filters.sortOrder === 'asc' ? '↑' : '↓'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active Filters Summary */}
              {activeFiltersCount > 0 && (
                <div className="pt-3 border-t border-slate-300 dark:border-slate-600">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-medium ${
                      darkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Active:
                    </span>
                    {filters.status !== 'all' && (
                      <Badge variant="secondary" className="gap-1">
                        Status: {filters.status}
                        <button
                          onClick={() => updateFilter('status', 'all')}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" strokeWidth={2} />
                        </button>
                      </Badge>
                    )}
                    {filters.form !== 'all' && (
                      <Badge variant="secondary" className="gap-1">
                        Form: {filters.form}
                        <button
                          onClick={() => updateFilter('form', 'all')}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" strokeWidth={2} />
                        </button>
                      </Badge>
                    )}
                    {filters.mealTiming !== 'all' && (
                      <Badge variant="secondary" className="gap-1">
                        Meal: {filters.mealTiming}
                        <button
                          onClick={() => updateFilter('mealTiming', 'all')}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" strokeWidth={2} />
                        </button>
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
