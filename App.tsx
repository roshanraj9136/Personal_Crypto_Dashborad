import { useCryptoWebSocket } from './features/market/hooks/useCryptoWebSocket';
import { usePriceStore } from './features/market/store/usePriceStore';
import { TickerCard } from './features/market/components/TickerCard';
import { PriceChart } from './features/market/components/PriceChart';
import { AlertPanel } from './features/market/components/AlertPanel';
import { MarketSearch } from './features/market/components/MarketSearch';
import { CurrencySelector } from './features/market/components/CurrencySelector';
import { Layout } from './components/Layout'; // Import Layout

function App() {
  useCryptoWebSocket();
  const tickers = usePriceStore((state) => state.tickers);
  const selectedSymbol = usePriceStore((state) => state.selectedSymbol); 
  const watchlist = usePriceStore((state) => state.watchlist);
  
  const tickerList = watchlist
    .map((symbol) => tickers[symbol])
    .filter(Boolean);

  return (
    <Layout>
      {/* Top Bar: Search & Currency (Floating Glass Effect) */}
      <header className="sticky top-4 z-40 bg-[#0b0e11]/80 backdrop-blur-md border border-gray-800/50 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <MarketSearch />
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <div className="text-xs text-gray-500 font-medium">Global Currency</div>
            <div className="text-sm font-bold text-gray-200">Real-time Rates</div>
          </div>
          <CurrencySelector />
        </div>
      </header>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {tickerList.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-800/50 rounded-2xl bg-gray-900/20">
            <p className="text-lg font-medium">Your watchlist is empty</p>
            <p className="text-sm">Use the search bar above to track assets.</p>
          </div>
        )}
        {tickerList.map((ticker) => (
          <TickerCard key={ticker.symbol} data={ticker} />
        ))}
      </div>

      {/* Main Workspace */}
      {selectedSymbol && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <div className="lg:col-span-2 shadow-2xl shadow-black/50 rounded-xl">
            <PriceChart symbol={selectedSymbol} />
          </div>
          <div className="lg:col-span-1 h-full">
            <AlertPanel />
          </div>
        </div>
      )}
    </Layout>
  );
}

export default App;
