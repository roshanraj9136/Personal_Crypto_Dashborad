import { useState, useRef, useEffect } from 'react';
import { usePriceStore } from '../store/usePriceStore';
import { useCoinList } from '../hooks/useCoinList'; // Import our new hook
import { Search, Plus, X, Loader2 } from 'lucide-react';

export const MarketSearch = () => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const addToWatchlist = usePriceStore((state) => state.addToWatchlist);
  const watchlist = usePriceStore((state) => state.watchlist);
  const removeFromWatchlist = usePriceStore((state) => state.removeFromWatchlist);
  
  // 1. Get the Master List of coins
  const { data: allCoins, isLoading } = useCoinList();

  // 2. Filter suggestions based on input
  const suggestions = allCoins
    ? allCoins.filter((coin) => coin.includes(input.toUpperCase())).slice(0, 5) // Limit to top 5 matches
    : [];

  const handleSelect = (symbol: string) => {
    addToWatchlist(symbol);
    setInput('');
    setShowSuggestions(false);
  };

  // Close dropdown if clicking outside
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  return (
    <div className="bg-crypto-card p-4 rounded-xl border border-gray-800 mb-6" ref={wrapperRef}>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        
        {/* Search Input Wrapper */}
        <div className="relative w-full md:w-96 z-50">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          
          <input
            type="text"
            value={input}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            placeholder={isLoading ? "Loading coin list..." : "Search coin (e.g. PEPE, DOGE)..."}
            disabled={isLoading}
            className="w-full bg-black/20 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-blue-500 outline-none placeholder:text-gray-600 transition-all"
          />

          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />
          )}

          {/* 3. The Suggestions Dropdown */}
          {showSuggestions && input && suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 mt-2 bg-[#1e2026] border border-gray-700 rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto">
              {suggestions.map((coin) => (
                <li 
                  key={coin}
                  onClick={() => handleSelect(coin)}
                  className="px-4 py-3 hover:bg-gray-700/50 cursor-pointer flex items-center justify-between group transition-colors"
                >
                  <span className="font-medium text-gray-200">{coin}</span>
                  <Plus className="w-4 h-4 text-gray-500 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all" />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Active Tags */}
        <div className="flex flex-wrap gap-2">
          {watchlist.map((symbol) => (
            <div 
              key={symbol} 
              className="flex items-center gap-1 bg-gray-800/50 border border-gray-700 px-3 py-1 rounded-full text-xs text-gray-300 animate-in fade-in zoom-in duration-200"
            >
              {symbol}
              <button 
                onClick={() => removeFromWatchlist(symbol)}
                className="hover:text-red-400 ml-1 p-0.5 rounded-full hover:bg-white/5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
