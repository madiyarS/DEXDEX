import React from 'react';
import { AlertTriangle, Info, TrendingDown } from 'lucide-react';
import { getTokenInfo } from '../../utils/tokenList.js';
import { fromSmallestUnit } from '../../utils/formatters.js';

const QuoteDisplay = ({
  quote,
  loading,
  error,
  fromToken,
  toToken,
  slippage
}) => {
  if (loading) {
    return (
      <div className="bg-blue-50 rounded-lg p-4 animate-pulse">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-blue-200 rounded"></div>
          <div className="w-24 h-4 bg-blue-200 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="w-full h-3 bg-blue-200 rounded"></div>
          <div className="w-3/4 h-3 bg-blue-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle size={16} />
          <span className="text-sm font-medium">Quote Error</span>
        </div>
        <p className="text-sm text-red-600 mt-1">{error}</p>
      </div>
    );
  }

  if (!quote) {
    return null;
  }

  const toTokenInfo = getTokenInfo(toToken);
  const minOutput = quote.outAmount ? 
    fromSmallestUnit(quote.outAmount, toTokenInfo.decimals) * (1 - slippage / 100) : 0;
  
  const priceImpact = quote.priceImpactPct || 0;
  const routeSteps = quote.routePlan?.length || 0;

  // Determine price impact severity
  const getPriceImpactColor = (impact) => {
    if (impact < 1) return 'text-green-600';
    if (impact < 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriceImpactIcon = (impact) => {
    if (impact >= 5) return <AlertTriangle size={16} />;
    if (impact >= 1) return <TrendingDown size={16} />;
    return <Info size={16} />;
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 text-blue-700">
        <Info size={16} />
        <span className="text-sm font-medium">Quote Details</span>
      </div>

      <div className="space-y-2 text-sm">
        {/* Route Information */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Route:</span>
          <span className="font-medium text-blue-600">
            {routeSteps} step{routeSteps !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Price Impact */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Price Impact:</span>
          <div className={`flex items-center gap-1 font-medium ${getPriceImpactColor(priceImpact)}`}>
            {getPriceImpactIcon(priceImpact)}
            {priceImpact.toFixed(2)}%
          </div>
        </div>

        {/* Minimum Received */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Minimum Received:</span>
          <span className="font-medium text-gray-900">
            {minOutput.toFixed(6)} {toTokenInfo.symbol}
          </span>
        </div>

        {/* Slippage */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Slippage Tolerance:</span>
          <span className="font-medium text-gray-900">{slippage}%</span>
        </div>

        {/* Route Plan Details */}
        {quote.routePlan && quote.routePlan.length > 0 && (
          <div className="pt-2 border-t border-blue-200">
            <div className="text-xs text-gray-600 mb-1">Route:</div>
            <div className="flex flex-wrap gap-1">
              {quote.routePlan.map((step, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                >
                  {step.swapInfo?.label || `Step ${index + 1}`}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* High Price Impact Warning */}
      {priceImpact > 5 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
          <div className="flex items-center gap-2 text-red-600 mb-1">
            <AlertTriangle size={16} />
            <span className="text-sm font-medium">High Price Impact Warning</span>
          </div>
          <p className="text-xs text-red-600">
            This swap has a high price impact of {priceImpact.toFixed(2)}%. 
            You may lose a significant portion of your tokens due to slippage.
          </p>
        </div>
      )}
    </div>
  );
};

export default QuoteDisplay;