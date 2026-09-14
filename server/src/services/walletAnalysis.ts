import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { config } from '../config';

export interface WalletAnalysisResult {
  walletAddress: string;
  walletAge: number; // days
  transactionCount: number;
  transactionFrequency: number; // tx per day
  tokenActivity: number; // 0-100
  nftActivity: number; // 0-100
  defiActivity: number; // 0-100
  tradingActivity: number; // 0-100
  holdingScore: number; // 0-100
  riskScore: number; // 0-100
  activityScore: number; // 0-100
  solBalance: number;
  estimatedPortfolioTier: 'micro' | 'small' | 'medium' | 'large' | 'whale';
  calculatedAt: Date;
  isEstimated: boolean;
}

const connection = new Connection(config.solanaRpcUrl, 'confirmed');

function scoreFromCount(count: number, lowMark: number, highMark: number): number {
  if (count <= 0) return 0;
  if (count >= highMark) return 100;
  return Math.min(100, Math.round((count / highMark) * 100));
}

export async function analyzeWallet(walletAddress: string): Promise<WalletAnalysisResult> {
  let pubkey: PublicKey;
  try {
    pubkey = new PublicKey(walletAddress);
  } catch {
    throw new Error('Invalid Solana wallet address');
  }

  const result: WalletAnalysisResult = {
    walletAddress: walletAddress.toLowerCase(),
    walletAge: 0,
    transactionCount: 0,
    transactionFrequency: 0,
    tokenActivity: 0,
    nftActivity: 0,
    defiActivity: 0,
    tradingActivity: 0,
    holdingScore: 50,
    riskScore: 50,
    activityScore: 0,
    solBalance: 0,
    estimatedPortfolioTier: 'micro',
    calculatedAt: new Date(),
    isEstimated: false,
  };

  try {
    // Get SOL balance
    const balance = await connection.getBalance(pubkey);
    result.solBalance = balance / LAMPORTS_PER_SOL;

    // Determine portfolio tier
    if (result.solBalance < 1) result.estimatedPortfolioTier = 'micro';
    else if (result.solBalance < 10) result.estimatedPortfolioTier = 'small';
    else if (result.solBalance < 100) result.estimatedPortfolioTier = 'medium';
    else if (result.solBalance < 1000) result.estimatedPortfolioTier = 'large';
    else result.estimatedPortfolioTier = 'whale';

    // Get transaction signatures (limited to avoid rate limits)
    const signatures = await connection.getSignaturesForAddress(pubkey, { limit: 100 });
    result.transactionCount = signatures.length;

    if (signatures.length > 0) {
      // Wallet age calculation
      const oldest = signatures[signatures.length - 1];
      const newest = signatures[0];
      if (oldest.blockTime && newest.blockTime) {
        const oldestDate = new Date(oldest.blockTime * 1000);
        const now = new Date();
        result.walletAge = Math.max(1, Math.round((now.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24)));
        result.transactionFrequency = parseFloat((result.transactionCount / result.walletAge).toFixed(2));
      }
    }

    // Score activity
    result.activityScore = scoreFromCount(result.transactionCount, 10, 500);
    result.tradingActivity = scoreFromCount(result.transactionFrequency * 30, 5, 300);

    // Token activity - check token accounts
    try {
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubkey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      });
      const tokenCount = tokenAccounts.value.length;
      result.tokenActivity = scoreFromCount(tokenCount, 1, 50);

      // Estimate NFT activity from metadata program tokens
      const nftLikeAccounts = tokenAccounts.value.filter(acc => {
        const info = acc.account.data.parsed?.info;
        return info?.tokenAmount?.decimals === 0 && parseInt(info?.tokenAmount?.amount || '0') === 1;
      });
      result.nftActivity = scoreFromCount(nftLikeAccounts.length, 1, 30);
    } catch {
      result.tokenActivity = 30; // estimate
      result.isEstimated = true;
    }

    // Estimate DeFi activity from tx count and patterns
    result.defiActivity = Math.min(100, Math.round(result.tradingActivity * 0.7 + result.tokenActivity * 0.3));

    // Holding score: inversely related to trading + high balance
    const tradeIntensity = (result.tradingActivity + result.tokenActivity) / 2;
    result.holdingScore = Math.max(0, 100 - Math.round(tradeIntensity * 0.6));
    if (result.solBalance > 10) result.holdingScore = Math.min(100, result.holdingScore + 20);

    // Risk score
    result.riskScore = Math.min(100, Math.round(
      result.tradingActivity * 0.4 +
      result.nftActivity * 0.3 +
      result.defiActivity * 0.3
    ));

  } catch (error: unknown) {
    // If RPC fails, generate deterministic scores from address hash
    console.warn('RPC analysis failed, using deterministic fallback:', error instanceof Error ? error.message : String(error));
    result.isEstimated = true;
    const hash = deterministicHash(walletAddress);
    result.walletAge = 30 + (hash % 500);
    result.transactionCount = 10 + (hash % 490);
    result.transactionFrequency = parseFloat(((hash % 20) / 10).toFixed(2));
    result.tokenActivity = hash % 100;
    result.nftActivity = (hash * 3) % 100;
    result.defiActivity = (hash * 7) % 100;
    result.tradingActivity = (hash * 11) % 100;
    result.holdingScore = (hash * 13) % 100;
    result.riskScore = (hash * 17) % 100;
    result.activityScore = (hash * 19) % 100;
  }

  return result;
}

export function deterministicHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}
