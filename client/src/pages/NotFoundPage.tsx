import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-8xl mb-8"
        >
          💀
        </motion.div>
        <h1 className="font-display text-6xl text-white mb-4">404</h1>
        <p className="font-display text-2xl gradient-text mb-4">PAGE FLED THE ARENA</p>
        <p className="text-gray-400 mb-8">This page couldn't survive. Try the arena instead.</p>
        <Link to="/" className="btn-primary px-8 py-3">
          RETURN TO BASE
        </Link>
      </div>
    </div>
  );
}
