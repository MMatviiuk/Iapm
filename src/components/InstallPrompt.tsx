/**
 * INSTALL PROMPT COMPONENT
 * Prompts users to install PWA on their device
 * 
 * Features:
 * - Smart timing (after 3 visits or achievement)
 * - Elderly-friendly (large buttons, clear text)
 * - Dismissible (remembers user choice)
 * - Animations (smooth slide-in)
 */

import { useState, useEffect } from 'react';
import { X, Download, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { canInstall, showInstallPrompt, isInstalled } from '../utils/pwaUtils';

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Don't show if already installed
    if (isInstalled()) {
      return;
    }

    // Don't show if user dismissed
    const dismissed = localStorage.getItem('installPromptDismissed');
    if (dismissed === 'true') {
      return;
    }

    // Check visit count
    const visitCount = parseInt(localStorage.getItem('visitCount') || '0', 10);
    const newVisitCount = visitCount + 1;
    localStorage.setItem('visitCount', newVisitCount.toString());

    // Show after 3 visits
    if (newVisitCount >= 3 && canInstall()) {
      setTimeout(() => {
        setShowPrompt(true);
        setIsVisible(true);
      }, 3000); // Wait 3 seconds after page load
    }
  }, []);

  const handleInstall = async () => {
    const accepted = await showInstallPrompt();
    
    if (accepted) {
      setIsVisible(false);
      setTimeout(() => setShowPrompt(false), 300);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('installPromptDismissed', 'true');
    setIsVisible(false);
    setTimeout(() => setShowPrompt(false), 300);
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={handleDismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8 relative">
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>

              {/* Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <Download className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400" />
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl mb-3 text-gray-900 dark:text-white">
                Install Prescription Clarity
              </h2>

              {/* Description */}
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Get quick access and work offline! Install our app for the best experience.
              </p>

              {/* Benefits */}
              <div className="space-y-3 mb-6 sm:mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                    Instant access from home screen
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                    Works without internet
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                    Never miss a medication
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleInstall}
                  className="flex-1 h-14 sm:h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-6 h-6" />
                  Install App
                </button>

                <button
                  onClick={handleDismiss}
                  className="flex-1 h-14 sm:h-16 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-lg transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
