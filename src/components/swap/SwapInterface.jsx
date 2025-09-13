import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Settings } from 'lucide-react';
import TokenSelector from './TokenSelector.jsx';
import QuoteDisplay from './QuoteDisplay.jsx';
import SwapButton from './SwapButton.jsx';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';
import { useSwap } from '../../hooks/useSwap.js';
import { formatPrice } from '../../utils/formatters.js';
import { getTokenInfo } from '../../utils/tokenList.js';
import { SLIPPAGE_OPTIONS, DEFAULT_SLIPPAGE } from '../../utils/constants.js';

const SwapInterface = ({
  publicKey,
  tokenBalances = [],
  prices = {},
  onSwapSuccess,
  onSwapError
}) => {
  const [fromToken, setFromToken] = useState('So11111111111111111111111111111111111111112');
  const [toToken, setToToken] = useState('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
  const [fromAmount, setFromAmount] = useState('');
  const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE);
  const [showSettings, setShowSettings] = useState(false);

  const {
    quote,
    loading: quoteLoading,
    swapping,
    error,
    debouncedGetQuote,
    executeSwap,
    getOutputAmount,
    isSwapReady,
    clearQuote
  } = useSwap(publicKey, onSwapSuccess, onSwapError);

  // Get token information
  const fromTokenInfo = getTokenInfo(fromToken);
  const toTokenInfo = getTokenInfo(toToken);

  // Get token balances
  const fromTokenBalance = tokenBalances.find(token => token.mint === fromToken)?.balance || 0;
  const toTokenBalance = tokenBalances.find(token => token.mint === toToken)?.balance || 0;

  // Get token prices
  const fromTokenPrice = prices[fromToken]?.price || 0;
  const toTokenPrice = prices[toToken]?.price || 0;

  // Calculate USD values
  const fromUSDValue = fromAmount && fromTokenPrice ? parseFloat(fromAmount) * fromTokenPrice : 0;
  const toUSDValue = quote && toTokenPrice ? parseFloat(getOutputAmount(toToken)) * toTokenPrice : 0;

  // Handle amount change
  const handleAmountChange = (value) => {
    setFromAmount(value);
    
    if (value && parseFloat(value) > 0 && fromToken !== toToken) {
      debouncedGetQuote(fromToken, toToken, value, slippage);
    } else {
      clearQuote();
    }
  };

  // Switch tokens
  const handleSwitch = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount('');
    clearQuote();
    
    // If we had an amount, get new quote
    if (tempAmount && parseFloat(tempAmount) > 0) {
      setTimeout(() => {
        setFromAmount(getOutputAmount(tempToken));
        debouncedGetQuote(toToken, tempToken, getOutputAmount(tempToken), slippage);
      }, 100);
    }
  };

  // Handle slippage change
  const handleSlippageChange = (newSlippage) => {
    setSlippage(newSlippage);
    
    // Re-fetch quote with new slippage if we have an amount
    if (fromAmount && parseFloat(fromAmount) > 0) {
      debouncedGetQuote(fromToken, toToken, fromAmount, newSlippage);
    }
  };

  // Check for insufficient balance
  const hasInsufficientBalance = fromAmount && fromTokenBalance && parseFloat(fromAmount) > fromTokenBalance;

  // Update quote when tokens change
  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0 && fromToken !== toToken) {
      debouncedGetQuote(fromToken, toToken, fromAmount, slippage);
    }
  }, [fromToken, toToken]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Swap Tokens</h2>
        <Button
          onClick={() => setShowSettings(!showSettings)}
          variant="ghost"
          size="sm"
          icon={<Settings size={20} />}
        />
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slippage Tolerance
            </label>
            <div className="flex gap-2">
              {SLIPPAGE_OPTIONS.map((value) => (
                <Button
                  key={value}
                  onClick={() => handleSlippageChange(value)}
                  variant={slippage === value ? 'primary' : 'outline'}
                  size="sm"
                >
                  {value}%
                </Button>
              ))}
              <Input
                type="number"
                value={slippage}
                onChange={(e) => handleSlippageChange(parseFloat(e.target.value) || 0)}
                className="w-20"
                placeholder="Custom"
                step="0.1"
                min="0"
                max="50"
              />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* From Token */}
        <div className="space-y-3">
          <TokenSelector
            value={fromToken}
            onChange={setFromToken}
            label="From"
            tokenBalances={tokenBalances}
            prices={prices}
            showBalance={true}
          />
          
          <div className="relative">
            <Input
              type="number"
              value={fromAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.0"
              className="text-right text-lg pr-4"
              error={hasInsufficientBalance ? 'Insufficient balance' : ''}
            />
            
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <img
                src={fromTokenInfo.logoURI}
                alt={fromTokenInfo.symbol}
                className="w-6 h-6 rounded-full"
              />
              <span className="font-medium">{fromTokenInfo.symbol}</span>
            </div>
            
            {fromUSDValue > 0 && (
              <div className="absolute right-3 bottom-1 text-xs text-gray-500">
                ≈ {formatPrice(fromUSDValue)}
              </div>
            )}
            
            {fromTokenBalance > 0 && (
              <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                <span>Balance: {fromTokenBalance.toFixed(6)}</span>
                <Button
                  onClick={() => handleAmountChange(fromTokenBalance.toString())}
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                >
                  MAX
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Switch Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSwitch}
            variant="outline"
            size="sm"
            icon={<ArrowUpDown size={20} />}
            className="rounded-full p-2"
          />
        </div>

        {/* To Token */}
        <div className="space-y-3">
          <TokenSelector
            value={toToken}
            onChange={setToToken}
            label="To"
            tokenBalances={tokenBalances}
            prices={prices}
          />
          
          <div className="relative">
            <Input
              type="number"
              value={getOutputAmount(toToken)}
              placeholder="0.0"
              className="text-right text-lg bg-gray-50"
              readOnly
            />
            
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <img
                src={toTokenInfo.logoURI}
                alt={toTokenInfo.symbol}
                className="w-6 h-6 rounded-full"
              />
              <span className="font-medium">{toTokenInfo.symbol}</span>
            </div>
            
            {toUSDValue > 0 && (
              <div className="absolute right-3 bottom-1 text-xs text-gray-500">
                ≈ {formatPrice(toUSDValue)}
              </div>
            )}
          </div>
        </div>

        {/* Quote Display */}
        <QuoteDisplay
          quote={quote}
          loading={quoteLoading}
          error={error}
          fromToken={fromToken}
          toToken={toToken}
          slippage={slippage}
        />

        {/* Swap Button */}
        <SwapButton
          onSwap={executeSwap}
          isReady={isSwapReady}
          loading={swapping}
          hasBalance={fromTokenBalance > 0}
          hasAmount={!!fromAmount}
          hasQuote={!!quote}
          isConnected={!!publicKey}
          hasInsufficientBalance={hasInsufficientBalance}
        />
      </div>
    </div>
  );
};

export default SwapInterface;