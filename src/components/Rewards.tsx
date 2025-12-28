import { useState, useEffect } from 'react';
import { Award, Trophy, Target, Star, Medal, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import EmptyState from './EmptyState';

interface RewardsProps {
  darkMode: boolean;
  setCurrentPage?: (page: string) => void;
  medications?: any[];
}

export default function Rewards({ darkMode, setCurrentPage, medications = [] }: RewardsProps) {
  const [adherenceStreak, setAdherenceStreak] = useState(7);
  const [totalPoints, setTotalPoints] = useState(245);
  const [level, setLevel] = useState(3);

  const achievements = [
    {
      id: 1,
      title: 'First Week',
      description: '7 days streak',
      icon: Star,
      unlocked: true,
      points: 50,
      date: 'Jan 8, 2025'
    },
    {
      id: 2,
      title: 'Consistent',
      description: '30 days streak',
      icon: Target,
      unlocked: false,
      points: 100,
      progress: 23
    },
    {
      id: 3,
      title: 'Medication Master',
      description: 'Take all meds on time for 7 days',
      icon: Trophy,
      unlocked: true,
      points: 75,
      date: 'Jan 10, 2025'
    },
    {
      id: 4,
      title: 'Perfect Week',
      description: '100% adherence for a week',
      icon: Medal,
      unlocked: true,
      points: 80,
      date: 'Jan 12, 2025'
    },
    {
      id: 5,
      title: 'Early Bird',
      description: 'Morning meds on time 10 times',
      icon: CheckCircle,
      unlocked: false,
      points: 60,
      progress: 7
    },
    {
      id: 6,
      title: 'Champion',
      description: '90 days streak',
      icon: Award,
      unlocked: false,
      points: 200,
      progress: 7
    }
  ];

  const nextLevelPoints = level * 100;
  const progressToNextLevel = (totalPoints % 100) / 100 * 100;

  // Check if user has any unlocked achievements and no medications
  const hasUnlockedAchievements = achievements.some(a => a.unlocked);

  // Empty state - new user with no medications and no achievements
  if (medications.length === 0 && !hasUnlockedAchievements) {
    return (
      <div className={`min-h-screen pb-24 ${darkMode ? 'bg-gray-900' : 'bg-[#E8F4F8]'}`}>
        <div className={`shadow-sm sticky top-0 z-10 px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="max-w-4xl mx-auto">
            <h1 className={`text-2xl sm:text-3xl lg:text-5xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Rewards & Achievements
            </h1>
          </div>
        </div>
        <div className="px-3 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-4xl mx-auto">
          <EmptyState
            icon={Award}
            title="Start Your Achievement Journey"
            description="Take your first medication to unlock achievements and celebrate your progress with rewards!"
            actionLabel={setCurrentPage ? "Add Medication" : undefined}
            onAction={setCurrentPage ? () => setCurrentPage('add') : undefined}
            helpText="How do achievements work?"
            onHelp={() => {
              // Future: Show help modal explaining achievements
              console.log('Help clicked - achievements explanation');
            }}
            darkMode={darkMode}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-24 ${darkMode ? 'bg-gray-900' : 'bg-[#E8F4F8]'}`}>
      <div className={`shadow-sm sticky top-0 z-10 px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-2xl sm:text-3xl lg:text-5xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Rewards & Achievements
          </h1>
        </div>
      </div>

      <div className="px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 max-w-4xl mx-auto space-y-3 sm:space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 lg:gap-6 mb-5 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-[#2196F3] to-[#1976D2] rounded-full flex items-center justify-center flex-shrink-0">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className={`text-sm sm:text-base lg:text-lg mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Level {level}
              </div>
              <div className={`text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {totalPoints} Points
              </div>
              <div className="w-full max-w-xs">
                <div className={`h-3 sm:h-4 rounded-full overflow-hidden mb-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div
                    className="h-full bg-gradient-to-r from-[#2196F3] to-[#1976D2] transition-all duration-500"
                    style={{ width: `${progressToNextLevel}%` }}
                  />
                </div>
                <div className={`text-xs sm:text-sm lg:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {totalPoints % 100} / {nextLevelPoints} to Level {level + 1}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className={`p-3 sm:p-4 lg:p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-[#2196F3]" />
                <span className={`text-xs sm:text-sm lg:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Current Streak
                </span>
              </div>
              <div className={`text-2xl sm:text-3xl lg:text-4xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {adherenceStreak}
                <span className={`text-base sm:text-lg lg:text-xl ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  days
                </span>
              </div>
            </div>

            <div className={`p-3 sm:p-4 lg:p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#2196F3]" />
                <span className={`text-xs sm:text-sm lg:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Achievements
                </span>
              </div>
              <div className={`text-2xl sm:text-3xl lg:text-4xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {achievements.filter(a => a.unlocked).length}
                <span className={`text-base sm:text-lg lg:text-xl ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  / {achievements.length}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-4 lg:mb-5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Achievements
          </h2>

          <div className="space-y-2 sm:space-y-3">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 sm:p-4 lg:p-5 rounded-lg transition-all border-2 ${
                    achievement.unlocked
                      ? darkMode
                        ? 'bg-gradient-to-r from-[#2196F3]/20 to-[#1976D2]/20 border-[#2196F3]/30'
                        : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
                      : darkMode
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-[#2196F3] to-[#1976D2]'
                        : darkMode
                          ? 'bg-gray-600'
                          : 'bg-gray-300'
                    }`}>
                      <Icon className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${achievement.unlocked ? 'text-white' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1 sm:mb-2">
                        <h3 className={`text-base sm:text-lg lg:text-xl ${
                          achievement.unlocked
                            ? darkMode ? 'text-white' : 'text-gray-900'
                            : darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {achievement.title}
                        </h3>
                        <span className={`text-sm sm:text-base lg:text-lg flex-shrink-0 ${
                          achievement.unlocked
                            ? 'text-[#2196F3]'
                            : darkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {achievement.points} pts
                        </span>
                      </div>
                      
                      <p className={`text-sm sm:text-base lg:text-lg mb-2 ${
                        achievement.unlocked
                          ? darkMode ? 'text-gray-300' : 'text-gray-700'
                          : darkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {achievement.description}
                      </p>

                      {achievement.unlocked ? (
                        <div className={`flex items-center gap-2 text-xs sm:text-sm lg:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <CheckCircle className="w-4 h-4 text-[#2196F3]" />
                          Unlocked on {achievement.date}
                        </div>
                      ) : achievement.progress !== undefined ? (
                        <div>
                          <div className={`h-2 sm:h-3 rounded-full overflow-hidden mb-1 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
                            <div
                              className="h-full bg-[#2196F3] transition-all duration-500"
                              style={{ width: `${(achievement.progress / 30) * 100}%` }}
                            />
                          </div>
                          <div className={`text-xs sm:text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Progress: {achievement.progress}/30
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
