import { useState, useEffect } from 'react';

class PriceStore {
  constructor() {
    this.state = {
      // Price data
      prices: {},
      pricesLoading: false,
      pricesError: null,
      lastUpdated: null,
      
      // Cache settings
      cacheTimeout: 60000, // 1 minute
      maxCacheSize: 100,
      
      // Update interval
      updateInterval: 30000, // 30 seconds
      autoUpdate: true,
      
      // Subscribed tokens
      subscribedTokens: new Set(),
    };
    
    this.listeners = new Set();
    this.updateTimer = null;
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify listeners
  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Update state
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  // Price management
  setPrices(prices) {
    const now = Date.now();
    
    // Add timestamp to each price
    const pricesWithTimestamp = {};
    Object.entries(prices).forEach(([mint, priceData]) => {
      pricesWithTimestamp[mint] = {
        ...priceData,
        timestamp: now
      };
    });

    this.setState({
      prices: { ...this.state.prices, ...pricesWithTimestamp },
      pricesLoading: false,
      pricesError: null,
      lastUpdated: now
    });

    // Clean old cache entries
    this.cleanCache();
  }

  setPricesLoading(loading) {
    this.setState({ 
      pricesLoading: loading,
      pricesError: loading ? null : this.state.pricesError
    });
  }

  setPricesError(error) {
    this.setState({
      pricesLoading: false,
      pricesError: error
    });
  }

  // Get price for a specific token
  getPrice(mint) {
    const priceData = this.state.prices[mint];
    
    if (!priceData) return null;
    
    // Check if price is stale
    const now = Date.now();
    const isStale = (now - priceData.timestamp) > this.state.cacheTimeout;
    
    if (isStale) {
      // Mark for refresh but return cached value
      this.subscribeToToken(mint);
      return priceData;
    }
    
    return priceData;
  }

  // Get USD value for amount
  getUSDValue(mint, amount) {
    const priceData = this.getPrice(mint);
    if (!priceData || !amount) return 0;
    
    return amount * priceData.price;
  }

  // Subscribe to token price updates
  subscribeToToken(mint) {
    this.state.subscribedTokens.add(mint);
    
    // If auto-update is enabled and we don't have a timer, start one
    if (this.state.autoUpdate && !this.updateTimer) {
      this.startAutoUpdate();
    }
  }

  subscribeToTokens(mints) {
    mints.forEach(mint => this.subscribeToToken(mint));
  }

  unsubscribeFromToken(mint) {
    this.state.subscribedTokens.delete(mint);
  }

  // Auto-update functionality
  startAutoUpdate() {
    if (this.updateTimer) return;
    
    this.updateTimer = setInterval(() => {
      if (this.state.subscribedTokens.size > 0 && this.state.autoUpdate) {
        // This would trigger a price refresh in the component using this store
        this.setState({ lastUpdated: Date.now() });
      }
    }, this.state.updateInterval);
  }

  stopAutoUpdate() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
  }

  setAutoUpdate(autoUpdate) {
    this.setState({ autoUpdate });
    
    if (autoUpdate) {
      this.startAutoUpdate();
    } else {
      this.stopAutoUpdate();
    }
  }

  // Cache management
  cleanCache() {
    const now = Date.now();
    const { prices, cacheTimeout, maxCacheSize } = this.state;
    
    // Remove stale entries
    const freshPrices = {};
    Object.entries(prices).forEach(([mint, priceData]) => {
      if ((now - priceData.timestamp) <= cacheTimeout) {
        freshPrices[mint] = priceData;
      }
    });

    // If still too many entries, keep only the most recent ones
    const entries = Object.entries(freshPrices);
    if (entries.length > maxCacheSize) {
      entries.sort(([,a], [,b]) => b.timestamp - a.timestamp);
      const trimmedPrices = {};
      entries.slice(0, maxCacheSize).forEach(([mint, priceData]) => {
        trimmedPrices[mint] = priceData;
      });
      
      this.setState({ prices: trimmedPrices });
    } else if (Object.keys(freshPrices).length !== Object.keys(prices).length) {
      this.setState({ prices: freshPrices });
    }
  }

  clearCache() {
    this.setState({
      prices: {},
      lastUpdated: null
    });
  }

  // Statistics
  getCacheStats() {
    const now = Date.now();
    const prices = Object.values(this.state.prices);
    
    const totalEntries = prices.length;
    const freshEntries = prices.filter(p => (now - p.timestamp) <= this.state.cacheTimeout).length;
    const staleEntries = totalEntries - freshEntries;
    
    return {
      totalEntries,
      freshEntries,
      staleEntries,
      subscribedTokens: this.state.subscribedTokens.size,
      autoUpdate: this.state.autoUpdate,
      lastUpdated: this.state.lastUpdated
    };
  }

  // Check if prices are stale
  get isPricesStale() {
    if (!this.state.lastUpdated) return true;
    
    const now = Date.now();
    return (now - this.state.lastUpdated) > (this.state.cacheTimeout * 2);
  }

  // Get all subscribed tokens
  getSubscribedTokens() {
    return Array.from(this.state.subscribedTokens);
  }

  // Settings
  setCacheTimeout(timeout) {
    this.setState({ cacheTimeout: timeout });
  }

  setUpdateInterval(interval) {
    this.setState({ updateInterval: interval });
    
    // Restart timer with new interval
    if (this.updateTimer) {
      this.stopAutoUpdate();
      this.startAutoUpdate();
    }
  }

  // Get state
  getState() {
    return this.state;
  }

  get(key) {
    return this.state[key];
  }

  // Cleanup
  destroy() {
    this.stopAutoUpdate();
    this.state.subscribedTokens.clear();
    this.listeners.clear();
  }
}

// Create singleton instance
export const priceStore = new PriceStore();

// React hook
export const usePriceStore = () => {
  const [state, setState] = useState(priceStore.getState());

  useEffect(() => {
    const unsubscribe = priceStore.subscribe(setState);
    return unsubscribe;
  }, []);

  return state;
};

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    priceStore.destroy();
  });
}

export default priceStore;