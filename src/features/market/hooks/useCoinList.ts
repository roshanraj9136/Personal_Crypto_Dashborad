import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useCoinList = () => {
  return useQuery({
    queryKey: ['coinList'],
    queryFn: async () => {
      // Fetch all trading pairs from Binance
      const { data } = await axios.get('https://api.binance.com/api/v3/exchangeInfo');
      
      // Filter only for pairs ending in 'USDT' that are currently TRADING
      const symbols = data.symbols
        .filter((s: any) => s.quoteAsset === 'USDT' && s.status === 'TRADING')
        .map((s: any) => s.symbol); // Just get the names like "BTCUSDT"
        
      return symbols as string[];
    },
    staleTime: 1000 * 60 * 60 * 24, // Cache this list for 24 hours
  });
};
