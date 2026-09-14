import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

import connectDB from './config/database';
import { config } from './config';
import { errorHandler, notFound } from './middleware/errorHandler';

import walletRoutes from './routes/wallet';
import warriorRoutes from './routes/warriors';
import battleRoutes from './routes/battles';
import leaderboardRoutes from './routes/leaderboard';
import gameRoutes from './routes/game';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow frontend CDN assets in dev
}));

// CORS
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    error: { code: 'RATE_LIMITED', message: 'Too many requests. Please slow down.' },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB query sanitization
app.use(mongoSanitize());

// Logging (development only)
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      network: config.solanaNetwork,
      environment: config.nodeEnv,
    },
  });
});

// Ensure DB connects for serverless requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB Connection Middleware Error:', err);
    res.status(500).json({ success: false, error: { message: 'Database connection failed. Please check Vercel environment variables and MongoDB IP whitelist.' } });
  }
});

// API Routes
app.use('/api/wallet', walletRoutes);
app.use('/api/warriors', warriorRoutes);
app.use('/api/battles', battleRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api', gameRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server locally
const startServer = async () => {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`\n🚀 Wallet Wars Server running on port ${config.port}`);
    console.log(`🌐 Network: ${config.solanaNetwork}`);
    console.log(`📡 Environment: ${config.nodeEnv}`);
    console.log(`🔗 Client URL: ${config.clientUrl}\n`);
  });
};

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  startServer();
}

import { disconnectDB } from './config/database';

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await disconnectDB();
  process.exit(0);
});

export default app;
