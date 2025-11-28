import { useState } from 'react';
import { AlertCircle, X, Phone, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';

interface CrisisButtonProps {
  darkMode: boolean;
}

export function CrisisButton({ darkMode }: CrisisButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Fixed Crisis Help Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-800'
        } text-white p-4 rounded-full shadow-lg flex items-center gap-2`}
      >
        <AlertCircle className="h-6 w-6" />
        <span className="hidden sm:inline">Crisis Help</span>
      </motion.button>

      {/* Crisis Help Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } rounded-lg shadow-xl p-6 max-w-md w-full mx-4`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`${darkMode ? 'text-white' : 'text-black'} mb-2`}>
                    Crisis Support
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    You're not alone. Help is available 24/7.
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-[#F5F5DC]'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className={`h-5 w-5 ${darkMode ? 'text-white' : 'text-black'}`} />
                    <h4 className={darkMode ? 'text-white' : 'text-black'}>Emergency Hotline</h4>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Rwanda Mental Health Helpline
                  </p>
                  <a href="tel:114" className="text-blue-500 hover:underline">
                    114 (Toll-free)
                  </a>
                </div>
                <div className={`p-4 rounded-lg border-2 ${darkMode ? 'border-red-500 bg-red-900/20' : 'border-red-500 bg-red-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    <strong>If you're in immediate danger:</strong> Call emergency services at <strong>112</strong> or go to the nearest hospital.
                  </p>
                </div>

                <div className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p className="italic">
                    "It's okay to ask for help. Healing is a journey, not a race."
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
