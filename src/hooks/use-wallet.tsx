import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider, Signer } from 'ethers';

// Define the structure of the provider that modern EVM wallets expose
// This interface allows TypeScript to recognize the methods we use.
interface EthereumProvider extends EventTarget {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (eventName: string, listener: (args: any) => void) => void;
  removeListener: (eventName: string, listener: (args: any) => void) => void;
}

// Define the return type of the hook for clear usage in components
interface WalletHook {
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  signer: Signer | null;
  provider: BrowserProvider | null;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (chainIdHex: string) => Promise<void>;
}

/**
 * Custom React Hook to manage EVM wallet connection, state, and events.
 * It uses the standard window.ethereum interface (compatible with Core, MetaMask, etc.)
 */
export const useWallet = (): WalletHook => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isConnected = !!account;

  const getEthereum = useCallback((): EthereumProvider | undefined => {
    // Core Wallet and MetaMask both inject 'ethereum' into the window object
    const { ethereum } = window as any;
    if (ethereum) {
      return ethereum as EthereumProvider;
    }
    return undefined;
  }, []);

  const clearState = () => {
    setAccount(null);
    setChainId(null);
    setSigner(null);
    setProvider(null);
    setError(null);
  };

  const handleAccountsChanged = useCallback(
    (accounts: string[]) => {
      if (accounts.length === 0) {
        // Wallet disconnected or locked
        console.log('Wallet disconnected.');
        clearState();
      } else {
        // Account switched
        const newAccount = accounts[0].toLowerCase();
        console.log('Account switched to:', newAccount);
        setAccount(newAccount);
        // The Signer/Provider will be re-initialized in the useEffect when account changes
      }
    },
    [],
  );

  const handleChainChanged = useCallback((hexChainId: string) => {
    const newChainId = parseInt(hexChainId, 16);
    console.log('Chain switched to:', newChainId);
    setChainId(newChainId);
    // Force a full window reload/re-render for proper dApp context refresh
    window.location.reload();
  }, []);

  const initializeWallet = useCallback(async (eth: EthereumProvider) => {
    try {
      setError(null);
      
      const provider = new BrowserProvider(eth);
      const network = await provider.getNetwork();
      setChainId(Number(network.chainId));

      const currentAccounts = (await eth.request({ method: 'eth_accounts' })) as string[];
      if (currentAccounts.length > 0) {
        const connectedAccount = currentAccounts[0].toLowerCase();
        setAccount(connectedAccount);
        setProvider(provider);
        const signer = await provider.getSigner();
        setSigner(signer);
      } else {
        clearState();
      }
    } catch (e) {
      console.error("Error initializing wallet state:", e);
      clearState();
      setError("Failed to read initial wallet state.");
    }
  }, []);

  // 1. Initial check and setting up listeners
  useEffect(() => {
    const eth = getEthereum();

    if (!eth) return;

    // A. Check for initial connection state
    initializeWallet(eth);

    // B. Set up event listeners for changes
    eth.on('accountsChanged', handleAccountsChanged);
    eth.on('chainChanged', handleChainChanged);
    eth.on('disconnect', clearState); // Generic disconnect handling

    // C. Clean up listeners on unmount
    return () => {
      eth.removeListener('accountsChanged', handleAccountsChanged);
      eth.removeListener('chainChanged', handleChainChanged);
      eth.removeListener('disconnect', clearState);
    };
  }, [getEthereum, initializeWallet, handleAccountsChanged, handleChainChanged]);


  // --- Public Functions ---

  const connectWallet = useCallback(async () => {
    const eth = getEthereum();
    if (!eth) {
      setError('EVM wallet not detected (e.g., Core or MetaMask). Please install one.');
      return;
    }

    try {
      setError(null);
      // Request account access. This prompts the user to connect.
      const accounts = (await eth.request({ method: 'eth_requestAccounts' })) as string[];
      
      if (accounts.length > 0) {
        const connectedAccount = accounts[0].toLowerCase();
        setAccount(connectedAccount);
        
        // Re-initialize provider/signer after successful connection
        const provider = new BrowserProvider(eth);
        setProvider(provider);
        const signer = await provider.getSigner();
        setSigner(signer);
        
        const network = await provider.getNetwork();
        setChainId(Number(network.chainId));

        console.log('Wallet connected:', connectedAccount);
      }
    } catch (e: any) {
      console.error('Connection error:', e);
      if (e.code === 4001) {
        setError('Connection request rejected by user.');
      } else {
        setError('Failed to connect wallet.');
      }
      clearState();
    }
  }, [getEthereum]);

  const disconnectWallet = useCallback(() => {
    // In standard EVM wallets, there is no explicit 'disconnect' method in the provider.
    // Disconnection is usually handled by the user via the wallet interface or by clearing local state.
    clearState();
    console.log('Manually disconnected wallet state from application.');
  }, []);

  const switchNetwork = useCallback(async (chainIdHex: string) => {
    const eth = getEthereum();
    if (!eth || !isConnected) {
      setError('Cannot switch network: Wallet is not connected or provider is missing.');
      return;
    }

    try {
      setError(null);
      // Avalanche C-Chain is 43114 (0xa86a in hex)
      await eth.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
      // chainChanged event listener (handleChainChanged) will automatically reload the app
    } catch (switchError: any) {
      // 4902 is the error code for unrecognised chain ID
      if (switchError.code === 4902) {
        setError('The requested chain is not configured in the wallet. You may need to add it manually.');
      } else {
        setError('Failed to switch network.');
      }
      console.error('Switch network error:', switchError);
    }
  }, [getEthereum, isConnected]);

  return {
    isConnected,
    account,
    chainId,
    signer,
    provider,
    error,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };
};