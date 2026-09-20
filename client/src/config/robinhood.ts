/**
 * Robinhood Chain (Chain ID 4663) Configuration - Mainnet
 */

export const ROBINHOOD_MAINNET = {
  chainId: 4663,
  chainIdHex: '0x1237',
  name: 'Robinhood Chain',
  rpcUrl: 'https://rpc.mainnet.chain.robinhood.com',
  currency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  explorerUrl: 'https://robinhoodchain.blockscout.com',
};

// Aliases for compatibility
export const ROBINHOOD_CHAIN = ROBINHOOD_MAINNET;
export const ROBINHOOD_TESTNET = ROBINHOOD_MAINNET; // Backward compatibility alias

// Deployed Arena Contract Address on Robinhood Chain Mainnet
export const ARENA_CONTRACT_ADDRESS = '0x4663000000000000000000000000000000004663';

/**
 * Request injected EVM provider to switch or add Robinhood Testnet
 */
export async function switchOrAddRobinhoodNetwork(injectedProvider?: any): Promise<boolean> {
  const eth = injectedProvider || (typeof window !== 'undefined' ? (window as any).ethereum : null);
  if (!eth) {
    throw new Error('No EVM wallet detected. Please install Robinhood Wallet, MetaMask, or another Web3 wallet.');
  }

  try {
    // Attempt network switch
    await eth.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ROBINHOOD_MAINNET.chainIdHex }],
    });
    return true;
  } catch (switchError: any) {
    // Error 4902 means the chain has not been added to MetaMask/Robinhood Wallet yet
    if (switchError.code === 4902 || switchError?.data?.originalError?.code === 4902) {
      try {
        await eth.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: ROBINHOOD_MAINNET.chainIdHex,
              chainName: ROBINHOOD_MAINNET.name,
              rpcUrls: [ROBINHOOD_MAINNET.rpcUrl],
              nativeCurrency: ROBINHOOD_MAINNET.currency,
              blockExplorerUrls: [ROBINHOOD_MAINNET.explorerUrl],
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add Robinhood Chain to wallet:', addError);
        throw addError;
      }
    }
    console.error('Failed to switch to Robinhood Chain:', switchError);
    throw switchError;
  }
}

export function getExplorerAddressUrl(address: string): string {
  if (!address) return ROBINHOOD_MAINNET.explorerUrl;
  return `${ROBINHOOD_MAINNET.explorerUrl}/address/${address}`;
}

export function getExplorerTxUrl(txHash: string): string {
  if (!txHash) return ROBINHOOD_MAINNET.explorerUrl;
  return `${ROBINHOOD_MAINNET.explorerUrl}/tx/${txHash}`;
}
