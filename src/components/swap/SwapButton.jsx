import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import Button from '../ui/Button.jsx';

const SwapButton = ({
  onSwap,
  isReady,
  loading,
  hasBalance,
  hasAmount,
  hasQuote,
  isConnected,
  hasInsufficientBalance
}) => {
  // Determine button state and text
  const getButtonConfig = () => {
    if (!isConnected) {
      return {
        text: 'Connect Wallet',
        disabled: true,
        variant: 'outline'
      };
    }

    if (!hasAmount) {
      return {
        text: 'Enter Amount',
        disabled: true,
        variant: 'outline'
      };
    }

    if (hasInsufficientBalance) {
      return {
        text: 'Insufficient Balance',
        disabled: true,
        variant: 'danger'
      };
    }

    if (!hasQuote) {
      return {
        text: 'Getting Quote...',
        disabled: true,
        variant: 'outline'
      };
    }

    if (loading) {
      return {
        text: 'Swapping...',
        disabled: true,
        variant: 'primary',
        loading: true
      };
    }

    if (isReady) {
      return {
        text: 'Swap Tokens',
        disabled: false,
        variant: 'primary'
      };
    }

    return {
      text: 'Swap',
      disabled: true,
      variant: 'outline'
    };
  };

  const config = getButtonConfig();

  return (
    <Button
      onClick={onSwap}
      disabled={config.disabled}
      loading={config.loading}
      variant={config.variant}
      size="lg"
      className="w-full"
      icon={!config.loading ? <ArrowUpDown size={20} /> : undefined}
    >
      {config.text}
    </Button>
  );
};

export default SwapButton;