/**
 * Logo Test Component
 * Quick test page to verify logo rendering in both themes
 */

import { PillShieldLogo } from './PillShieldLogo';

interface LogoTestProps {
  darkMode: boolean;
}

export default function LogoTest({ darkMode }: LogoTestProps) {
  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Logo Test - {darkMode ? 'Dark Mode ✨' : 'Light Mode ☀️'}
          </h1>
          <p className={`text-lg mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Shield with capsule and medical cross
          </p>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Dark: Blue shield (#2B5A8C) with glow effect + white capsule
          </p>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Light: Blue shield (#2196F3) + white capsule (no glow)
          </p>
        </div>

        {/* Size 24px */}
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Size: 24px (Small - for favicon/icons)
          </p>
          <div className="flex items-center">
            <PillShieldLogo size={24} />
          </div>
        </div>

        {/* Size 40px */}
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Size: 40px (Mobile header)
          </p>
          <div className="flex items-center">
            <PillShieldLogo size={40} />
          </div>
        </div>

        {/* Size 48px */}
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Size: 48px (Default - Used in landing page header)
          </p>
          <div className="flex items-center">
            <PillShieldLogo size={48} />
          </div>
        </div>

        {/* Size 64px */}
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Size: 64px (Medium - Sidebar)
          </p>
          <div className="flex items-center">
            <PillShieldLogo size={64} />
          </div>
        </div>

        {/* Size 80px */}
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Size: 80px (Large - Onboarding)
          </p>
          <div className="flex items-center">
            <PillShieldLogo size={80} />
          </div>
        </div>

        {/* Size 128px */}
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Size: 128px (Extra Large - Hero sections)
          </p>
          <div className="flex items-center">
            <PillShieldLogo size={128} />
          </div>
        </div>

        {/* Multiple sizes in a row */}
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            All sizes together (aligned to bottom)
          </p>
          <div className="flex items-end gap-6 overflow-x-auto">
            <div className="flex flex-col items-center gap-2">
              <PillShieldLogo size={24} />
              <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>24px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <PillShieldLogo size={32} />
              <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>32px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <PillShieldLogo size={48} />
              <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>48px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <PillShieldLogo size={64} />
              <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>64px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <PillShieldLogo size={96} />
              <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>96px</span>
            </div>
          </div>
        </div>

        {/* Different backgrounds test */}
        <div className="space-y-4">
          <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Logo on different backgrounds
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-lg bg-white flex items-center justify-center">
              <PillShieldLogo size={64} />
            </div>
            <div className="p-6 rounded-lg bg-slate-900 flex items-center justify-center">
              <PillShieldLogo size={64} />
            </div>
            <div className="p-6 rounded-lg bg-blue-50 flex items-center justify-center">
              <PillShieldLogo size={64} />
            </div>
            <div className="p-6 rounded-lg bg-slate-700 flex items-center justify-center">
              <PillShieldLogo size={64} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}