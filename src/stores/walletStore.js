// Simple state management for wallet (using vanilla JS)
// You can replace this with Zustand or Redux if needed

class WalletStore {
  constructor() {
    this.state = {
      isConnected: false,
      publicKey: null,
      address: '',
      connecting: false,
      error: null,
      balances: [],
      balancesLoading: false
    };
    
    this.listeners = new Set();
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Notify all listeners of state changes
  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Update state and notify listeners
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  // Wallet connection actions
  setConnecting(connecting) {
    this.setState({ connecting, error: null });
  }

  setConnected(publicKey, address) {
    this.setState({
      isConnected: true,
      publicKey,
      address,
      connecting: false,
      error: null
    });
    
    // Persist to localStorage
    localStorage.setItem('wallet_connected', 'true');
    localStorage.setItem('wallet_address', address);
  }

  setDisconnected() {
    this.setState({
      isConnected: false,
      publicKey: null,
      address: '',
      connecting: false,
      error: null,
      balances: []
    });
    
    // Clear localStorage
    localStorage.removeItem('wallet_connected');
    localStorage.removeItem('wallet_address');
  }

  setError(error) {
    this.setState({
      error,
      connecting: false
    });
  }

  // Balance management
  setBalances(balances) {
    this.setState({ balances, balancesLoading: false });
  }

  setBalancesLoading(loading) {
    this.setState({ balancesLoading: loading });
  }

  // Get current state
  getState() {
    return this.state;
  }

  // Get specific state value
  get(key) {
    return this.state[key];
  }

  // Check if wallet was previously connected
  checkPreviousConnection() {
    const wasConnected = localStorage.getItem('wallet_connected') === 'true';
    const previousAddress = localStorage.getItem('wallet_address');
    
    return {
      wasConnected,
      previousAddress
    };
  }

  // Reset store
  reset() {
    this.state = {
      isConnected: false,
      publicKey: null,
      address: '',
      connecting: false,
      error: null,
      balances: [],
      balancesLoading: false
    };
    this.notify();
  }
}

// Create singleton instance
export const walletStore = new WalletStore();

// React hook to use the wallet store
export const useWalletStore = () => {
  const [state, setState] = useState(walletStore.getState());

  useEffect(() => {
    const unsubscribe = walletStore.subscribe(setState);
    return unsubscribe;
  }, []);

  return state;
};

export default walletStore;