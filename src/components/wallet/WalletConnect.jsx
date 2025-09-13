import React from 'react';
import { Wallet, ExternalLink } from 'lucide-react';
import Button from '../ui/Button.jsx';
import { EXTERNAL_LINKS } from '../../utils/constants.js';

const WalletConnect = ({ 
  onConnect, 
  connecting, 
  error, 
  isWalletAvailable 
}) => {
  const handleInstallPhantom = () => {
    window.open(EXTERNAL_LINKS.PHANTOM, '_blank');
  };

  if (!isWalletAvailable) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Wallet size={32} className="text-gray-400" />
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Phantom Wallet Not Found
        </h3>
        
        <p className="text-gray-600 mb-6">
          To use SolanaSwift, you need to install the Phantom wallet browser extension.
        </p>
        
        <Button
          onClick={handleInstallPhantom}
          icon={<ExternalLink size={20} />}
          iconPosition="right"
        >
          Install Phantom Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
        <Wallet size={32} className="text-white" />
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        Connect Your Wallet
      </h3>
      
      <p className="text-gray-600 mb-6">
        Connect your Phantom wallet to start swapping tokens on Solana
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <Button
        onClick={onConnect}
        loading={connecting}
        disabled={connecting}
        icon={<Wallet size={20} />}
        size="lg"
      >
        {connecting ? 'Connecting...' : 'Connect Phantom'}
      </Button>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          By connecting your wallet, you agree to our Terms of Service and acknowledge that you have read and understood our Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default WalletConnect;