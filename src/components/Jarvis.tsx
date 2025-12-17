import { useEffect, useState } from 'react';
// 👇 FIXED IMPORT: Points to src/hooks/useVoiceCommand
import { useVoiceCommand } from '../hooks/useVoiceCommand'; 
import { usePriceStore } from '../features/market/store/usePriceStore';
import { Mic, MicOff } from 'lucide-react';
import clsx from 'clsx';

// 1. The "Knowledge Graph" (What Jarvis knows)
const KNOWLEDGE_BASE: Record<string, string> = {
  'hello': 'Hello sir. The market looks volatile today.',
  'hi': 'Greetings. Ready to trade?',
  'how are you': 'I am fully operational and monitoring 300 assets.',
  'who are you': 'I am ProTrade Assistant, designed to help you make money.',
  'what is bitcoin': 'Bitcoin is a decentralized digital currency, often called digital gold.',
  'what is ethereum': 'Ethereum is a decentralized platform that runs smart contracts.',
  'buy': 'I cannot execute trades yet, but I can set alerts for you.',
  'sell': 'Paper hands? I recommend holding.',
  'thank you': 'You are welcome.',
  'bye': 'Goodbye. I will keep watching the charts.',
};

const COIN_DICTIONARY: Record<string, string> = {
  'bitcoin': 'BTC', 'btc': 'BTC',
  'ethereum': 'ETH', 'ether': 'ETH', 'eth': 'ETH',
  'solana': 'SOL', 'sol': 'SOL',
  'doge': 'DOGE', 'dogecoin': 'DOGE',
  'ripple': 'XRP', 'xrp': 'XRP',
  'cardano': 'ADA', 'binance': 'BNB', 'bnb': 'BNB',
  'pepe': 'PEPE', 'shiba': 'SHIB', 'matic': 'MATIC'
};

export const Jarvis = () => {
  const setSelectedSymbol = usePriceStore((state) => state.setSelectedSymbol);
  const watchlist = usePriceStore((state) => state.watchlist);
  const tickers = usePriceStore((state) => state.tickers);
  
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 2. The "Natural Voice" Selector
  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    const preferredVoice = voices.find(v => 
      v.name.includes('Google US English') || 
      v.name.includes('Microsoft Zira') ||
      v.name.includes('Samantha')
    );

    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.pitch = 1;
    utterance.rate = 1.1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const processCommand = (text: string) => {
    const lower = text.toLowerCase();
    console.log("Jarvis heard:", lower);

    // --- LEVEL 1: CONVERSATION ---
    for (const [key, response] of Object.entries(KNOWLEDGE_BASE)) {
      if (lower.includes(key)) {
        speak(response);
        return;
      }
    }

    // --- LEVEL 2: MARKET DATA ---
    let targetSymbol: string | null = null;

    for (const [name, symbol] of Object.entries(COIN_DICTIONARY)) {
      if (lower.includes(name)) {
        targetSymbol = symbol;
        break;
      }
    }
    if (!targetSymbol) {
      targetSymbol = watchlist
        .map(s => s.replace('USDT', ''))
        .find(s => lower.includes(s.toLowerCase())) || null;
    }

    if (!targetSymbol) {
      speak("I didn't catch that. Try saying 'Switch to Bitcoin' or ask me 'What is Ethereum'.");
      return;
    }

    const fullPair = watchlist.find(s => s.startsWith(targetSymbol!));

    if (!fullPair) {
      speak(`I know ${targetSymbol}, but you haven't added it to your watchlist yet. Add it in the search bar.`);
      return;
    }

    // --- LEVEL 3: EXECUTION ---
    if (lower.includes('switch') || lower.includes('show') || lower.includes('open') || lower.includes('go to')) {
      setSelectedSymbol(fullPair);
      speak(`Right away. Pulling up the ${targetSymbol} chart.`);
    }
    else if (lower.includes('price') || lower.includes('how much') || lower.includes('value')) {
      if (tickers[fullPair]) {
        const price = parseFloat(tickers[fullPair].price).toFixed(2);
        const responses = [
          `${targetSymbol} is trading at ${price} dollars.`,
          `Current market value for ${targetSymbol} is ${price}.`,
          `It is sitting at ${price} dollars right now.`
        ];
        speak(responses[Math.floor(Math.random() * responses.length)]);
      }
    }
    else {
      setSelectedSymbol(fullPair);
      speak(`Displaying ${targetSymbol}.`);
    }
  };

  const { isListening, transcript, startListening, support } = useVoiceCommand(processCommand);

  if (!support) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      
      {transcript && (
        <div className="bg-black/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl border border-blue-500/30 shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-auto">
          <p className="font-mono text-xs text-blue-300 mb-1 uppercase tracking-widest">Listening...</p>
          <p className="text-lg font-medium">"{transcript}"</p>
        </div>
      )}

      <button
        onClick={startListening}
        disabled={isSpeaking}
        className={clsx(
          "pointer-events-auto w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl border-4 relative overflow-hidden",
          isListening 
            ? "bg-red-500 border-red-400 shadow-[0_0_40px_rgba(239,68,68,0.5)] scale-110" 
            : isSpeaking
            ? "bg-purple-600 border-purple-400 shadow-[0_0_40px_rgba(147,51,234,0.5)]"
            : "bg-blue-600 border-blue-500 hover:bg-blue-500 hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
        )}
      >
        {isSpeaking && (
           <div className="absolute inset-0 flex items-center justify-center gap-1">
             {[1,2,3].map(i => (
               <div key={i} className="w-1 bg-white animate-[bounce_1s_infinite]" style={{ animationDelay: `${i * 0.1}s` }} />
             ))}
           </div>
        )}

        {!isSpeaking && (
          isListening ? <Mic className="w-8 h-8 text-white animate-pulse" /> : <MicOff className="w-8 h-8 text-white/80" />
        )}
      </button>
    </div>
  );
};
