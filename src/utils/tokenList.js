// Popular Solana tokens with metadata
export const POPULAR_TOKENS = {
  'So11111111111111111111111111111111111111112': {
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
  },
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
  },
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png'
  },
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': {
    symbol: 'mSOL',
    name: 'Marinade staked SOL',
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png'
  },
  '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs': {
    symbol: 'ETH',
    name: 'Ethereum (Portal)',
    decimals: 8,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs/logo.png'
  },
  'A9mUU4qviSctJVPJdBJWkb28deg915LYJKrzQ19ji3FM': {
    symbol: 'USDCet',
    name: 'USD Coin (Portal from Ethereum)',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/A9mUU4qviSctJVPJdBJWkb28deg915LYJKrzQ19ji3FM/logo.png'
  },
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': {
    symbol: 'BONK',
    name: 'Bonk',
    decimals: 5,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png'
  },
  'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN': {
    symbol: 'JUP',
    name: 'Jupiter',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN/logo.png'
  },
  'jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL': {
    symbol: 'JITO',
    name: 'Jito Staked SOL',
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL/logo.png'
  },
  'rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof': {
    symbol: 'RND',
    name: 'Render Token',
    decimals: 8,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof/logo.png'
  }
};

// Get token info by mint address
export const getTokenInfo = (mint) => {
  return POPULAR_TOKENS[mint] || {
    symbol: mint.slice(0, 8) + '...',
    name: 'Unknown Token',
    decimals: 6,
    logoURI: `https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/${mint}/logo.png`
  };
};

// Get all token mint addresses
export const getAllTokenMints = () => {
  return Object.keys(POPULAR_TOKENS);
};

// Check if token is supported
export const isTokenSupported = (mint) => {
  return mint in POPULAR_TOKENS;
};