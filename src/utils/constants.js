// Solana configuration
export const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';
export const SOLANA_NETWORK = 'mainnet-beta';

// Jupiter API endpoints
export const JUPITER_QUOTE_API = 'https://quote-api.jup.ag/v6';
export const JUPITER_SWAP_API = 'https://quote-api.jup.ag/v6';

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  MAX_REQUESTS: 10,
  WINDOW_MS: 60000, // 1 minute
};

// Default slippage values
export const SLIPPAGE_OPTIONS = [0.1, 0.5, 1.0];
export const DEFAULT_SLIPPAGE = 0.5;

// UI configuration
export const NOTIFICATION_TIMEOUT = 5000;
export const DEBOUNCE_DELAY = 500;

// External links
export const EXTERNAL_LINKS = {
  RAYDIUM: 'https://raydium.io',
  JUPITER: 'https://jup.ag',
  PHANTOM: 'https://phantom.app/',
  SOLSCAN: 'https://solscan.io',
};

// Token program IDs
export const TOKEN_PROGRAM_ID = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
export const ASSOCIATED_TOKEN_PROGRAM_ID = 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';

// Fallback token image
export const FALLBACK_TOKEN_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNEREREREQiLz4KPHA+dGggZD0iTTIwIDEwVjMwTTEwIDIwSDMwIiBzdHJva2U9IiM5OTk5OTkiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4=';