import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F7F8F5]">
      <div className="text-center max-w-md bg-white border border-stone-200 rounded-3xl p-8 shadow-soft-sm">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-7xl mb-4"
        >
          💀
        </motion.div>
        <h1 className="font-display text-5xl text-slate-900 font-extrabold mb-2">404</h1>
        <p className="font-display text-lg text-slate-800 font-bold mb-2">PAGE FLED THE ARENA</p>
        <p className="text-slate-600 text-sm mb-6">This page couldn't survive. Try the arena instead.</p>
        <Link to="/" className="btn-primary px-8 py-3 text-sm">
          RETURN TO BASE
        </Link>
      </div>
    </div>
  );
}
