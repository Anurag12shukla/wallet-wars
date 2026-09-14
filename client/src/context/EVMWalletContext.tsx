import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BrowserProvider, JsonRpcSigner, formatEther } from 'ethers';
import { ROBINHOOD_TESTNET, switchOrAddRobinhoodNetwork } from '../config/robinhood';

interface EVMWalletContextType {
  account: string | null;
  chainId: number | null;
  isCorrectNetwork: boolean;
  balance: string | null;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToRobinhood: () => Promise<void>;
}

const EVMWalletContext = createContext<EVMWalletContextType | null>(null);

export function EVMWalletProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCorrectNetwork = chainId === ROBINHOOD_TESTNET.chainId;

  const refreshBalance = useCallback(async (userAccount: string, currentProvider: BrowserProvider) => {
    try {
      const bal = await currentProvider.getBalance(userAccount);
      setBalance(parseFloat(formatEther(bal)).toFixed(4));
    } catch {
      setBalance(null);
    }
  }, []);

  const initConnection = useCallback(async (ethereum: any) => {
    try {
      const bp = new BrowserProvider(ethereum);
      const network = await bp.getNetwork();
      const currentChainId = Number(network.chainId);
      setChainId(currentChainId);
      setProvider(bp);

      const accounts = await bp.listAccounts();
      if (accounts.length > 0) {
        const activeSigner = await bp.getSigner();
        const activeAddress = accounts[0].address;
        setAccount(activeAddress);
        setSigner(activeSigner);
        await refreshBalance(activeAddress, bp);
      } else {
        setAccount(null);
        setSigner(null);
        setBalance(null);
      }
    } catch (err: any) {
      console.error('Error initializing EVM wallet connection:', err);
    }
  }, [refreshBalance]);

  // Handle eager connection on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const ethereum = (window as any).ethereum;
      initConnection(ethereum);

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount(null);
          setSigner(null);
          setBalance(null);
        } else {
          initConnection(ethereum);
        }
      };

      const handleChainChanged = () => {
        initConnection(ethereum);
      };

      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [initConnection]);

  const connect = useCallback(async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      window.open('https://robinhood.com/us/en/about/crypto/', '_blank');
      return;
    }

    setIsConnecting(true);
    setError(null);
    try {
      const ethereum = (window as any).ethereum;
      await ethereum.request({ method: 'eth_requestAccounts' });
      await initConnection(ethereum);

      // Prompt switch to Robinhood Testnet if not on it
      const bp = new BrowserProvider(ethereum);
      const network = await bp.getNetwork();
      if (Number(network.chainId) !== ROBINHOOD_TESTNET.chainId) {
        try {
          await switchOrAddRobinhoodNetwork(ethereum);
          await initConnection(ethereum);
        } catch {
          // User rejected network switch, but wallet is still connected
        }
      }
    } catch (err: any) {
      console.error('Failed to connect EVM wallet:', err);
      setError(err?.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [initConnection]);

  const disconnect = useCallback(() => {
    setAccount(null);
    setSigner(null);
    setBalance(null);
  }, []);

  const switchToRobinhood = useCallback(async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) return;
    try {
      await switchOrAddRobinhoodNetwork((window as any).ethereum);
      if (provider) {
        await initConnection((window as any).ethereum);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to switch network');
    }
  }, [provider, initConnection]);

  return (
    <EVMWalletContext.Provider
      value={{
        account,
        chainId,
        isCorrectNetwork,
        balance,
        provider,
        signer,
        isConnecting,
        error,
        connect,
        disconnect,
        switchToRobinhood,
      }}
    >
      {children}
    </EVMWalletContext.Provider>
  );
}

export function useEVMWallet() {
  const context = useContext(EVMWalletContext);
  if (!context) {
    throw new Error('useEVMWallet must be used within EVMWalletProvider');
  }
  return context;
}
