import { useState, useEffect, useCallback, useRef } from 'react';
import { getCachedTokenPrices, calculatePortfolioValue } from '../services/priceService.js';
import { getAllTokenMints } from '../utils/tokenList.js';

export const useTokenPrices = (tokenBalances = []) => {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const fetchIntervalRef = useRef();
  const mountedRef = useRef(true);

  // Get unique token mints from balances
  const getTokenMints = useCallback(() => {
    const balanceMints = tokenBalances.map(token => token.mint);
    const popularMints = getAllTokenMints();
    
    // Combine and deduplicate
    return [...new Set([...balanceMints, ...popularMints])];
  }, [tokenBalances]);

  // Fetch prices for tokens
  const fetchPrices = useCallback(async (tokenMints) => {
    if (!tokenMints || tokenMints.length === 0) {
      return {};
    }

    setLoading(true);
    setError(null);

    try {
      const pricesData = await getCachedTokenPrices(tokenMints);
      
      if (mountedRef.current) {
        setPrices(prevPrices => ({
          ...prevPrices,
          ...pricesData
        }));
        setLastUpdated(Date.now());
      }
      
      return pricesData;
    } catch (error) {
      console.error('Error fetching token prices:', error);
      
      if (mountedRef.current) {
        setError(error.message);
      }
      
      return {};
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Refresh prices manually
  const refreshPrices = useCallback(async () => {
    const tokenMints = getTokenMints();
    return fetchPrices(tokenMints);
  }, [getTokenMints, fetchPrices]);

  // Get price for specific token
  const getTokenPrice = useCallback((mint) => {
    return prices[mint]?.price || 0;
  }, [prices]);

  // Get price change for specific token
  const getPriceChange = useCallback((mint) => {
    return prices[mint]?.priceChange24h || 0;
  }, [prices]);

  // Calculate USD value for token
  const calculateUSDValue = useCallback((balance, mint) => {
    const price = getTokenPrice(mint);
    return balance * price;
  }, [getTokenPrice]);

  // Calculate total portfolio value
  const portfolioValue = useCallback(() => {
    return calculatePortfolioValue(tokenBalances, prices);
  }, [tokenBalances, prices]);

  // Check if prices are stale (older than 2 minutes)
  const isPricesStale = useCallback(() => {
    if (!lastUpdated) return true;
    
    const now = Date.now();
    const twoMinutes = 2 * 60 * 1000;
    
    return (now - lastUpdated) > twoMinutes;
  }, [lastUpdated]);

  // Auto-refresh prices every 30 seconds
  useEffect(() => {
    const tokenMints = getTokenMints();
    
    if (tokenMints.length === 0) {
      return;
    }

    // Initial fetch
    fetchPrices(tokenMints);

    // Set up auto-refresh
    fetchIntervalRef.current = setInterval(() => {
      if (mountedRef.current) {
        fetchPrices(tokenMints);
      }
    }, 30000); // 30 seconds

    return () => {
      if (fetchIntervalRef.current) {
        clearInterval(fetchIntervalRef.current);
      }
    };
  }, [tokenBalances, fetchPrices, getTokenMints]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (fetchIntervalRef.current) {
        clearInterval(fetchIntervalRef.current);
      }
    };
  }, []);

  return {
    prices,
    loading,
    error,
    lastUpdated,
    refreshPrices,
    getTokenPrice,
    getPriceChange,
    calculateUSDValue,
    portfolioValue: portfolioValue(),
    isPricesStale: isPricesStale()
  };
};