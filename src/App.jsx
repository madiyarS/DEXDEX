import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header.jsx';
import SwapInterface from './components/swap/SwapInterface.jsx';
import WalletBalance from './components/wallet/WalletBalance.jsx';
import WalletConnect from './components/wallet/WalletConnect.jsx';
import { NotificationContainer } from './components/ui/Notification.jsx';

// Custom hooks
import { useWallet } from './hooks/useWallet.js';
import { useTokenPrices } from './hooks/useTokenPrices.js';
import { useNotification } from './hooks/useNotification.js';

// Services
import { getAllTokenBalances } from './services/solanaService.js';

// Utils
import { formatTransactionSignature } from './utils/formatters.js';
import { EXTERNAL_LINKS } from './utils/constants.js';

// Styles
import './styles/globals.css';

function App() {
  // Wallet state
  const {
    isConnected,
    publicKey,
    connecting,
    error: walletError,
    isWalletAvailable,
    connect,
    disconnect,
    getAddress
  } = useWallet();

  // Token balances state
  const [tokenBalances, setTokenBalances] = useState([]);
  const [balancesLoading, setBalancesLoading] = useState(false);

  // Prices and notifications
  const { 
    prices, 
    loading: pricesLoading, 
    refreshPrices, 
    portfolioValue 
  } = useTokenPrices(tokenBalances);

  const {
    notifications,
    removeNotification,
    showSuccess,
    showError,
    showWarning
  } = useNotification();

  // Fetch token balances
  const fetchBalances = async () => {
    if (!publicKey) return;

    setBalancesLoading(true);
    try {
      const balances = await getAllTokenBalances(publicKey);
      setTokenBalances(balances);
    } catch (error) {
      console.error('Error fetching balances:', error);
      showError('Failed to fetch token balances');
    } finally {
      setBalancesLoading(false);
    }
  };

  // Handle wallet connection
  const handleConnect = async () => {
    try {
      const success = await connect();
      if (success) {
        showSuccess('Wallet connected successfully!');
      }
    } catch (error) {
      showError('Failed to connect wallet');
    }
  };

  // Handle wallet disconnection
  const handleDisconnect = async () => {
    try {
      await disconnect();
      setTokenBalances([]);
      showSuccess('Wallet disconnected');
    } catch (error) {
      showError('Failed to disconnect wallet');
    }
  };

  // Handle successful swap
  const handleSwapSuccess = (signature, quote) => {
    const shortSig = formatTransactionSignature(signature);
    showSuccess(
      <>
        Swap successful! 
        <a 
          href={`${EXTERNAL_LINKS.SOLSCAN}/tx/${signature}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline ml-1"
        >
          View transaction {shortSig}
        </a>
      </>, 
      7000
    );
    
    // Refresh balances after successful swap
    setTimeout(() => {
      fetchBalances();
    }, 2000);
  };

  // Handle swap error
  const handleSwapError = (errorMessage) => {
    showError(`Swap failed: ${errorMessage}`);
  };

  // Refresh both balances and prices
  const handleRefreshAll = async () => {
    if (!publicKey) return;
    
    try {
      await Promise.all([
        fetchBalances(),
        refreshPrices()
      ]);
      showSuccess('Data refreshed successfully');
    } catch (error) {
      showError('Failed to refresh data');
    }
  };

  // Effect to fetch balances when wallet connects
  useEffect(() => {
    if (isConnected && publicKey) {
      fetchBalances();
    }
  }, [isConnected, publicKey]);

  // Show wallet error notifications
  useEffect(() => {
    if (walletError) {
      showError(walletError);
    }
  }, [walletError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Notifications */}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
        position="top-right"
      />

      {/* Header */}
      <Header
        isConnected={isConnected}
        walletAddress={getAddress()}
        connecting={connecting}
        walletError={walletError}
        isWalletAvailable={isWalletAvailable}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onRefreshBalances={handleRefreshAll}
        refreshingBalances={balancesLoading}
        pricesLoading={pricesLoading}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {!isConnected ? (
          /* Wallet Connection Screen */
          <div className="max-w-md mx-auto">
            <WalletConnect
              onConnect={handleConnect}
              connecting={connecting}
              error={walletError}
              isWalletAvailable={isWalletAvailable}
            />
          </div>
        ) : (
          /* Main App Interface */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Swap Interface */}
            <div className="lg:col-span-2">
              <SwapInterface
                publicKey={publicKey}
                tokenBalances={tokenBalances}
                prices={prices}
                onSwapSuccess={handleSwapSuccess}
                onSwapError={handleSwapError}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <WalletBalance
                tokenBalances={tokenBalances}
                prices={prices}
                loading={balancesLoading}
                onRefresh={handleRefreshAll}
                portfolioValue={portfolioValue}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">SolanaSwift</h3>
              <p className="text-sm text-gray-600">
                Fast, secure, and user-friendly DEX for swapping tokens on the Solana blockchain.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Resources</h3>
              <div className="space-y-2 text-sm">
                <a href={EXTERNAL_LINKS.RAYDIUM} target="_blank" rel="noopener noreferrer" 
                   className="block text-gray-600 hover:text-purple-600">
                  Raydium
                </a>
                <a href={EXTERNAL_LINKS.JUPITER} target="_blank" rel="noopener noreferrer"
                   className="block text-gray-600 hover:text-purple-600">
                  Jupiter
                </a>
                <a href={EXTERNAL_LINKS.SOLSCAN} target="_blank" rel="noopener noreferrer"
                   className="block text-gray-600 hover:text-purple-600">
                  Solscan
                </a>
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Solana Mainnet</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Jupiter API</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-600">Price Updates</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>© 2024 SolanaSwift. Built with ❤️ for the Solana ecosystem.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;