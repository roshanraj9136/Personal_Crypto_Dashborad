import { useState, useEffect } from 'react';
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { usePriceStore } from '../store/usePriceStore';
import { formatCurrency } from '../../../utils';
import { Pause, Play } from 'lucide-react'; // Icons for controls

export const PriceChart = ({ symbol }: { symbol: string }) => {
  // 1. Get Live Data from Store
  const currentTicker = usePriceStore((state) => state.tickers[symbol]);
  const selectedCurrency = usePriceStore((state) => state.selectedCurrency);
  const exchangeRate = usePriceStore((state) => state.exchangeRate);

  // 2. Local State for the "Live Stream"
  const [data, setData] = useState<{ time: number; price: number }[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  // 3. Reset chart when symbol changes
  useEffect(() => {
    setData([]);
  }, [symbol]);

  // 4. THE ENGINE: Append new data every time price changes
  useEffect(() => {
    if (!currentTicker || isPaused) return;

    const newPoint = {
      time: Date.now(),
      price: parseFloat(currentTicker.price),
    };

    setData((prev) => {
      // Keep only the last 60 seconds (approx 60-100 ticks) for high precision
      const newData = [...prev, newPoint];
      if (newData.length > 100) return newData.slice(1); // Rolling window
      return newData;
    });

  }, [currentTicker, isPaused]); // Runs on every WebSocket tick

  // Calculate dynamic colors
  const isUp = data.length > 1 && data[data.length - 1].price >= data[0].price;
  const color = isUp ? '#0ecb81' : '#f6465d';

  return (
    <div className="bg-crypto-card p-6 rounded-xl border border-gray-800 h-full flex flex-col min-h-[400px]">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-gray-500' : 'bg-green-500 animate-pulse'}`} />
          <h3 className="text-gray-200 font-bold text-lg">
            Live Fluctuation
            <span className="text-xs text-gray-500 font-normal ml-2">
              {symbol} • Real-time Ticks
            </span>
          </h3>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
            title={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setData([])} // Manual Clear
            className="text-xs text-gray-500 hover:text-red-400 px-2 py-1"
          >
            Clear
          </button>
        </div>
      </div>
      
      {/* Chart Area */}
      <div className="flex-1 w-full relative">
        {data.length < 2 ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 animate-pulse">
            Waiting for next tick...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorLive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#2b2f36" vertical={false} />
              
              <XAxis 
                dataKey="time" 
                domain={['dataMin', 'dataMax']}
                type="number"
                tickFormatter={(unix) => new Date(unix).toLocaleTimeString([], { second: '2-digit' })}
                tick={{ fontSize: 10, fill: '#6b7280' }} 
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              
              <YAxis 
                // 5. MAGIC: 'dataMin' zooms in to the smallest difference
                domain={['dataMin', 'dataMax']} 
                tick={{ fontSize: 11, fill: '#6b7280' }}
                width={80} 
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => 
                   new Intl.NumberFormat('en-US', { 
                     style: 'currency', currency: selectedCurrency, notation: "compact"
                   }).format(val * exchangeRate)
                }
              />
              
              <Tooltip 
                cursor={{ stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '4 4' }}
                contentStyle={{ backgroundColor: '#181a20', borderColor: '#2b2f36', borderRadius: '8px' }}
                itemStyle={{ color: color, fontWeight: 'bold' }}
                labelFormatter={(label) => new Date(label).toLocaleTimeString() + `.${new Date(label).getMilliseconds()}`}
                formatter={(value: number) => [
                  formatCurrency(value, exchangeRate, selectedCurrency), 
                  'Price'
                ]}
              />
              
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={color} 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorLive)" 
                isAnimationActive={false} // Disable animation for instant "tick" feel
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
