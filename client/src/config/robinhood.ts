/**
 * Robinhood Network (Chain ID 46630) Configuration
 */

export const ROBINHOOD_TESTNET = {
  chainId: 46630,
  chainIdHex: '0xb626',
  name: 'Robinhood Testnet',
  rpcUrl: 'https://rpc.testnet.chain.robinhood.com',
  currency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  explorerUrl: 'https://explorer.testnet.chain.robinhood.com',
};

// Deployed Arena Contract Address on Robinhood Testnet
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
      params: [{ chainId: ROBINHOOD_TESTNET.chainIdHex }],
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
              chainId: ROBINHOOD_TESTNET.chainIdHex,
              chainName: ROBINHOOD_TESTNET.name,
              rpcUrls: [ROBINHOOD_TESTNET.rpcUrl],
              nativeCurrency: ROBINHOOD_TESTNET.currency,
              blockExplorerUrls: [ROBINHOOD_TESTNET.explorerUrl],
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add Robinhood Testnet to wallet:', addError);
        throw addError;
      }
    }
    console.error('Failed to switch to Robinhood Testnet:', switchError);
    throw switchError;
  }
}

export function getExplorerAddressUrl(address: string): string {
  if (!address) return ROBINHOOD_TESTNET.explorerUrl;
  return `${ROBINHOOD_TESTNET.explorerUrl}/address/${address}`;
}

export function getExplorerTxUrl(txHash: string): string {
  if (!txHash) return ROBINHOOD_TESTNET.explorerUrl;
  return `${ROBINHOOD_TESTNET.explorerUrl}/tx/${txHash}`;
}
