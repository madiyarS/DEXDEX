import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ExternalLink, 
  RefreshCw, 
  Clock, 
  BarChart3, 
  Zap,
  Shield
} from 'lucide-react';
import WalletBalance from '../wallet/WalletBalance.jsx';
import Button from '../ui/Button.jsx';
import { formatPrice, formatPercentageChange } from '../../utils/formatters.js';
import { POPULAR_TOKENS } from '../../utils/tokenList.js';
import { EXTERNAL_LINKS } from '../../utils/constants.js';

const MarketOverview = ({ prices, loading }) => {
  const marketTokens = [
    'So11111111111111111111111111111111111111112', // SOL
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
    'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
    'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', // JUP
    'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' // BONK
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp size={20} className="text-green-500" />
          Market Prices
        </h3>
        {loading && (
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        )}
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {marketTokens.map((mint) => {
          const token = POPULAR_TOKENS[mint];
          const priceData = prices[mint];
          const price = priceData?.price || 0;
          const priceChange = priceData?.priceChange24h || 0;
          
          return (
            <div key={mint} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <img 
                src={token.logoURI} 
                alt={token.symbol}
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNEREREREQiLz4KPHA+dGggZD0iTTIwIDEwVjMwTTEwIDIwSDMwIiBzdHJva2U9IiM5OTk5OTkiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4=';
                }}
              />
              
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-gray-900">
                  {token.symbol}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {token.name}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {price > 0 ? formatPrice(price) : '-'}
                </div>
                {priceChange !== 0 && (
                  <div className={`text-xs font-medium ${
                    priceChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentageChange(priceChange)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const QuickActions = ({ onRefresh, refreshing, walletAddress }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
      <Zap size={20} className="text-purple-500" />
      Quick Actions
    </h3>
    
    <div className="space-y-3">
      <Button
        onClick={onRefresh}
        variant="outline"
        size="sm"
        className="w-full justify-start"
        disabled={refreshing}
        icon={<RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />}
      >
        Refresh Data
      </Button>
      
      <a
        href={EXTERNAL_LINKS.RAYDIUM}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 p-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors w-full"
      >
        <ExternalLink size={16} />
        <span className="text-sm">Visit Raydium</span>
      </a>
      
      <a
        href={EXTERNAL_LINKS.JUPITER}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 p-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors w-full"
      >
        <ExternalLink size={16} />
        <span className="text-sm">Visit Jupiter</span>
      </a>
      
      {walletAddress && (
        <a
          href={`${EXTERNAL_LINKS.SOLSCAN}/account/${walletAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors w-full"
        >
          <ExternalLink size={16} />
          <span className="text-sm">View on Solscan</span>
        </a>
      )}
    </div>
  </div>
);

const NetworkStatus = ({ 
  solanaConnected = true, 
  jupiterConnected = true, 
  pricesUpdating = false 
}) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
      <Shield size={20} className="text-green-500" />
      Network Status
    </h3>
    
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            solanaConnected ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm text-gray-600">Solana Network</span>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded ${
          solanaConnected 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {solanaConnected ? 'Online' : 'Offline'}
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            jupiterConnected ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm text-gray-600">Jupiter API</span>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded ${
          jupiterConnected 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {jupiterConnected ? 'Active' : 'Down'}
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            pricesUpdating 
              ? 'bg-blue-500 animate-pulse' 
              : 'bg-green-500'
          }`}></div>
          <span className="text-sm text-gray-600">Price Feed</span>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded ${
          pricesUpdating 
            ? 'bg-blue-100 text-blue-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {pricesUpdating ? 'Updating...' : 'Live'}
        </span>
      </div>
    </div>
  </div>
);

const RecentActivity = ({ recentSwaps = [] }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
      <Clock size={20} className="text-blue-500" />
      Recent Activity
    </h3>
    
    {recentSwaps.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
        <p className="text-sm">No recent swaps</p>
      </div>
    ) : (
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {recentSwaps.map((swap) => {
          const fromToken = POPULAR_TOKENS[swap.fromToken];
          const toToken = POPULAR_TOKENS[swap.toToken];
          
          return (
            <div key={swap.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-1">
                <img 
                  src={fromToken?.logoURI} 
                  alt={fromToken?.symbol}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-xs">→</span>
                <img 
                  src={toToken?.logoURI} 
                  alt={toToken?.symbol}
                  className="w-6 h-6 rounded-full"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">
                  {fromToken?.symbol} → {toToken?.symbol}
                </div>
                <div className="text-xs text-gray-500">
                  {parseFloat(swap.fromAmount).toFixed(4)} → {parseFloat(swap.toAmount).toFixed(4)}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(swap.timestamp).toLocaleDateString()}
                </div>
              </div>
              
              <a
                href={`${EXTERNAL_LINKS.SOLSCAN}/tx/${swap.signature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="View transaction"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

const Sidebar = ({
  // Wallet data
  tokenBalances = [],
  portfolioValue = 0,
  
  // Price data
  prices = {},
  pricesLoading = false,
  
  // Actions
  onRefresh,
  refreshing = false,
  
  // Wallet info
  walletAddress,
  
  // Network status
  networkStatus = {},
  
  // Recent activity
  recentSwaps = []
}) => {
  return (
    <div className="space-y-6">
      {/* Portfolio Value & Token Balances */}
      <WalletBalance
        tokenBalances={tokenBalances}
        prices={prices}
        loading={refreshing}
        onRefresh={onRefresh}
        portfolioValue={portfolioValue}
      />

      {/* Market Overview */}
      <MarketOverview
        prices={prices}
        loading={pricesLoading}
      />

      {/* Quick Actions */}
      <QuickActions
        onRefresh={onRefresh}
        refreshing={refreshing}
        walletAddress={walletAddress}
      />

      {/* Recent Activity */}
      {recentSwaps.length > 0 && (
        <RecentActivity recentSwaps={recentSwaps} />
      )}

      {/* Network Status */}
      <NetworkStatus
        solanaConnected={networkStatus.solana}
        jupiterConnected={networkStatus.jupiter}
        pricesUpdating={pricesLoading}
      />
    </div>
  );
};

export default Sidebar;