import { JUPITER_QUOTE_API } from '../utils/constants.js';
import { priceRateLimiter } from './rateLimiter.js';

// Get token prices from Jupiter API
export const getTokenPrices = async (tokenMints) => {
  if (!tokenMints || tokenMints.length === 0) {
    return {};
  }

  try {
    const response = await priceRateLimiter.execute(async () => {
      const url = `${JUPITER_QUOTE_API}/price?ids=${tokenMints.join(',')}`;
      
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      return res.json();
    });

    return response.data || {};
  } catch (error) {
    console.error('Error fetching token prices:', error);
    throw new Error(`Failed to fetch token prices: ${error.message}`);
  }
};

// Get single token price
export const getTokenPrice = async (tokenMint) => {
  try {
    const prices = await getTokenPrices([tokenMint]);
    return prices[tokenMint] || null;
  } catch (error) {
    console.error(`Error fetching price for token ${tokenMint}:`, error);
    return null;
  }
};

// Calculate USD value for token balance
export const calculateTokenUSDValue = (balance, tokenMint, prices) => {
  if (!balance || !prices || !prices[tokenMint]) {
    return 0;
  }
  
  const price = prices[tokenMint].price;
  return balance * price;
};

// Calculate portfolio total USD value
export const calculatePortfolioValue = (tokenBalances, prices) => {
  if (!tokenBalances || !prices) {
    return 0;
  }

  return tokenBalances.reduce((total, token) => {
    const usdValue = calculateTokenUSDValue(token.balance, token.mint, prices);
    return total + usdValue;
  }, 0);
};

// Get price change percentage
export const getPriceChange = (tokenMint, prices) => {
  if (!prices || !prices[tokenMint]) {
    return 0;
  }
  
  return prices[tokenMint].priceChange24h || 0;
};

// Check if price data is stale (older than 5 minutes)
export const isPriceDataStale = (timestamp) => {
  if (!timestamp) return true;
  
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  
  return (now - timestamp) > fiveMinutes;
};

// Price cache for reducing API calls
class PriceCache {
  constructor(ttl = 60000) { // 1 minute TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    const now = Date.now();
    if (now - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  clear() {
    this.cache.clear();
  }

  has(key) {
    const item = this.cache.get(key);
    if (!item) return false;
    
    const now = Date.now();
    if (now - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }
}

// Create price cache instance
export const priceCache = new PriceCache();

// Get cached prices or fetch new ones
export const getCachedTokenPrices = async (tokenMints) => {
  const cacheKey = tokenMints.sort().join(',');
  
  // Check cache first
  const cachedPrices = priceCache.get(cacheKey);
  if (cachedPrices) {
    return cachedPrices;
  }
  
  // Fetch new prices
  try {
    const prices = await getTokenPrices(tokenMints);
    priceCache.set(cacheKey, prices);
    return prices;
  } catch (error) {
    // Return empty object on error
    console.error('Failed to fetch cached prices:', error);
    return {};
  }
};