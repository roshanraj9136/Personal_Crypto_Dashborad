import { create } from 'zustand';
import type { TickerData } from '../types';

interface PriceState {
  tickers: Record<string, TickerData>;
  selectedSymbol: string;
  watchlist: string[];
  alertConfig: { symbol: string; price: number } | null;
  
  // NEW: Currency State
  selectedCurrency: string; // 'USD', 'INR', 'EUR'
  exchangeRate: number;     // 1 for USD, 84.5 for INR, etc.

  setTicker: (symbol: string, data: TickerData) => void;
  setSelectedSymbol: (symbol: string) => void;
  setAlert: (symbol: string, price: number | null) => void;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  
  // NEW: Currency Actions
  setCurrency: (currency: string, rate: number) => void;
}

export const usePriceStore = create<PriceState>((set) => ({
  tickers: {},
  selectedSymbol: 'BTCUSDT',
  watchlist: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'],
  alertConfig: null,
  
  // Defaults
  selectedCurrency: 'USD',
  exchangeRate: 1,

  setTicker: (symbol, data) => 
    set((state) => ({ tickers: { ...state.tickers, [symbol]: data } })),
  
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
  
  setAlert: (symbol, price) => set({ 
    alertConfig: price ? { symbol, price } : null 
  }),

  addToWatchlist: (symbol) => set((state) => {
    if (state.watchlist.includes(symbol)) return state;
    return { watchlist: [...state.watchlist, symbol] };
  }),

  removeFromWatchlist: (symbol) => set((state) => ({
    watchlist: state.watchlist.filter((s) => s !== symbol),
    selectedSymbol: state.selectedSymbol === symbol 
      ? state.watchlist.find((s) => s !== symbol) || '' 
      : state.selectedSymbol
  })),

  // Set both currency name AND the multiplier rate
  setCurrency: (currency, rate) => set({ selectedCurrency: currency, exchangeRate: rate }),
}));
