import React from 'react';
import { ExternalLink, Heart, Shield, Zap } from 'lucide-react';
import { EXTERNAL_LINKS } from '../../utils/constants.js';

const Footer = ({ 
  networkStatus = { connected: true },
  jupiterStatus = { connected: true },
  pricesUpdating = false 
}) => {
  return (
    <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">SolanaSwift</h3>
            </div>
            
            <p className="text-gray-600 mb-4 max-w-md">
              Fast, secure, and user-friendly DEX for swapping tokens on the Solana blockchain. 
              Powered by Jupiter aggregator for the best prices and routes.
            </p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Shield size={14} />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap size={14} />
                <span>Fast</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart size={14} className="text-red-500" />
                <span>Open Source</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Resources</h3>
            <div className="space-y-3">
              <a 
                href={EXTERNAL_LINKS.RAYDIUM} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors group"
              >
                <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                <span>Raydium DEX</span>
              </a>
              
              <a 
                href={EXTERNAL_LINKS.JUPITER} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors group"
              >
                <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                <span>Jupiter Aggregator</span>
              </a>
              
              <a 
                href={EXTERNAL_LINKS.SOLSCAN} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors group"
              >
                <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                <span>Solscan Explorer</span>
              </a>
              
              <a 
                href={EXTERNAL_LINKS.PHANTOM} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors group"
              >
                <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                <span>Phantom Wallet</span>
              </a>
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Solana Network</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    networkStatus.connected ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`text-xs font-medium ${
                    networkStatus.connected ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {networkStatus.connected ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Jupiter API</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    jupiterStatus.connected ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`text-xs font-medium ${
                    jupiterStatus.connected ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {jupiterStatus.connected ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Price Updates</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    pricesUpdating ? 'bg-blue-500 animate-pulse' : 'bg-green-500'
                  }`}></div>
                  <span className="text-xs font-medium text-blue-600">
                    {pricesUpdating ? 'Updating...' : 'Live'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500 text-center md:text-left">
              <p>© 2024 SolanaSwift. Built with ❤️ for the Solana ecosystem.</p>
            </div>
            
            <div className="flex items-center gap-6 text-xs text-gray-400">
              <span>Version 1.0.0</span>
              <span>•</span>
              <span>Mainnet Beta</span>
              <span>•</span>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gray-600 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;