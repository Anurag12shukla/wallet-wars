import mongoose from 'mongoose';

let memoryServer: any = null;

let isConnected = false;

const connectDB = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  let mongoUri = process.env.MONGODB_URI || '';

  // In development with no MONGODB_URI set, use in-memory MongoDB
  if (!process.env.VERCEL && (!mongoUri || mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1'))) {
    try {
      if (mongoUri) {
        const conn = await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 3000,
          socketTimeoutMS: 45000,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        isConnected = true;
        setupListeners();
        return;
      }
    } catch {
      // Fall through to in-memory
    }

    if (!memoryServer) {
      console.log('⚡ Starting MongoDB Memory Server (dev mode)...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create({
        instance: { dbName: 'wallet-wars' },
      });
      mongoUri = memoryServer.getUri();
      console.log('✅ MongoDB Memory Server started');
    } else {
      mongoUri = memoryServer.getUri();
    }
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000, // Reduced from 10000 so it fails before Vercel 10s timeout
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });
    isConnected = !!conn.connections[0].readyState;
    console.log(`✅ MongoDB Connected: ${memoryServer ? 'in-memory' : conn.connection.host}`);
    setupListeners();
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    if (!process.env.VERCEL) {
      process.exit(1);
    } else {
      throw error;
    }
  }
};

function setupListeners() {
  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected.');
  });
  mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected');
  });
}

export const disconnectDB = async (): Promise<void> => {
  await mongoose.connection.close();
  if (memoryServer) {
    await memoryServer.stop();
  }
  console.log('MongoDB connection closed');
};

export default connectDB;
