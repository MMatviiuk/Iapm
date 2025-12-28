import React from 'react';
import { Home, Calendar, Pill, User, Menu } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  darkMode: boolean;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function BottomNav({ darkMode, currentPage, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'today', icon: Calendar, label: 'Schedule' },
    { id: 'medications', icon: Pill, label: 'Meds' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t ${
      darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
    } safe-area-pb`}>
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[64px] rounded-xl transition-all touch-manipulation relative ${
                isActive 
                  ? darkMode ? 'text-blue-400' : 'text-blue-600'
                  : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
              }`}
              whileTap={{ scale: 0.95 }}
              aria-label={item.label}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavActiveIndicator"
                  className={`absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full ${
                    darkMode ? 'bg-blue-400' : 'bg-blue-600'
                  }`}
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              
              <Icon 
                size={28} 
                strokeWidth={isActive ? 2.5 : 2} 
                className="mb-1"
              />
              <span className="text-xs font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
