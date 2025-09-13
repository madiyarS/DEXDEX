import { useState, useEffect } from 'react';

class SwapStore {
  constructor() {
    this.state = {
      // Token selection
      fromToken: 'So11111111111111111111111111111111111111112', // SOL
      toToken: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
      
      // Amounts
      fromAmount: '',
      toAmount: '',
      
      // Quote data
      quote: null,
      quoteLoading: false,
      quoteError: null,
      
      // Swap state
      swapping: false,
      swapError: null,
      lastSwapSignature: null,
      
      // Settings
      slippage: 0.5,
      deadline: 20, // minutes
      
      // UI state
      showSettings: false,
      
      // Transaction history
      recentSwaps: this.loadRecentSwaps()
    };
    
    this.listeners = new Set();
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
    
    // Save certain state to localStorage
    this.saveToLocalStorage();
  }

  // Token selection actions
  setFromToken(token) {
    this.setState({ 
      fromToken: token,
      quote: null,
      toAmount: ''
    });
  }

  setToToken(token) {
    this.setState({ 
      toToken: token,
      quote: null,
      toAmount: ''
    });
  }

  switchTokens() {
    const { fromToken, toToken, fromAmount, toAmount } = this.state;
    
    this.setState({
      fromToken: toToken,
      toToken: fromToken,
      fromAmount: toAmount,
      toAmount: fromAmount,
      quote: null
    });
  }

  // Amount actions
  setFromAmount(amount) {
    this.setState({ 
      fromAmount: amount,
      quote: null,
      toAmount: ''
    });
  }

  setToAmount(amount) {
    this.setState({ toAmount: amount });
  }

  // Quote actions
  setQuoteLoading(loading) {
    this.setState({ 
      quoteLoading: loading,
      quoteError: loading ? null : this.state.quoteError
    });
  }

  setQuote(quote) {
    this.setState({
      quote,
      quoteLoading: false,
      quoteError: null
    });
  }

  setQuoteError(error) {
    this.setState({
      quote: null,
      quoteLoading: false,
      quoteError: error
    });
  }

  clearQuote() {
    this.setState({
      quote: null,
      quoteLoading: false,
      quoteError: null,
      toAmount: ''
    });
  }

  // Swap actions
  setSwapping(swapping) {
    this.setState({ 
      swapping,
      swapError: swapping ? null : this.state.swapError
    });
  }

  setSwapSuccess(signature) {
    const swap = {
      id: Date.now(),
      signature,
      fromToken: this.state.fromToken,
      toToken: this.state.toToken,
      fromAmount: this.state.fromAmount,
      toAmount: this.state.toAmount,
      timestamp: new Date().toISOString(),
      status: 'success'
    };

    this.setState({
      swapping: false,
      swapError: null,
      lastSwapSignature: signature,
      fromAmount: '',
      toAmount: '',
      quote: null,
      recentSwaps: [swap, ...this.state.recentSwaps.slice(0, 9)] // Keep last 10
    });
  }

  setSwapError(error) {
    this.setState({
      swapping: false,
      swapError: error
    });
  }

  // Settings actions
  setSlippage(slippage) {
    this.setState({ slippage });
  }

  setDeadline(deadline) {
    this.setState({ deadline });
  }

  toggleSettings() {
    this.setState({ showSettings: !this.state.showSettings });
  }

  // Reset form
  resetForm() {
    this.setState({
      fromAmount: '',
      toAmount: '',
      quote: null,
      quoteLoading: false,
      quoteError: null,
      swapError: null
    });
  }

  // Get computed values
  get isFormValid() {
    const { fromToken, toToken, fromAmount } = this.state;
    return fromToken && toToken && fromAmount && parseFloat(fromAmount) > 0;
  }

  get isSwapReady() {
    return this.isFormValid && this.state.quote && !this.state.quoteLoading && !this.state.swapping;
  }

  // Local storage management
  saveToLocalStorage() {
    const toSave = {
      slippage: this.state.slippage,
      deadline: this.state.deadline,
      recentSwaps: this.state.recentSwaps,
      fromToken: this.state.fromToken,
      toToken: this.state.toToken
    };
    
    localStorage.setItem('swap_settings', JSON.stringify(toSave));
  }

  loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('swap_settings');
      if (saved) {
        const data = JSON.parse(saved);
        this.setState({
          slippage: data.slippage || 0.5,
          deadline: data.deadline || 20,
          recentSwaps: data.recentSwaps || [],
          fromToken: data.fromToken || this.state.fromToken,
          toToken: data.toToken || this.state.toToken
        });
      }
    } catch (error) {
      console.error('Error loading swap settings:', error);
    }
  }

  loadRecentSwaps() {
    try {
      const saved = localStorage.getItem('swap_settings');
      if (saved) {
        const data = JSON.parse(saved);
        return data.recentSwaps || [];
      }
    } catch (error) {
      console.error('Error loading recent swaps:', error);
    }
    return [];
  }

  // Get state
  getState() {
    return this.state;
  }

  get(key) {
    return this.state[key];
  }
}

// Create singleton instance
export const swapStore = new SwapStore();

// Initialize from localStorage
swapStore.loadFromLocalStorage();

// React hook
export const useSwapStore = () => {
  const [state, setState] = useState(swapStore.getState());

  useEffect(() => {
    const unsubscribe = swapStore.subscribe(setState);
    return unsubscribe;
  }, []);

  return state;
};

export default swapStore;