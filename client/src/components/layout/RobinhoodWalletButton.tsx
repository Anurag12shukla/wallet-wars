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
        className="px-4 py-2 rounded-xl bg-pastel-pink-100 border border-pastel-pink-200 text-pastel-pink-700 font-display font-bold text-xs tracking-wider hover:bg-pastel-pink-200 transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0"
      >
        <span className="w-2 h-2 rounded-full bg-pastel-pink-600" />
        <span>SWITCH TO MAINNET (4663)</span>
      </button>
    );
  }

  // Connected state on Robinhood Chain Mainnet
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(prev => !prev)}
        className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 shadow-soft-xs transition-all text-xs whitespace-nowrap flex-shrink-0"
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="hidden sm:inline-block font-mono text-[11px] text-slate-600 font-semibold">
            Robinhood Chain
          </span>
        </div>

        {balance !== null && (
          <span className="hidden md:inline-block px-1.5 py-0.5 rounded bg-stone-100 text-[11px] font-mono text-slate-700 border border-stone-200 font-medium">
            {balance} ETH
          </span>
        )}

        <span className="font-mono text-slate-900 text-xs font-semibold">
          {shortenAddress(account)}
        </span>

        <span className="text-[10px] text-slate-400">▼</span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-stone-200 bg-white p-2 shadow-soft-md z-50">
          <div className="px-3 py-2.5 border-b border-stone-100 mb-1">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Connected Account</p>
            <p className="text-xs font-mono text-slate-900 break-all mt-0.5 font-medium">{account}</p>
          </div>

          <button
            onClick={handleCopy}
            className="w-full text-left px-3 py-2 text-xs font-display font-medium tracking-wide text-slate-700 hover:text-slate-900 hover:bg-stone-50 rounded-lg transition-colors flex items-center justify-between"
          >
            <span>📋 Copy Address</span>
            {copied && <span className="text-emerald-600 text-[10px] font-semibold">Copied!</span>}
          </button>

          <a
            href={getExplorerAddressUrl(account)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-left px-3 py-2 text-xs font-display font-medium tracking-wide text-slate-700 hover:text-slate-900 hover:bg-stone-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>🔍 View on Explorer</span>
          </a>

          <div className="border-t border-stone-100 my-1" />

          <button
            onClick={() => {
              disconnect();
              setDropdownOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-xs font-display font-semibold tracking-wide text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            🚪 Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
