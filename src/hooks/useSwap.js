import { useState, useEffect, useCallback, useRef } from 'react';
import { VersionedTransaction } from '@solana/web3.js';
import { getJupiterQuote, getJupiterSwapTransaction, validateQuote, calculateMinimumOutput } from '../services/jupiterApi.js';
import { signAndSendTransaction, connection } from '../services/solanaService.js';
import { validateSwapParams } from '../utils/validators.js';
import { fromSmallestUnit } from '../utils/formatters.js';
import { getTokenInfo } from '../utils/tokenList.js';
import { DEBOUNCE_DELAY } from '../utils/constants.js';

export const useSwap = (publicKey, onSwapSuccess, onSwapError) => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [error, setError] = useState(null);
  
  const quoteTimeoutRef = useRef();
  const mountedRef = useRef(true);

  // Get quote with debouncing
  const getQuote = useCallback(async (fromToken, toToken, amount, slippage = 0.5) => {
    // Validate inputs
    const validation = validateSwapParams(fromToken, toToken, amount);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      setQuote(null);
      return null;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setQuote(null);
      setError(null);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const slippageBps = Math.floor(slippage * 100); // Convert to basis points
      const quoteResponse = await getJupiterQuote(fromToken, toToken, amount, slippageBps);
      
      // Validate quote
      const quoteValidation = validateQuote(quoteResponse);
      if (!quoteValidation.isValid) {
        throw new Error(quoteValidation.error);
      }

      if (mountedRef.current) {
        setQuote(quoteResponse);
        
        if (quoteValidation.warning) {
          setError(quoteValidation.warning);
        }
      }

      return quoteResponse;
    } catch (error) {
      console.error('Error getting quote:', error);
      
      if (mountedRef.current) {
        setError(error.message);
        setQuote(null);
      }
      
      return null;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Debounced quote fetching
  const debouncedGetQuote = useCallback((fromToken, toToken, amount, slippage) => {
    clearTimeout(quoteTimeoutRef.current);
    
    quoteTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        getQuote(fromToken, toToken, amount, slippage);
      }
    }, DEBOUNCE_DELAY);
  }, [getQuote]);

  // Execute swap
  const executeSwap = useCallback(async () => {
    if (!publicKey || !quote) {
      throw new Error('Missing required parameters for swap');
    }

    setSwapping(true);
    setError(null);

    try {
      // Get swap transaction from Jupiter
      const swapResponse = await getJupiterSwapTransaction(quote, publicKey);
      
      if (!swapResponse.swapTransaction) {
        throw new Error('Failed to get swap transaction');
      }

      // Execute the transaction
      const result = await signAndSendTransaction(swapResponse.swapTransaction, publicKey);
      
      if (result.signature) {
        // Clear quote after successful swap
        setQuote(null);
        
        // Call success callback
        if (onSwapSuccess) {
          onSwapSuccess(result.signature, quote);
        }
        
        return result;
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Swap execution error:', error);
      
      const errorMessage = error.message || 'Swap failed';
      setError(errorMessage);
      
      // Call error callback
      if (onSwapError) {
        onSwapError(errorMessage);
      }
      
      throw error;
    } finally {
      setSwapping(false);
    }
  }, [publicKey, quote, onSwapSuccess, onSwapError]);

  // Get output amount from quote
  const getOutputAmount = useCallback((outputMint) => {
    if (!quote || !quote.outAmount) {
      return '0';
    }

    const outputToken = getTokenInfo(outputMint);
    const amount = fromSmallestUnit(quote.outAmount, outputToken.decimals);
    
    return amount.toFixed(6);
  }, [quote]);

  // Get minimum output amount
  const getMinimumOutput = useCallback((outputMint, slippage) => {
    if (!quote) return '0';
    
    const slippageBps = Math.floor(slippage * 100);
    const minOutput = calculateMinimumOutput(quote, outputMint, slippageBps);
    
    return minOutput.toFixed(6);
  }, [quote]);

  // Get price impact
  const getPriceImpact = useCallback(() => {
    return quote?.priceImpactPct || 0;
  }, [quote]);

  // Get route information
  const getRouteInfo = useCallback(() => {
    if (!quote || !quote.routePlan) {
      return {
        steps: 0,
        exchanges: []
      };
    }

    return {
      steps: quote.routePlan.length,
      exchanges: quote.routePlan.map(step => step.swapInfo?.label || 'Unknown')
    };
  }, [quote]);

  // Check if swap is ready
  const isSwapReady = useCallback(() => {
    return !!(quote && publicKey && !loading && !swapping);
  }, [quote, publicKey, loading, swapping]);

  // Clear quote
  const clearQuote = useCallback(() => {
    setQuote(null);
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      clearTimeout(quoteTimeoutRef.current);
    };
  }, []);

  return {
    quote,
    loading,
    swapping,
    error,
    getQuote,
    debouncedGetQuote,
    executeSwap,
    getOutputAmount,
    getMinimumOutput,
    getPriceImpact,
    getRouteInfo,
    isSwapReady: isSwapReady(),
    clearQuote
  };
};