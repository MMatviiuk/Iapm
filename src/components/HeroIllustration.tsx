import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, TrendingUp, Users, Shield, Activity, Calendar, Bell } from 'lucide-react';

export const HeroIllustration = ({ darkMode }: { darkMode: boolean }) => {
  const bgColor = darkMode ? '#1e293b' : '#ffffff';
  const cardBg = darkMode ? '#0f172a' : '#f8fafc';
  const borderColor = darkMode ? '#334155' : '#e2e8f0';
  const primaryColor = '#3b82f6';
  const successColor = '#22c55e';
  
  return (
    <div className="relative w-full aspect-[4/3] lg:aspect-square max-w-2xl mx-auto perspective-1000">
      {/* Main Dashboard Window - Abstract Representation */}
      <motion.div 
        initial={{ rotateX: 5, rotateY: -5, opacity: 0, scale: 0.9 }}
        animate={{ rotateX: 0, rotateY: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`absolute inset-0 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900`}
      >
        {/* Top Bar */}
        <div className="h-12 border-b border-slate-100 dark:border-slate-800 flex items-center px-4 space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <div className="ml-auto w-24 h-2 rounded-full bg-slate-100 dark:bg-slate-800"></div>
        </div>

        <div className="flex h-[calc(100%-3rem)]">
          {/* Sidebar */}
          <div className="w-16 lg:w-48 border-r border-slate-100 dark:border-slate-800 p-4 hidden sm:flex flex-col gap-4">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800"></div>
                  <div className="w-20 h-2 rounded bg-slate-100 dark:bg-slate-800 hidden lg:block"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-900/50">
            {/* Header Area */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="w-32 h-4 rounded-lg bg-slate-200 dark:bg-slate-700 mb-2"></div>
                <div className="w-24 h-3 rounded-lg bg-slate-100 dark:bg-slate-800"></div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[1, 2].map(i => (
                <div key={i} className="p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 mb-3"></div>
                  <div className="w-16 h-4 rounded bg-slate-200 dark:bg-slate-700 mb-2"></div>
                  <div className="w-12 h-3 rounded bg-slate-100 dark:bg-slate-800"></div>
                </div>
              ))}
            </div>

            {/* Chart Area */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 h-32 relative overflow-hidden">
               <div className="absolute inset-0 flex items-end px-4 pb-4 gap-2">
                 {[40, 60, 45, 70, 50, 80, 65, 85, 75, 90, 60, 70].map((h, i) => (
                   <motion.div 
                     key={i}
                     initial={{ height: 0 }}
                     animate={{ height: `${h}%` }}
                     transition={{ duration: 1, delay: i * 0.05 }}
                     className="flex-1 bg-blue-100 dark:bg-blue-900/30 rounded-t-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                   />
                 ))}
               </div>
               {/* Line Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                  <motion.path
                    d="M0,80 C50,80 50,40 100,40 C150,40 150,70 200,70 C250,70 250,20 300,20 C350,20 350,50 400,50 C450,50 450,30 500,30 L500,150 L0,150 Z"
                    fill="url(#gradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    transition={{ delay: 0.5 }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={primaryColor} stopOpacity={0.5} />
                      <stop offset="100%" stopColor={primaryColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M0,80 C50,80 50,40 100,40 C150,40 150,70 200,70 C250,70 250,20 300,20 C350,20 350,50 400,50 C450,50 450,30 500,30"
                    fill="none"
                    stroke={primaryColor}
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </svg>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Elements - Glassmorphism Cards */}
      
      {/* Card 1: Adherence Score */}
      <motion.div
        initial={{ x: -20, y: 20, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="absolute bottom-8 -left-4 sm:left-8 p-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl border border-white/20 dark:border-slate-700 w-48 z-20"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Daily Score</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">98%</div>
          </div>
        </div>
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "98%" }}
            transition={{ delay: 1, duration: 1 }}
            className="h-full bg-green-500 rounded-full"
          />
        </div>
      </motion.div>

      {/* Card 2: Upcoming Med */}
      <motion.div
        initial={{ x: 20, y: -20, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute top-12 -right-4 sm:right-8 p-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl border border-white/20 dark:border-slate-700 w-52 z-20"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <Bell size={20} />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-0.5">Upcoming</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">Vitamin D3</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <Clock size={12} className="inline" /> 08:00 AM
            </div>
          </div>
        </div>
      </motion.div>

       {/* Card 3: Family Connect (Bottom Right) */}
       <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute -bottom-6 -right-2 sm:right-12 p-3 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl border border-white/20 dark:border-slate-700 z-10 flex items-center gap-3"
      >
        <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-300`}>
                    {i === 3 ? '+2' : ''}
                </div>
            ))}
        </div>
        <div className="pr-2">
            <div className="text-xs font-bold text-slate-900 dark:text-white">Family</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Connected</div>
        </div>
      </motion.div>
      
      {/* Decorative Blur Orbs */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
    </div>
  );
};

import { Clock } from 'lucide-react';
