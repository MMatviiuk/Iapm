import { Skeleton } from './ui/skeleton';

interface MedicationCardSkeletonProps {
  darkMode?: boolean;
  count?: number;
  compact?: boolean;
}

export default function MedicationCardSkeleton({ 
  darkMode = false, 
  count = 3,
  compact = false
}: MedicationCardSkeletonProps) {
  return (
    <div className="space-y-2 sm:space-y-3">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className={`rounded-xl border-2 p-3 sm:p-4 ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Checkbox Skeleton */}
            <Skeleton 
              className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`} 
            />

            {/* Content Skeleton */}
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              {/* Medication Name */}
              <Skeleton 
                className={`h-8 sm:h-10 w-3/4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} 
              />
              
              {/* Details Row */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Dosage */}
                <Skeleton 
                  className={`h-5 w-16 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} 
                />
                
                {/* Time */}
                <Skeleton 
                  className={`h-5 w-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} 
                />
                
                {/* Meal timing */}
                {!compact && (
                  <Skeleton 
                    className={`h-5 w-5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} 
                  />
                )}
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            {!compact && (
              <div className="flex items-center gap-2">
                <Skeleton 
                  className={`w-12 h-12 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} 
                />
                <Skeleton 
                  className={`w-12 h-12 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} 
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
