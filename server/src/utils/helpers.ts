import { PublicKey } from '@solana/web3.js';

export function isValidRobinhoodOrWalletAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  const trimmed = address.trim();
  
  // Robinhood EVM Web3 Wallet (Arbitrum, Polygon, Ethereum)
  if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) return true;
  
  // Robinhood username / account handle / profile ID (e.g. @anurag, wsb_trader, robinhood-whale)
  if (/^@?[a-zA-Z0-9_\-\.]{3,44}$/.test(trimmed)) return true;
  
  // Solana / Base58 Crypto Address
  try {
    const pubkey = new PublicKey(trimmed);
    return PublicKey.isOnCurve(pubkey.toBytes());
  } catch {
    return false;
  }
}

// Retain alias for backward compatibility
export const isValidSolanaAddress = isValidRobinhoodOrWalletAddress;

export function normalizeWalletAddress(address: string): string {
  return address.trim().toLowerCase();
}

export function paginateQuery(page: number, limit: number) {
  const skip = (page - 1) * limit;
  return { skip, limit: Math.min(limit, 100) };
}

export function formatSuccess<T>(data: T) {
  return { success: true, data };
}

export function formatError(code: string, message: string) {
  return { success: false, error: { code, message } };
}
