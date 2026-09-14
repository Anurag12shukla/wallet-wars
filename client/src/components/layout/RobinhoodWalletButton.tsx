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
        className="btn-primary py-2 px-4 text-xs tracking-wider flex items-center gap-2"
      >
        <span>👑</span>
        <span>{isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}</span>
      </button>
    );
  }

  // Wrong network state
  if (!isCorrectNetwork) {
    return (
      <button
        onClick={switchToRobinhood}
        className="px-3.5 py-1.5 rounded-xl bg-crimson text-white font-display font-bold text-xs tracking-wider hover:bg-crimson-dark transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] flex items-center gap-2 animate-pulse"
      >
        <span className="w-2 h-2 rounded-full bg-white" />
        <span>SWITCH TO TESTNET (46630)</span>
      </button>
    );
  }

  // Connected state on Robinhood Testnet
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(prev => !prev)}
        className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-gold-500/40 bg-obsidian-card hover:border-gold-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all text-xs"
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          <span className="hidden sm:inline-block font-mono text-[11px] text-gold-400 font-semibold">
            Robinhood Testnet
          </span>
        </div>

        {balance !== null && (
          <span className="hidden md:inline-block px-1.5 py-0.5 rounded bg-black/60 text-[11px] font-mono text-gold-300 border border-gold-500/20">
            {balance} ETH
          </span>
        )}

        <span className="font-mono text-white text-xs font-semibold">
          {shortenAddress(account)}
        </span>

        <span className="text-[10px] text-gold-400">▼</span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-gold-500/30 bg-obsidian-card p-2 shadow-2xl z-50 backdrop-blur-xl">
          <div className="px-3 py-2.5 border-b border-gold-500/20 mb-1">
            <p className="text-[10px] font-mono text-gold-400 uppercase tracking-wider">Connected Account</p>
            <p className="text-xs font-mono text-white break-all mt-0.5">{account}</p>
          </div>

          <button
            onClick={handleCopy}
            className="w-full text-left px-3 py-2 text-xs font-display tracking-wider text-gray-300 hover:text-white hover:bg-gold-500/10 rounded-lg transition-colors flex items-center justify-between"
          >
            <span>📋 Copy Address</span>
            {copied && <span className="text-gold-400 text-[10px]">Copied!</span>}
          </button>

          <a
            href={getExplorerAddressUrl(account)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-left px-3 py-2 text-xs font-display tracking-wider text-gray-300 hover:text-white hover:bg-gold-500/10 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>🔍 View on Explorer</span>
          </a>

          <div className="border-t border-gold-500/20 my-1" />

          <button
            onClick={() => {
              disconnect();
              setDropdownOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-xs font-display tracking-wider text-crimson hover:bg-crimson/10 rounded-lg transition-colors"
          >
            🚪 Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
