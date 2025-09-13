import { PublicKey } from '@solana/web3.js';

// Validate Solana public key
export const isValidPublicKey = (address) => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

// Validate token amount
export const isValidAmount = (amount, maxDecimals = 18) => {
  if (!amount || amount === '') return false;
  
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) return false;
  
  // Check decimal places
  const decimalPart = amount.toString().split('.')[1];
  if (decimalPart && decimalPart.length > maxDecimals) return false;
  
  return true;
};

// Validate slippage value
export const isValidSlippage = (slippage) => {
  const num = parseFloat(slippage);
  return !isNaN(num) && num >= 0 && num <= 50;
};

// Validate token mint address
export const isValidTokenMint = (mint) => {
  return isValidPublicKey(mint);
};

// Validate swap parameters
export const validateSwapParams = (fromToken, toToken, amount) => {
  const errors = [];
  
  if (!isValidTokenMint(fromToken)) {
    errors.push('Invalid from token');
  }
  
  if (!isValidTokenMint(toToken)) {
    errors.push('Invalid to token');
  }
  
  if (fromToken === toToken) {
    errors.push('Cannot swap same token');
  }
  
  if (!isValidAmount(amount)) {
    errors.push('Invalid amount');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Check if amount exceeds balance
export const hasInsufficientBalance = (amount, balance) => {
  if (!amount || !balance) return false;
  return parseFloat(amount) > balance;
};

// Validate wallet connection
export const isWalletConnected = (publicKey) => {
  return publicKey && isValidPublicKey(publicKey.toString());
};