import { useEffect, useRef } from 'react';
import { usePriceStore } from '../store/usePriceStore';

const ALERT_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

export const useCryptoWebSocket = () => {
  const setTicker = usePriceStore((state) => state.setTicker);
  const alertConfig = usePriceStore((state) => state.alertConfig);
  const setAlert = usePriceStore((state) => state.setAlert);
  const watchlist = usePriceStore((state) => state.watchlist);

  const socketRef = useRef<WebSocket | null>(null);
  const hasTriggeredRef = useRef(false);
  const audioRef = useRef(new Audio(ALERT_SOUND_URL));

  useEffect(() => {
    if (watchlist.length === 0) return;

    // FIX 1: Use the /stream?streams= endpoint on Port 443
    const streams = watchlist.map((symbol) => `${symbol.toLowerCase()}@ticker`).join('/');
    const wsUrl = `wss://stream.binance.com:443/stream?streams=${streams}`;

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      
      // FIX 2: In combined streams, the data is inside response.data
      const ticker = response.data; 

      if (!ticker || !ticker.s || !ticker.c) return;

      const { s: symbol, c: priceStr, P: changePercent } = ticker;
      const currentPrice = parseFloat(priceStr);

      if (alertConfig && alertConfig.symbol === symbol && !hasTriggeredRef.current) {
        const hitTarget = currentPrice >= alertConfig.price;
        if (hitTarget) {
          audioRef.current.play().catch(e => console.error(e));
          if (Notification.permission === 'granted') {
            new Notification(`🚀 ${symbol} Hit Target!`, { body: `$${currentPrice}` });
          }
          hasTriggeredRef.current = true;
          setAlert(symbol, null);
        }
      }

      if (!alertConfig) hasTriggeredRef.current = false;

      setTicker(symbol, {
        symbol,
        price: currentPrice.toFixed(2),
        changePercent: parseFloat(changePercent).toFixed(2),
      });
    };

    return () => {
      if (ws.readyState === 1) ws.close();
    };
  }, [watchlist, setTicker, alertConfig, setAlert]);
};
