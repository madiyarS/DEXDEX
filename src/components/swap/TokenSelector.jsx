import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Input from '../ui/Input.jsx';
import { POPULAR_TOKENS, getTokenInfo } from '../../utils/tokenList.js';
import { formatTokenAmount, formatPrice } from '../../utils/formatters.js';
import { FALLBACK_TOKEN_IMAGE } from '../../utils/constants.js';

const TokenOption = ({ mint, token, balance, price, onClick, showBalance }) => {
  const usdValue = balance && price ? balance * price : 0;

  return (
    <div
      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
      onClick={() => onClick(mint)}
    >
      <img
        src={token.logoURI}
        alt={token.symbol}
        className="w-10 h-10 rounded-full"
        onError={(e) => {
          e.target.src = FALLBACK_TOKEN_IMAGE;
        }}
      />
      
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900">{token.symbol}</div>
        <div className="text-sm text-gray-600 truncate">{token.name}</div>
        {price && (
          <div className="text-xs text-gray-500">{formatPrice(price)}</div>
        )}
      </div>
      
      {showBalance && balance !== undefined && (
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">
            {formatTokenAmount(balance)}
          </div>
          {usdValue > 0 && (
            <div className="text-xs text-gray-500">
              {formatPrice(usdValue)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TokenSelector = ({
  value,
  onChange,
  label,
  tokenBalances = [],
  prices = {},
  showBalance = false,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedToken = getTokenInfo(value);
  const selectedBalance = tokenBalances.find(token => token.mint === value)?.balance;
  const selectedPrice = prices[value]?.price;

  // Filter tokens based on search query
  const filteredTokens = Object.entries(POPULAR_TOKENS).filter(([mint, token]) => {
    const query = searchQuery.toLowerCase();
    return (
      token.symbol.toLowerCase().includes(query) ||
      token.name.toLowerCase().includes(query) ||
      mint.toLowerCase().includes(query)
    );
  });

  // Sort tokens: tokens with balance first, then by symbol
  const sortedTokens = filteredTokens.sort(([mintA, tokenA], [mintB, tokenB]) => {
    const balanceA = tokenBalances.find(t => t.mint === mintA)?.balance || 0;
    const balanceB = tokenBalances.find(t => t.mint === mintB)?.balance || 0;
    
    if (balanceA > 0 && balanceB === 0) return -1;
    if (balanceA === 0 && balanceB > 0) return 1;
    
    return tokenA.symbol.localeCompare(tokenB.symbol);
  });

  const handleTokenSelect = (mint) => {
    onChange(mint);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={`
          w-full p-3 border border-gray-200 rounded-xl 
          focus:ring-2 focus:ring-purple-500 focus:border-transparent 
          bg-white hover:border-gray-300 transition-colors
          flex items-center gap-3
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <img
          src={selectedToken.logoURI}
          alt={selectedToken.symbol}
          className="w-6 h-6 rounded-full"
          onError={(e) => {
            e.target.src = FALLBACK_TOKEN_IMAGE;
          }}
        />
        
        <div className="flex-1 text-left">
          <div className="font-medium text-gray-900">
            {selectedToken.symbol}
          </div>
          <div className="text-sm text-gray-600 truncate">
            {selectedToken.name}
          </div>
        </div>
        
        {showBalance && selectedBalance !== undefined && (
          <div className="text-right text-sm">
            <div className="text-gray-900">
              {formatTokenAmount(selectedBalance)}
            </div>
            {selectedPrice && selectedBalance > 0 && (
              <div className="text-gray-500">
                {formatPrice(selectedBalance * selectedPrice)}
              </div>
            )}
          </div>
        )}
        
        <ChevronDown size={20} className="text-gray-400" />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Select Token"
        size="md"
      >
        <div className="p-6 space-y-4">
          <Input
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search size={20} className="text-gray-400" />}
          />
          
          <div className="max-h-96 overflow-y-auto space-y-1">
            {sortedTokens.length > 0 ? (
              sortedTokens.map(([mint, token]) => {
                const balance = tokenBalances.find(t => t.mint === mint)?.balance;
                const price = prices[mint]?.price;
                
                return (
                  <TokenOption
                    key={mint}
                    mint={mint}
                    token={token}
                    balance={balance}
                    price={price}
                    onClick={handleTokenSelect}
                    showBalance={showBalance}
                  />
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No tokens found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TokenSelector;