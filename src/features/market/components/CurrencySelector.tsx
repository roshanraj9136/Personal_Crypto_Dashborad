import {} from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { usePriceStore } from '../store/usePriceStore';
import { Globe } from 'lucide-react';

const SUPPORTED_CURRENCIES = ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];

export const CurrencySelector = () => {
  const selectedCurrency = usePriceStore((state) => state.selectedCurrency);
  const setCurrency = usePriceStore((state) => state.setCurrency);

  // 1. Fetch live rates from open API
  const { data: rates } = useQuery({
    queryKey: ['exchangeRates'],
    queryFn: async () => {
      // Frankfurter is a free API, no key needed. Base USD.
      const { data } = await axios.get('https://api.frankfurter.app/latest?from=USD');
      return data.rates; // Returns object like { INR: 83.5, EUR: 0.92 ... }
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  // 2. Handle selection
  const handleChange = (currency: string) => {
    if (currency === 'USD') {
      setCurrency('USD', 1);
    } else if (rates && rates[currency]) {
      setCurrency(currency, rates[currency]);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg border border-gray-700">
      <Globe className="w-4 h-4 text-gray-400" />
      <select 
        value={selectedCurrency}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-transparent text-sm font-medium text-white outline-none cursor-pointer [&>option]:bg-gray-800"
      >
        {SUPPORTED_CURRENCIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
};
