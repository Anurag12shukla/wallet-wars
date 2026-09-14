import { getAddress, isAddress } from 'ethers';

export function isValidRobinhoodOrWalletAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  const str = String(address).trim();
  
  if (str.startsWith('demo_')) return true;
  if (isAddress(str)) return true;
  if (/^@?[a-zA-Z0-9_\-\.]{3,44}$/.test(str)) return true;

  return false;
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
