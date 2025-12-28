import { Skeleton } from './ui/skeleton';

interface ChartSkeletonProps {
  darkMode?: boolean;
  type?: 'line' | 'bar' | 'pie' | 'scatter';
  height?: string;
}

export default function ChartSkeleton({ 
  darkMode = false, 
  type = 'line',
  height = 'h-[700px] sm:h-[800px] lg:h-[600px]'
}: ChartSkeletonProps) {
  return (
    <div className={`${height} w-full rounded-xl border-2 p-4 sm:p-6 ${
      darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      {/* Chart Title Skeleton */}
      <div className="mb-4">
        <Skeleton className={`h-6 w-48 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
      </div>

      {/* Chart Content based on type */}
      {type === 'line' && (
        <div className="flex flex-col h-[calc(100%-2rem)]">
          {/* Y-axis labels */}
          <div className="flex-1 flex flex-col justify-between pr-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton 
                key={i} 
                className={`h-4 w-12 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} 
              />
            ))}
          </div>
          {/* X-axis labels */}
          <div className="flex justify-between mt-4 pl-12">
            {[...Array(7)].map((_, i) => (
              <Skeleton 
                key={i} 
                className={`h-4 w-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} 
              />
            ))}
          </div>
        </div>
      )}

      {type === 'bar' && (
        <div className="flex items-end justify-around h-[calc(100%-2rem)] gap-2">
          {[60, 80, 40, 90, 70].map((height, i) => (
            <Skeleton 
              key={i} 
              className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      )}

      {type === 'pie' && (
        <div className="flex items-center justify-center h-[calc(100%-2rem)]">
          <Skeleton 
            className={`w-64 h-64 sm:w-80 sm:h-80 rounded-full ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`} 
          />
        </div>
      )}

      {type === 'scatter' && (
        <div className="relative h-[calc(100%-2rem)]">
          {/* Random dots */}
          {[...Array(20)].map((_, i) => (
            <Skeleton 
              key={i}
              className={`absolute w-3 h-3 rounded-full ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}
              style={{
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 90}%`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
