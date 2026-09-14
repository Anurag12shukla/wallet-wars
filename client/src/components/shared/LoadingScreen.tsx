import React from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'LOADING...' }: LoadingScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-darker">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-2 border-brand-purple border-t-transparent rounded-full mx-auto mb-6"
        />
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="font-display text-brand-purple text-lg tracking-widest"
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
}
