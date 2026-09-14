export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/wallet-wars',
  robinhoodRpcUrl: process.env.ROBINHOOD_RPC_URL || 'https://rpc.testnet.chain.robinhood.com',
  robinhoodChainId: parseInt(process.env.ROBINHOOD_CHAIN_ID || '46630', 10),
  robinhoodNetwork: process.env.ROBINHOOD_NETWORK || 'testnet',
  solanaRpcUrl: process.env.ROBINHOOD_RPC_URL || 'https://rpc.testnet.chain.robinhood.com',
  solanaNetwork: process.env.ROBINHOOD_NETWORK || 'Robinhood Testnet (46630)',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  nodeEnv: process.env.NODE_ENV || 'development',
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
  },
  walletAnalysisCacheTTL: 60 * 60 * 1000, // 1 hour
};
