import { Skeleton } from './ui/skeleton';

interface StatCardSkeletonProps {
  darkMode?: boolean;
  count?: number;
}

export default function StatCardSkeleton({ 
  darkMode = false, 
  count = 4
}: StatCardSkeletonProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className={`rounded-xl border-2 p-3 sm:p-4 lg:p-6 ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Icon Skeleton */}
            <Skeleton 
              className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl flex-shrink-0 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`} 
            />
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Label */}
              <Skeleton 
                className={`h-3 sm:h-4 w-16 sm:w-20 mb-2 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`} 
              />
              
              {/* Value */}
              <Skeleton 
                className={`h-7 sm:h-9 lg:h-11 w-12 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`} 
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
