import { JUPITER_QUOTE_API, JUPITER_SWAP_API } from '../utils/constants.js';
import { jupiterRateLimiter } from './rateLimiter.js';
import { getTokenInfo } from '../utils/tokenList.js';
import { toSmallestUnit } from '../utils/formatters.js';

// Get quote from Jupiter API
export const getJupiterQuote = async (inputMint, outputMint, amount, slippageBps = 50) => {
  try {
    const inputToken = getTokenInfo(inputMint);
    const amountInSmallestUnit = toSmallestUnit(amount, inputToken.decimals);
    
    const response = await jupiterRateLimiter.execute(async () => {
      const url = `${JUPITER_QUOTE_API}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amountInSmallestUnit}&slippageBps=${slippageBps}`;
      
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

    return response;
  } catch (error) {
    console.error('Error getting Jupiter quote:', error);
    throw new Error(`Failed to get quote: ${error.message}`);
  }
};

// Get swap transaction from Jupiter API
export const getJupiterSwapTransaction = async (quoteResponse, userPublicKey) => {
  try {
    const response = await jupiterRateLimiter.execute(async () => {
      const res = await fetch(`${JUPITER_SWAP_API}/swap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey: userPublicKey.toString(),
          wrapAndUnwrapSol: true,
          dynamicComputeUnitLimit: true,
          prioritizationFeeLamports: 'auto'
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      return res.json();
    });

    return response;
  } catch (error) {
    console.error('Error getting Jupiter swap transaction:', error);
    throw new Error(`Failed to get swap transaction: ${error.message}`);
  }
};

// Get route information for a quote
export const getRouteInfo = (quote) => {
  if (!quote || !quote.routePlan) {
    return {
      steps: 0,
      exchanges: [],
      priceImpact: 0
    };
  }

  const steps = quote.routePlan.length;
  const exchanges = quote.routePlan.map(step => step.swapInfo?.label || 'Unknown');
  const priceImpact = quote.priceImpactPct || 0;

  return {
    steps,
    exchanges: [...new Set(exchanges)], // Remove duplicates
    priceImpact
  };
};

// Calculate minimum output amount considering slippage
export const calculateMinimumOutput = (quote, outputMint, slippageBps) => {
  if (!quote || !quote.outAmount) return 0;
  
  const outputToken = getTokenInfo(outputMint);
  const outputAmount = parseFloat(quote.outAmount) / Math.pow(10, outputToken.decimals);
  const slippagePercentage = slippageBps / 10000; // Convert basis points to percentage
  
  return outputAmount * (1 - slippagePercentage);
};

// Validate quote response
export const validateQuote = (quote) => {
  if (!quote) {
    return { isValid: false, error: 'No quote provided' };
  }
  
  if (!quote.outAmount || parseFloat(quote.outAmount) <= 0) {
    return { isValid: false, error: 'Invalid output amount' };
  }
  
  if (!quote.routePlan || quote.routePlan.length === 0) {
    return { isValid: false, error: 'No route found' };
  }
  
  // Check for high price impact
  if (quote.priceImpactPct && quote.priceImpactPct > 15) {
    return { 
      isValid: true, 
      warning: `High price impact: ${quote.priceImpactPct.toFixed(2)}%` 
    };
  }
  
  return { isValid: true };
};

// Get supported tokens from Jupiter
export const getSupportedTokens = async () => {
  try {
    const response = await jupiterRateLimiter.execute(async () => {
      const res = await fetch(`${JUPITER_QUOTE_API}/tokens`);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      return res.json();
    });

    return response;
  } catch (error) {
    console.error('Error fetching supported tokens:', error);
    throw new Error(`Failed to fetch supported tokens: ${error.message}`);
  }
};