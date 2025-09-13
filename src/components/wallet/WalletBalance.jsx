import React from 'react';
import { Wallet, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import Button from '../ui/Button.jsx';
import { formatPrice, formatTokenAmount, calculateUSDValue } from '../../utils/formatters.js';
import { FALLBACK_TOKEN_IMAGE } from '../../utils/constants.js';

const TokenItem = ({ token, prices }) => {
  const price = prices[token.mint]?.price || 0;
  const priceChange = prices[token.mint]?.priceChange24h || 0;
  const usdValue = calculateUSDValue(token.balance, price);

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <img
        src={token.logoURI}
        alt={token.symbol}
        className="w-10 h-10 rounded-full"
        onError={(e) => {
          e.target.src = FALLBACK_TOKEN_IMAGE;
        }}
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{token.symbol}</span>
          {priceChange !== 0 && (
            <span className={`text-xs flex items-center gap-1 ${
              priceChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {priceChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(priceChange).toFixed(2)}%
            </span>
          )}
        </div>
        
        <div className="text-sm text-gray-600 truncate">
          {token.name}
        </div>
        
        {price > 0 && (
          <div className="text-xs text-gray-500">
            {formatPrice(price)}
          </div>
        )}
      </div>
      
      <div className="text-right">
        <div className="font-semibold text-gray-900">
          {formatTokenAmount(token.balance)}
        </div>
        
        {usdValue > 0 && (
          <div className="text-sm text-gray-600">
            {formatPrice(usdValue)}
          </div>
        )}
      </div>
    </div>
  );
};

const WalletBalance = ({ 
  tokenBalances = [], 
  prices = {},
  loading = false, 
  onRefresh,
  portfolioValue = 0
}) => {
  if (tokenBalances.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center py-8 text-gray-500">
          <Wallet size={48} className="mx-auto mb-4 opacity-50" />
          <p>No tokens found in your wallet</p>
        </div>
      </div>
    );
  }

  // Sort tokens by USD value (highest first)
  const sortedTokens = [...tokenBalances].sort((a, b) => {
    const aValue = calculateUSDValue(a.balance, prices[a.mint]?.price || 0);
    const bValue = calculateUSDValue(b.balance, prices[b.mint]?.price || 0);
    return bValue - aValue;
  });

  return (
    <div className="space-y-6">
      {/* Portfolio Value */}
      {portfolioValue > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Portfolio Value</h3>
            <Button
              onClick={onRefresh}
              variant="ghost"
              size="sm"
              disabled={loading}
              icon={<RefreshCw size={16} className={loading ? 'animate-spin' : ''} />}
            />
          </div>
          
          <div className="text-3xl font-bold text-green-600 mb-2">
            {formatPrice(portfolioValue)}
          </div>
          
          <p className="text-sm text-gray-600">Total USD Value</p>
        </div>
      )}

      {/* Token List */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Your Tokens</h3>
          
          <Button
            onClick={onRefresh}
            variant="ghost"
            size="sm"
            disabled={loading}
            icon={<RefreshCw size={16} className={loading ? 'animate-spin' : ''} />}
            title="Refresh balances"
          />
        </div>
        
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-3 p-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-16 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sortedTokens.map((token) => (
              <TokenItem
                key={token.mint}
                token={token}
                prices={prices}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletBalance;