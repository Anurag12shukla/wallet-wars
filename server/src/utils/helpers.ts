import { PublicKey } from '@solana/web3.js';

export function isValidSolanaAddress(address: string): boolean {
  try {
    const pubkey = new PublicKey(address);
    return PublicKey.isOnCurve(pubkey.toBytes());
  } catch {
    return false;
  }
}

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
