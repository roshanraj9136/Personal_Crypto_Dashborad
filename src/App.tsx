import { useCryptoWebSocket } from './features/market/hooks/useCryptoWebSocket';
import { usePriceStore } from './features/market/store/usePriceStore';
import { TickerCard } from './features/market/components/TickerCard';
import { PriceChart } from './features/market/components/PriceChart';
import { AlertPanel } from './features/market/components/AlertPanel';
import { MarketSearch } from './features/market/components/MarketSearch';
import { CurrencySelector } from './features/market/components/CurrencySelector';
import { Jarvis } from './components/Jarvis'; // <--- 1. Import Jarvis

function App() {
  useCryptoWebSocket();
  const tickers = usePriceStore((state) => state.tickers);
  const selectedSymbol = usePriceStore((state) => state.selectedSymbol); 
  const watchlist = usePriceStore((state) => state.watchlist);
  
  const tickerList = watchlist
    .map((symbol) => tickers[symbol])
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-crypto-dark p-6 md:p-10 text-white font-sans relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Currency Selector */}
        <header className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-start w-full md:w-auto">
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-blue-500">Pro</span>Trade
            </h1>
            <p className="text-gray-500 text-sm">Real-time Multi-Currency Feed</p>
          </div>
          
          {/* Right Side Controls */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
             <CurrencySelector />
          </div>
        </header>

        <MarketSearch />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {tickerList.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed border-gray-800 rounded-xl">
              Add a coin using the search bar above.
            </div>
          )}
          {tickerList.map((ticker) => (
            <TickerCard key={ticker.symbol} data={ticker} />
          ))}
        </div>

        {selectedSymbol && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PriceChart symbol={selectedSymbol} />
            </div>
            <div className="lg:col-span-1 mt-6 lg:mt-0">
              <AlertPanel />
            </div>
          </div>
        )}
        
        {/* 2. Add Jarvis Here */}
        <Jarvis />
        
      </div>
    </div>
  );
}

export default App;
