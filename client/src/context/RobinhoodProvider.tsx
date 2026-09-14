import React from 'react';
import { EVMWalletProvider } from './EVMWalletContext';

export function RobinhoodProvider({ children }: { children: React.ReactNode }) {
  return <EVMWalletProvider>{children}</EVMWalletProvider>;
}

export default RobinhoodProvider;
