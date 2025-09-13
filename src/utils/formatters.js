// Format price with appropriate decimal places
export const formatPrice = (price) => {
  if (!price || price === 0) return '$0.00';
  if (price < 0.001) return `$${price.toFixed(8)}`;
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  if (price < 100) return `$${price.toFixed(2)}`;
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Format token amount with appropriate decimal places
export const formatTokenAmount = (amount, decimals = 6) => {
  if (!amount || amount === 0) return '0';
  if (amount < 0.0001) return amount.toFixed(8);
  if (amount < 1) return amount.toFixed(6);
  if (amount < 1000) return amount.toFixed(4);
  return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
};

// Format wallet address for display
export const formatWalletAddress = (address, startChars = 4, endChars = 4) => {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

// Format percentage change
export const formatPercentageChange = (change) => {
  if (!change) return '0.00%';
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
};

// Format transaction signature
export const formatTransactionSignature = (signature, chars = 8) => {
  if (!signature) return '';
  return `${signature.slice(0, chars)}...`;
};

// Convert token amount to smallest unit (considering decimals)
export const toSmallestUnit = (amount, decimals) => {
  return Math.floor(parseFloat(amount) * Math.pow(10, decimals));
};

// Convert from smallest unit to readable amount
export const fromSmallestUnit = (amount, decimals) => {
  return parseFloat(amount) / Math.pow(10, decimals);
};

// Format large numbers with K, M, B suffixes
export const formatLargeNumber = (num) => {
  if (!num) return '0';
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toString();
};

// Calculate USD value
export const calculateUSDValue = (balance, price) => {
  if (!balance || !price) return 0;
  return balance * price;
};