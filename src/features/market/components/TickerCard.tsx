import { useEffect, useRef, useState } from 'react';
import type { TickerData } from '../types';
import clsx from 'clsx';
import { usePriceStore } from '../store/usePriceStore';
import { formatCurrency, formatPct } from '../../../utils';

interface Props {
  data: TickerData;
}

export const TickerCard = ({ data }: Props) => {
  const { symbol, price, changePercent } = data;
  
  const setSelectedSymbol = usePriceStore((state) => state.setSelectedSymbol);
  const selectedSymbol = usePriceStore((state) => state.selectedSymbol);
  
  const selectedCurrency = usePriceStore((state) => state.selectedCurrency);
  const exchangeRate = usePriceStore((state) => state.exchangeRate);

  const isSelected = selectedSymbol === symbol;
  const prevPrice = useRef(price);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (parseFloat(price) > parseFloat(prevPrice.current)) setFlash('up');
    else if (parseFloat(price) < parseFloat(prevPrice.current)) setFlash('down');
    prevPrice.current = price;
    const timer = setTimeout(() => setFlash(null), 300);
    return () => clearTimeout(timer);
  }, [price]);

  return (
    <div 
      onClick={() => setSelectedSymbol(symbol)}
      className={clsx(
        "p-6 rounded-xl border transition-all duration-300 ease-out cursor-pointer hover:shadow-lg",
        isSelected ? "border-blue-500 ring-1 ring-blue-500 bg-blue-500/10" : 
        flash === 'up' ? "bg-green-500/20 border-green-500" :
        flash === 'down' ? "bg-red-500/20 border-red-500" :
        "bg-crypto-card border-gray-800"
      )}
    >
      <h2 className="text-gray-400 font-medium text-sm tracking-wider">{symbol}</h2>
      
      <div className={clsx(
        "text-3xl font-mono font-bold mt-2 tracking-tight transition-colors",
        flash === 'up' ? "text-green-400" :
        flash === 'down' ? "text-red-400" :
        "text-white"
      )}>
        {new Intl.NumberFormat('en-US', { 
           style: 'currency', 
           currency: selectedCurrency,
           minimumFractionDigits: 2,
           maximumFractionDigits: 2 
        }).format(parseFloat(price) * exchangeRate)}
      </div>
      
      <div className={`text-sm mt-3 font-bold flex items-center ${
        parseFloat(changePercent) > 0 ? 'text-trade-up' : 'text-trade-down'
      }`}>
        {parseFloat(changePercent) > 0 ? '▲' : '▼'} 
        <span className="ml-1">{formatPct(changePercent)}</span>
      </div>
    </div>
  );
};
