import { ArrowLeft, Pill, Search, Camera } from 'lucide-react';
import { useState } from 'react';

interface MedicationReferenceProps {
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    image?: string;
  }>;
  darkMode: boolean;
  onBack: () => void;
}

export function MedicationReference({ medications, darkMode, onBack }: MedicationReferenceProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique medications (by name) with images
  const medicationsWithImages = medications.filter(med => med.image);
  const uniqueMedications = Array.from(
    new Map(medicationsWithImages.map(med => [med.name, med])).values()
  );

  // Filter medications based on search
  const filteredMedications = uniqueMedications.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.dosage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <button
              onClick={onBack}
              className={`min-w-[48px] min-h-[48px] w-[48px] h-[48px] sm:min-w-[52px] sm:min-h-[52px] sm:w-[52px] sm:h-[52px] flex items-center justify-center rounded-lg transition-colors touch-manipulation ${
                darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
              }`}
              aria-label="Go back"
            >
              <ArrowLeft size={28} className="sm:w-8 sm:h-8" strokeWidth={2.5} />
            </button>
            <div>
              <h1 className={`text-xl sm:text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Medication Reference
              </h1>
              <p className={`text-base sm:text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                View all medications with photos
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search
              size={24}
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medications..."
              className={`w-full pl-14 pr-4 py-3 sm:py-4 rounded-xl text-base sm:text-lg ${
                darkMode
                  ? 'bg-gray-700 text-white placeholder-gray-500 border-gray-600'
                  : 'bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300'
              } border-2 focus:outline-none focus:border-[#2196F3] transition-colors`}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {filteredMedications.length === 0 ? (
          <div className="text-center py-16">
            <Camera size={64} className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-base sm:text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {searchQuery ? 'No medications found' : 'No medications with photos yet'}
            </p>
            <p className={`text-sm sm:text-base mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {searchQuery ? 'Try a different search term' : 'Add photos to your medications to see them here'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredMedications.map((medication) => (
              <div
                key={medication.id}
                className={`rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105 ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                {medication.image && (
                  <div className="aspect-square overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <img
                      src={medication.image}
                      alt={medication.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4 sm:p-5">
                  <h3 className={`font-bold text-lg sm:text-xl mb-1 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {medication.name}
                  </h3>
                  <p className={`text-base sm:text-lg ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {medication.dosage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
