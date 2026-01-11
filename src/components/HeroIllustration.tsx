import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, TrendingUp, Users, Shield, Activity, Calendar, Bell, Pill, Clock } from 'lucide-react';

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
          <div className="w-16 lg:w-48 border-r border-slate-100 dark:border-slate-800 p-4 hidden sm:flex flex-col gap-6">
            <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <Shield size={18} fill="currentColor" />
                </div>
                <div className="font-bold text-slate-800 dark:text-white hidden lg:block">Clarity</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                <Activity size={20} />
                <div className="font-medium hidden lg:block">Dashboard</div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Calendar size={20} />
                <div className="font-medium hidden lg:block">Schedule</div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Pill size={20} />
                <div className="font-medium hidden lg:block">Meds</div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Users size={20} />
                <div className="font-medium hidden lg:block">Family</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-900/50 relative overflow-hidden">
            {/* Header Area */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="text-xl font-bold text-slate-800 dark:text-white mb-1">Good Morning, Alex 👋</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Here is your daily health overview</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">
                  AM
              </div>
            </div>

            {/* Stats Grid - Concrete Data */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* Stat 1 */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-24">
                <div className="flex justify-between items-start">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <Pill size={18} />
                    </div>
                    <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">Today</span>
                </div>
                <div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">3<span className="text-sm text-slate-400 font-normal">/5</span></div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Medications Taken</div>
                </div>
              </div>
              
              {/* Stat 2 */}
               <div className="p-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-24">
                <div className="flex justify-between items-start">
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                        <TrendingUp size={18} />
                    </div>
                     <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">Streak</span>
                </div>
                <div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">12 <span className="text-sm text-slate-400 font-normal">days</span></div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Perfect Adherence</div>
                </div>
              </div>
            </div>

            {/* Chart Area - Weekly Adherence */}
            <div className="p-5 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 h-40 relative flex flex-col">
               <div className="flex justify-between items-center mb-4">
                   <div className="font-bold text-slate-800 dark:text-white text-sm">Weekly Adherence</div>
                   <div className="text-xs text-green-500 font-medium">+12% vs last week</div>
               </div>
               
               <div className="flex-1 flex items-end justify-between gap-2 px-1">
                 {[
                    { day: 'M', h: 60, active: false },
                    { day: 'T', h: 80, active: false },
                    { day: 'W', h: 100, active: false },
                    { day: 'T', h: 70, active: false },
                    { day: 'F', h: 90, active: false },
                    { day: 'S', h: 100, active: true },
                    { day: 'S', h: 40, active: false } // Future day
                 ].map((item, i) => (
                   <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                        <div className="relative w-full flex items-end justify-center h-20">
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${item.h}%` }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                className={`w-full max-w-[20px] rounded-t-md ${
                                    item.active 
                                    ? 'bg-blue-500 dark:bg-blue-500' 
                                    : 'bg-slate-100 dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30'
                                } transition-colors`}
                            />
                        </div>
                        <div className="text-[10px] font-medium text-slate-400">{item.day}</div>
                   </div>
                 ))}
               </div>
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

