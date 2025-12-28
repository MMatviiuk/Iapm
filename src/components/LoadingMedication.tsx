interface LoadingMedicationProps {
  darkMode: boolean;
}

export default function LoadingMedication({ darkMode }: LoadingMedicationProps) {
  return (
    <div className={`rounded-2xl shadow-md p-4 sm:p-5 animate-pulse ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4 flex-1">
          {/* Image skeleton */}
          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>
          
          {/* Text skeleton */}
          <div className="flex-1 space-y-2">
            <div className={`h-5 w-16 rounded ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            <div className={`h-4 w-32 rounded ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            <div className={`h-3 w-20 rounded ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
          </div>
        </div>
        
        {/* Button skeletons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`w-10 h-10 rounded-xl ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>
          <div className={`w-14 h-7 sm:w-16 sm:h-8 rounded-full ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>
        </div>
      </div>
    </div>
  );
}
