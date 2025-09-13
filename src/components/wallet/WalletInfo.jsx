import React, { useState } from 'react';
import { Copy, CheckCircle, ExternalLink, LogOut } from 'lucide-react';
import Button from '../ui/Button.jsx';
import { formatWalletAddress } from '../../utils/formatters.js';
import { EXTERNAL_LINKS } from '../../utils/constants.js';

const WalletInfo = ({ 
  address, 
  onDisconnect, 
  isConnected 
}) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const viewOnExplorer = () => {
    window.open(`${EXTERNAL_LINKS.SOLSCAN}/account/${address}`, '_blank');
  };

  if (!isConnected || !address) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      {/* Connection Status */}
      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-mono text-gray-700">
          {formatWalletAddress(address, 4, 4)}
        </span>
        
        <button
          onClick={copyAddress}
          className="text-gray-500 hover:text-gray-700 transition-colors p-1"
          title="Copy wallet address"
        >
          {copied ? (
            <CheckCircle size={16} className="text-green-500" />
          ) : (
            <Copy size={16} />
          )}
        </button>
        
        <button
          onClick={viewOnExplorer}
          className="text-gray-500 hover:text-gray-700 transition-colors p-1"
          title="View on Solscan"
        >
          <ExternalLink size={16} />
        </button>
      </div>
      
      {/* Disconnect Button */}
      <Button
        onClick={onDisconnect}
        variant="danger"
        size="sm"
        icon={<LogOut size={16} />}
      >
        Disconnect
      </Button>
    </div>
  );
};

export default WalletInfo;