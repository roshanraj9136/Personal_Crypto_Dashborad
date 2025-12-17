import { useState } from 'react';
import { usePriceStore } from '../store/usePriceStore';
import { clsx } from 'clsx';

export const AlertPanel = () => {
  const selectedSymbol = usePriceStore((state) => state.selectedSymbol);
  const alertConfig = usePriceStore((state) => state.alertConfig);
  const setAlert = usePriceStore((state) => state.setAlert);
  
  const [target, setTarget] = useState('');

  const handleSetAlert = () => {
    if (!target) return;
    
    // Ask browser for permission to send notifications
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    
    setAlert(selectedSymbol, parseFloat(target));
    setTarget('');
  };

  const handleCancel = () => setAlert(selectedSymbol, null);

  return (
    <div className="bg-crypto-card p-6 rounded-xl border border-gray-800 h-full">
      <h3 className="text-gray-400 font-medium mb-4">Price Alert ({selectedSymbol})</h3>
      
      {alertConfig ? (
        <div className="flex flex-col items-center justify-center h-40 animate-pulse bg-blue-500/10 rounded-lg border border-blue-500/50">
          <span className="text-blue-400 text-sm font-bold uppercase tracking-wider">Active Alert</span>
          <span className="text-3xl text-white font-mono mt-2">${alertConfig.price}</span>
          <button 
            onClick={handleCancel}
            className="mt-4 text-xs text-red-400 hover:text-red-300 underline"
          >
            Cancel Alert
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Target Price ($)</label>
            <input 
              type="number" 
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. 96000"
              className="w-full bg-black/20 border border-gray-700 rounded p-3 text-white focus:border-blue-500 outline-none font-mono"
            />
          </div>
          <button 
            onClick={handleSetAlert}
            className={clsx(
              "w-full py-3 rounded font-bold text-sm transition-all",
              target ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-gray-800 text-gray-500 cursor-not-allowed"
            )}
            disabled={!target}
          >
            SET ALERT
          </button>
          <p className="text-xs text-gray-600 mt-2">
            *Requires browser notification permission
          </p>
        </div>
      )}
    </div>
  );
};
