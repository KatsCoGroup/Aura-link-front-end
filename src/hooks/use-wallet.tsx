import { useState, useEffect, useCallback, useRef, useContext, createContext } from 'react';
import { BrowserProvider, Signer } from 'ethers';
import EthereumProviderWC from '@walletconnect/ethereum-provider';

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
  connectWallet: (connector?: ConnectorType) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  switchNetwork: (chainIdHex: string) => Promise<void>;
}

type ConnectorType = 'walletconnect' | 'injected' | 'metamask' | 'phantom' | 'trust';
type InjectedTarget = 'injected' | 'metamask' | 'phantom' | 'trust';

const WalletContext = createContext<WalletHook | null>(null);

/**
 * Custom React Hook to manage EVM wallet connection, state, and events.
 * It uses the standard window.ethereum interface (compatible with Core, MetaMask, etc.)
 */
const useWalletInternal = (): WalletHook => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const wcProviderRef = useRef<any>(null);
  const walletKitRef = useRef<any>(null);
  const activeInjectedRef = useRef<any>(null);

  const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 43113);
  const WC_PROJECT_ID = import.meta.env.VITE_WC_PROJECT_ID;

  const isConnected = !!account;

  const getEthereum = useCallback((): EthereumProvider | undefined => {
    const { ethereum } = window as any;
    if (ethereum) {
      return ethereum as EthereumProvider;
    }
    return undefined;
  }, []);

  const clearState = useCallback(() => {
    setAccount(null);
    setChainId(null);
    setSigner(null);
    setProvider(null);
    setError(null);
  }, []);

  const clearWalletConnectStorage = useCallback(() => {
    try {
      const removeMatchingKeys = (storage: Storage) => {
        Object.keys(storage)
          .filter(
            (key) =>
              key.startsWith('wc@2') ||
              key.startsWith('wc@') ||
              key.startsWith('walletconnect') ||
              key.startsWith('WALLETCONNECT'),
          )
          .forEach((key) => storage.removeItem(key));
      };

      removeMatchingKeys(localStorage);
      localStorage.removeItem('walletconnect');
      localStorage.removeItem('WALLETCONNECT_DEEPLINK_CHOICE');

      removeMatchingKeys(sessionStorage);
    } catch (err) {
      console.warn('Unable to clear WalletConnect cache', err);
    }
  }, []);

  const selectInjectedProvider = useCallback(
    (target: InjectedTarget = 'injected'): EthereumProvider | undefined => {
      const anyWin = window as any;
      const eth = anyWin.ethereum as any;
      const providers: any[] = Array.isArray(eth?.providers) ? eth.providers : [];

      const pick = (fn: (p: any) => boolean) => providers.find(fn);

      if (target === 'metamask') {
        return (pick((p) => p.isMetaMask) || (eth?.isMetaMask ? eth : undefined)) as EthereumProvider;
      }

      if (target === 'phantom') {
        return (
          (anyWin.phantom?.ethereum as EthereumProvider) ||
          (pick((p) => p.isPhantom) as EthereumProvider) ||
          undefined
        );
      }

      if (target === 'trust') {
        return (pick((p) => p.isTrust) || (eth?.isTrust ? eth : undefined)) as EthereumProvider;
      }

      // Fallback: single provider or default ethereum
      if (providers.length === 1) return providers[0] as EthereumProvider;
      return eth as EthereumProvider | undefined;
    },
    [],
  );

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
    [clearState],
  );

  const handleChainChanged = useCallback((hexChainId: string) => {
    const newChainId = parseInt(hexChainId, 16);
    console.log('Chain switched to:', newChainId);
    setChainId(newChainId);
    // Force a full window reload/re-render for proper dApp context refresh
    window.location.reload();
  }, []);

  // Fully tear down existing provider sessions so the next connect always shows a picker/modal
  const teardownConnections = useCallback(async () => {
    if (activeInjectedRef.current) {
      try {
        activeInjectedRef.current.removeListener('accountsChanged', handleAccountsChanged);
        activeInjectedRef.current.removeListener('chainChanged', handleChainChanged);
        activeInjectedRef.current.removeListener('disconnect', clearState);
      } catch (err) {
        console.warn('Unable to remove listeners from injected provider', err);
      }
      activeInjectedRef.current = null;
    }

    if (wcProviderRef.current) {
      try {
        wcProviderRef.current.removeListener('accountsChanged', handleAccountsChanged);
        wcProviderRef.current.removeListener('chainChanged', handleChainChanged);
        wcProviderRef.current.removeListener('disconnect', clearState);
      } catch (err) {
        console.warn('Unable to remove listeners from WalletConnect provider', err);
      }

      if (wcProviderRef.current.disconnect) {
        try {
          await wcProviderRef.current.disconnect();
        } catch (err) {
          console.warn('Unable to fully disconnect WalletConnect provider', err);
        }
      }

      // Extra guard: clear any lingering pairings/sessions if SDK exposes helpers
      try {
        const client = wcProviderRef.current.client || wcProviderRef.current.connector?.client;
        const pairings =
          client?.core?.pairing?.getPairings?.() || client?.core?.pairing?.getAll?.() || [];
        for (const pairing of pairings) {
          const topic = pairing?.topic;
          if (!topic) continue;
          try {
            await client.core.pairing.disconnect({
              topic,
              reason: { code: 6000, message: 'User disconnected' },
            });
          } catch (err) {
            try {
              await client.core.pairing.delete(topic, { code: 6000, message: 'User disconnected' });
            } catch (_) {
              // swallow
            }
          }
        }
        if (wcProviderRef.current.cleanupPendingPairings) {
          await wcProviderRef.current.cleanupPendingPairings().catch(() => {});
        }
      } catch (err) {
        console.warn('Unable to clear WalletConnect pairings', err);
      }

      wcProviderRef.current = null;
    }

    if (walletKitRef.current?.disconnect) {
      try {
        await walletKitRef.current.disconnect();
      } catch (err) {
        console.warn('Unable to disconnect WalletKit session', err);
      }
    }
    walletKitRef.current = null;
  }, [clearState, handleAccountsChanged, handleChainChanged]);

  const initWalletConnect = useCallback(async () => {
    if (!WC_PROJECT_ID) {
      setError('WalletConnect not configured (set VITE_WC_PROJECT_ID).');
      return null;
    }

    const attemptWalletKit = async () => {
      try {
        if (!walletKitRef.current) {
          const walletKitModule = await import('@reown/walletkit');
          const WalletKit = walletKitModule.default || (walletKitModule as any);
          if (!WalletKit?.init) throw new Error('WalletKit init missing');
          walletKitRef.current = await WalletKit.init({
            projectId: WC_PROJECT_ID,
            metadata: {
              name: 'AuraLink',
              description: 'AuraLink dApp',
              url: 'https://aura.link',
              icons: ['https://aura.link/icon.png'],
            },
          });
        }

        const kit = walletKitRef.current;
        const wc = kit?.getEthereumProvider
          ? await kit.getEthereumProvider({
              projectId: WC_PROJECT_ID,
              chains: [CHAIN_ID],
              optionalChains: [CHAIN_ID],
              showQrModal: true,
            })
          : kit?.ethereumProvider
            ? await kit.ethereumProvider({
                projectId: WC_PROJECT_ID,
                chains: [CHAIN_ID],
                optionalChains: [CHAIN_ID],
                showQrModal: true,
              })
            : null;

        if (!wc) throw new Error('WalletKit ethereum provider unavailable');
        return wc;
      } catch (err) {
        console.warn('WalletKit not available, falling back to WC provider', err);
        return null;
      }
    };

    const attachProvider = async (wc: any) => {
      wc.on('accountsChanged', handleAccountsChanged);
      wc.on('chainChanged', handleChainChanged);
      wc.on('disconnect', clearState);

      wcProviderRef.current = wc;
      if (typeof wc.enable === 'function') {
        await wc.enable();
      } else if (typeof wc.request === 'function') {
        await wc.request({ method: 'eth_requestAccounts' });
      }
      const provider = new BrowserProvider(wc as any);
      const signer = await provider.getSigner();
      const net = await provider.getNetwork();
      setAccount((await signer.getAddress()).toLowerCase());
      setProvider(provider);
      setSigner(signer);
      setChainId(Number(net.chainId));
      return wc;
    };

    try {
      clearWalletConnectStorage();
      const wcFromWalletKit = await attemptWalletKit();
      if (wcFromWalletKit) {
        return await attachProvider(wcFromWalletKit);
      }

      const wc = await EthereumProviderWC.init({
        projectId: WC_PROJECT_ID,
        chains: [CHAIN_ID],
        optionalChains: [CHAIN_ID],
        showQrModal: true,
        optionalMethods: [
          'eth_sendTransaction',
          'personal_sign',
          'eth_signTypedData',
          'eth_signTypedData_v4',
        ],
      });

      return await attachProvider(wc);
    } catch (e) {
      console.error('WalletConnect init error', e);
      clearWalletConnectStorage();
      setError('Failed to connect via WalletConnect.');
      return null;
    }
  }, [
    CHAIN_ID,
    WC_PROJECT_ID,
    clearState,
    clearWalletConnectStorage,
    handleAccountsChanged,
    handleChainChanged,
  ]);

  const connectInjected = useCallback(
    async (target: InjectedTarget = 'injected') => {
      const eth = selectInjectedProvider(target);
      if (!eth) {
        throw new Error('No injected wallet detected in the browser.');
      }

      // Ask wallet to show account picker even if already authorized
      try {
        await eth.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
      } catch (err) {
        console.warn('wallet_requestPermissions not supported, falling back to eth_requestAccounts');
      }

      let accounts: string[] = [];
      try {
        accounts = (await eth.request({ method: 'eth_requestAccounts' })) as string[];
      } catch (err) {
        console.error('Failed to request accounts from injected wallet', err);
        setError('Wallet request was cancelled or failed. Please try again and pick an account.');
        throw err;
      }
      if (!accounts.length) {
        throw new Error('No accounts returned by injected wallet');
      }

      const connectedAccount = accounts[0].toLowerCase();
      const nextProvider = new BrowserProvider(eth);
      const nextSigner = await nextProvider.getSigner();
      const network = await nextProvider.getNetwork();

      setAccount(connectedAccount);
      setProvider(nextProvider);
      setSigner(nextSigner);
      setChainId(Number(network.chainId));

      // Attach listeners to the active injected provider for account/chain changes
      if (eth.on) {
        eth.on('accountsChanged', handleAccountsChanged);
        eth.on('chainChanged', handleChainChanged);
        eth.on('disconnect', clearState);
      }
      activeInjectedRef.current = eth;
      console.log('Wallet connected (injected):', connectedAccount);
    },
    [clearState, handleAccountsChanged, handleChainChanged, selectInjectedProvider],
  );

  // 1. Initial check and setting up listeners
  useEffect(() => {
    const eth = getEthereum();
    if (!eth) return;

    eth.on('accountsChanged', handleAccountsChanged);
    eth.on('chainChanged', handleChainChanged);
    eth.on('disconnect', clearState);

    return () => {
      eth.removeListener('accountsChanged', handleAccountsChanged);
      eth.removeListener('chainChanged', handleChainChanged);
      eth.removeListener('disconnect', clearState);
    };
  }, [
    clearState,
    getEthereum,
    handleAccountsChanged,
    handleChainChanged,
  ]);


  // --- Public Functions ---

  const connectWallet = useCallback(
    async (connector: ConnectorType = 'injected') => {
      const eth = getEthereum();

      try {
        setError(null);
        // Drop any previous session so the wallet always shows a picker
        await teardownConnections();
        clearState();
        clearWalletConnectStorage();

        if (connector === 'injected') {
          await connectInjected('injected');
          return;
        }
        if (connector === 'metamask') {
          await connectInjected('metamask');
          return;
        }
        if (connector === 'phantom') {
          await connectInjected('phantom');
          return;
        }
        if (connector === 'trust') {
          await connectInjected('trust');
          return;
        }

        // WalletConnect path (works for mobile wallets and desktop wallets that support WalletConnect)
        if (connector === 'walletconnect' && !WC_PROJECT_ID) {
          setError('WalletConnect is not configured (missing VITE_WC_PROJECT_ID).');
          return;
        }

        const wc = await initWalletConnect();
        if (!wc && eth) {
          // WalletConnect not available, fall back to injected
          await connectInjected('injected');
        }
      } catch (e: any) {
        console.error('Connection error:', e);
        if (e.code === 4001) {
          setError('Connection request rejected by user.');
        } else {
          setError('Failed to connect wallet.');
        }
        clearWalletConnectStorage();
        clearState();
      }
    },
    [
      clearState,
      clearWalletConnectStorage,
      connectInjected,
      getEthereum,
      initWalletConnect,
    ],
  );

  const switchNetwork = useCallback(
    async (chainIdHex: string) => {
      const eth = getEthereum();
      if (!eth || !isConnected) {
        setError('Cannot switch network: Wallet is not connected or provider is missing.');
        return;
      }

      try {
        setError(null);
        await eth.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainIdHex }],
        });
        // chainChanged event listener (handleChainChanged) will automatically reload the app
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          setError('The requested chain is not configured in the wallet. You may need to add it manually.');
        } else {
          setError('Failed to switch network.');
        }
        console.error('Switch network error:', switchError);
      }
    },
    [getEthereum, isConnected],
  );

  const disconnectWallet = useCallback(
    async () => {
      // Attempt to revoke account permissions so the wallet prompts again next time.
      const eth = activeInjectedRef.current || getEthereum();
      if (eth?.request) {
        eth
          .request({ method: 'wallet_revokePermissions', params: [{ eth_accounts: {} }] })
          .catch((err: unknown) => console.warn('Unable to revoke wallet permissions', err));
      }

      await teardownConnections();
      clearState();
      clearWalletConnectStorage();
      console.log('Manually disconnected wallet state from application.');
    },
    [clearState, clearWalletConnectStorage, getEthereum, teardownConnections],
  );

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

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const wallet = useWalletInternal();
  return <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>;
};

export const useWallet = (): WalletHook => {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return ctx;
};