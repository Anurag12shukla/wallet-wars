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
          className="w-16 h-16 border-2 border-brand-gold border-t-transparent rounded-full mx-auto mb-6 shadow-[0_0_20px_rgba(255,215,0,0.2)]"
        />
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="font-display text-brand-gold text-lg tracking-widest uppercase font-bold"
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
}
