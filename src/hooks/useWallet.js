import { useState, useEffect, useCallback } from 'react';
import { PublicKey } from '@solana/web3.js';
import { getPhantomProvider } from '../services/solanaService.js';
import { isValidSolanaAddress } from '../services/solanaService.js';

export const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Check if wallet is available
  const isWalletAvailable = useCallback(() => {
    return !!getPhantomProvider();
  }, []);

  // Connect to wallet
  const connect = useCallback(async () => {
    const provider = getPhantomProvider();
    
    if (!provider) {
      setError('Phantom wallet not found. Please install Phantom wallet.');
      return false;
    }

    setConnecting(true);
    setError(null);

    try {
      const response = await provider.connect();
      
      if (response.publicKey) {
        setPublicKey(response.publicKey);
        setIsConnected(true);
        setError(null);
        
        // Store connection state
        localStorage.setItem('wallet_connected', 'true');
        localStorage.setItem('wallet_publickey', response.publicKey.toString());
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      setError(error.message || 'Failed to connect wallet');
      return false;
    } finally {
      setConnecting(false);
    }
  }, []);

  // Disconnect from wallet
  const disconnect = useCallback(async () => {
    const provider = getPhantomProvider();
    
    if (provider) {
      try {
        await provider.disconnect();
      } catch (error) {
        console.error('Error disconnecting from wallet:', error);
      }
    }

    setIsConnected(false);
    setPublicKey(null);
    setError(null);
    
    // Clear stored connection state
    localStorage.removeItem('wallet_connected');
    localStorage.removeItem('wallet_publickey');
  }, []);

  // Get wallet address string
  const getAddress = useCallback(() => {
    return publicKey ? publicKey.toString() : null;
  }, [publicKey]);

  // Sign transaction
  const signTransaction = useCallback(async (transaction) => {
    const provider = getPhantomProvider();
    
    if (!provider || !isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      const signedTransaction = await provider.signTransaction(transaction);
      return signedTransaction;
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw new Error('Failed to sign transaction');
    }
  }, [isConnected]);

  // Sign multiple transactions
  const signAllTransactions = useCallback(async (transactions) => {
    const provider = getPhantomProvider();
    
    if (!provider || !isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      const signedTransactions = await provider.signAllTransactions(transactions);
      return signedTransactions;
    } catch (error) {
      console.error('Error signing transactions:', error);
      throw new Error('Failed to sign transactions');
    }
  }, [isConnected]);

  // Check for existing connection on mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      const provider = getPhantomProvider();
      
      if (!provider) return;

      try {
        // Try to connect silently (only if already authorized)
        const response = await provider.connect({ onlyIfTrusted: true });
        
        if (response.publicKey) {
          setPublicKey(response.publicKey);
          setIsConnected(true);
        }
      } catch (error) {
        // User hasn't authorized the app yet
        console.log('No existing wallet connection found');
      }
    };

    checkExistingConnection();
  }, []);

  // Listen for wallet events
  useEffect(() => {
    const provider = getPhantomProvider();
    
    if (!provider) return;

    const handleConnect = (publicKey) => {
      console.log('Wallet connected:', publicKey.toString());
      setPublicKey(publicKey);
      setIsConnected(true);
      setError(null);
    };

    const handleDisconnect = () => {
      console.log('Wallet disconnected');
      setPublicKey(null);
      setIsConnected(false);
      setError(null);
    };

    const handleAccountChanged = (publicKey) => {
      if (publicKey) {
        console.log('Wallet account changed:', publicKey.toString());
        setPublicKey(publicKey);
      } else {
        handleDisconnect();
      }
    };

    // Add event listeners
    provider.on('connect', handleConnect);
    provider.on('disconnect', handleDisconnect);
    provider.on('accountChanged', handleAccountChanged);

    // Cleanup
    return () => {
      provider.removeListener('connect', handleConnect);
      provider.removeListener('disconnect', handleDisconnect);
      provider.removeListener('accountChanged', handleAccountChanged);
    };
  }, []);

  return {
    isConnected,
    publicKey,
    connecting,
    error,
    isWalletAvailable: isWalletAvailable(),
    connect,
    disconnect,
    getAddress,
    signTransaction,
    signAllTransactions
  };
};