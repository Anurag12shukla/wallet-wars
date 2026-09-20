import React from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'LOADING...' }: LoadingScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8F5]">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-3 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"
        />
        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="font-display text-slate-700 text-sm tracking-wider uppercase font-bold"
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
}
