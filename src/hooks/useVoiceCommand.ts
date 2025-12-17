import { useState, useEffect, useCallback, useRef } from 'react';

// Define the callback type
type CommandCallback = (text: string) => void;

export const useVoiceCommand = (onCommand: CommandCallback) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [support, setSupport] = useState(true);
  
  // Use a ref to keep the recognition instance stable
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if the browser supports the Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupport(false);
    }
  }, []);

  const startListening = useCallback(() => {
    if (!support) return;
    if (isListening) return;

    // Initialize Speech Recognition
    // @ts-ignore - Typescript doesn't strictly know 'webkitSpeechRecognition'
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognitionRef.current = recognition;

    recognition.continuous = false;      // Stop after one command
    recognition.lang = 'en-US';
    recognition.interimResults = true;   // Show text while speaking

    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript;
      setTranscript(text);
    };

    recognition.onend = () => {
      setIsListening(false);
      // We grab the latest text from the state/event manually if needed, 
      // but usually the effect handles the 'transcript' state update.
    };

    // Handle errors (like 'no-speech' or 'not-allowed')
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.start();
  }, [support, isListening]);

  // Trigger the callback when the transcript updates and listening stops (or we detect a pause)
  // For simplicity in this version, we trigger immediately if we have a full result,
  // or we can wait for the 'end' event.
  // Here, we'll watch for the end of listening to fire the command.
  useEffect(() => {
    if (!isListening && transcript) {
      onCommand(transcript);
      // Clear after a moment so the UI text fades
      const timer = setTimeout(() => setTranscript(''), 2500);
      return () => clearTimeout(timer);
    }
  }, [isListening, transcript, onCommand]);

  return { isListening, transcript, startListening, support };
};
