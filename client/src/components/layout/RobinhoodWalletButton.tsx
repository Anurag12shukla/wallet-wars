import React, { useState, useRef, useEffect } from 'react';
import { useEVMWallet } from '../../context/EVMWalletContext';
import { shortenAddress } from '../../utils';
import { getExplorerAddressUrl } from '../../config/robinhood';

export default function RobinhoodWalletButton() {
  const {
    account,
    isCorrectNetwork,
    balance,
    isConnecting,
    connect,
    disconnect,
    switchToRobinhood,
  } = useEVMWallet();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Disconnected state
  if (!account) {
    return (
      <button
        onClick={connect}
        disabled={isConnecting}
        className="px-4 py-2 rounded-xl bg-robinhood-green text-black font-display font-bold text-xs tracking-wider hover:bg-robinhood-green-light transition-all shadow-[0_0_15px_rgba(0,200,5,0.3)] disabled:opacity-50 flex items-center gap-1.5"
      >
        <span>🏹</span>
        <span>{isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}</span>
      </button>
    );
  }

  // Wrong network state
  if (!isCorrectNetwork) {
    return (
      <button
        onClick={switchToRobinhood}
        className="px-3.5 py-1.5 rounded-xl bg-robinhood-red text-white font-display font-bold text-xs tracking-wider hover:bg-robinhood-red-light transition-all shadow-[0_0_15px_rgba(255,80,0,0.4)] flex items-center gap-2 animate-pulse"
      >
        <span className="w-2 h-2 rounded-full bg-white" />
        <span>SWITCH TO ROBINHOOD (46630)</span>
      </button>
    );
  }

  // Connected state on Robinhood Testnet
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(prev => !prev)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-robinhood-green/40 bg-robinhood-card hover:border-robinhood-green hover:shadow-[0_0_15px_rgba(0,200,5,0.25)] transition-all text-xs"
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-robinhood-green animate-pulse" />
          <span className="hidden sm:inline-block font-mono text-[11px] text-robinhood-green font-semibold">
            Robinhood Testnet
          </span>
        </div>

        {balance !== null && (
          <span className="hidden md:inline-block px-1.5 py-0.5 rounded bg-black/50 text-[11px] font-mono text-gray-300">
            {balance} ETH
          </span>
        )}

        <span className="font-mono text-white text-xs font-semibold">
          {shortenAddress(account)}
        </span>

        <span className="text-[10px] text-gray-400">▼</span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-robinhood-border bg-robinhood-darker p-2 shadow-2xl z-50">
          <div className="px-3 py-2 border-b border-robinhood-border mb-1">
            <p className="text-[10px] font-mono text-gray-400 uppercase">Connected Account</p>
            <p className="text-xs font-mono text-white break-all mt-0.5">{account}</p>
          </div>

          <button
            onClick={handleCopy}
            className="w-full text-left px-3 py-2 text-xs font-display tracking-wider text-gray-300 hover:text-white hover:bg-robinhood-card rounded-lg transition-colors flex items-center justify-between"
          >
            <span>📋 Copy Address</span>
            {copied && <span className="text-robinhood-green text-[10px]">Copied!</span>}
          </button>

          <a
            href={getExplorerAddressUrl(account)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-left px-3 py-2 text-xs font-display tracking-wider text-gray-300 hover:text-white hover:bg-robinhood-card rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>🔍 View on Explorer</span>
          </a>

          <div className="border-t border-robinhood-border my-1" />

          <button
            onClick={() => {
              disconnect();
              setDropdownOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-xs font-display tracking-wider text-robinhood-red hover:bg-robinhood-card rounded-lg transition-colors"
          >
            🚪 Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
