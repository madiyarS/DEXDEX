import React from 'react';
import { ArrowUpDown, RefreshCw, TrendingUp } from 'lucide-react';
import WalletConnect from '../wallet/WalletConnect.jsx';
import WalletInfo from '../wallet/WalletInfo.jsx';
import Button from '../ui/Button.jsx';

const Header = ({
  // Wallet props
  isConnected,
  walletAddress,
  connecting,
  walletError,
  isWalletAvailable,
  onConnect,
  onDisconnect,
  
  // Balance refresh props
  onRefreshBalances,
  refreshingBalances,
  
  // Price loading indicator
  pricesLoading
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <ArrowUpDown className="w-6 h-6 text-white" />
            </div>
            
            <div>
              <h1 className="text-xl font-bold text-gray-900">SolanaSwift</h1>
              <p className="text-xs text-gray-500">Fast & Secure DEX</p>
            </div>
          </div>

          {/* Actions and Wallet */}
          <div className="flex items-center gap-4">
            {/* Loading Indicators */}
            <div className="flex items-center gap-2">
              {isConnected && (
                <Button
                  onClick={onRefreshBalances}
                  variant="ghost"
                  size="sm"
                  disabled={refreshingBalances}
                  icon={<RefreshCw size={16} className={refreshingBalances ? 'animate-spin' : ''} />}
                  title="Refresh balances"
                />
              )}
              
              {pricesLoading && (
                <TrendingUp size={16} className="text-blue-500 animate-pulse" title="Updating prices" />
              )}
            </div>

            {/* Wallet Section */}
            {isConnected ? (
              <WalletInfo
                address={walletAddress}
                onDisconnect={onDisconnect}
                isConnected={isConnected}
              />
            ) : (
              <div className="flex items-center">
                <WalletConnect
                  onConnect={onConnect}
                  connecting={connecting}
                  error={walletError}
                  isWalletAvailable={isWalletAvailable}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;