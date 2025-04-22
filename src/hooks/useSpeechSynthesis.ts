
import { useState, useEffect, useRef } from 'react';

// Interface for hook props
interface UseSpeechSynthesisProps {
  text: string;
  autoplay?: boolean;
}

// Interface for hook return value
interface UseSpeechSynthesisReturn {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  handlePlay: () => void;
  toggleMute: () => void;
  handleVolumeChange: (value: number) => void;
}

// Speech Synthesis Hook
export function useSpeechSynthesis({ 
  text, 
  autoplay = false 
}: UseSpeechSynthesisProps): UseSpeechSynthesisReturn {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.75);
  
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Clean up any existing speech synthesis when unmounting
  useEffect(() => {
    return () => {
      if (speechRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  useEffect(() => {
    if (autoplay && text && !isMuted) {
      handlePlay();
    }
  }, [text, autoplay, isMuted]);
  
  const handlePlay = () => {
    if (!text || isMuted) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    // Create and configure a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = volume;
    utterance.lang = 'en-US';
    
    // Try to find a matching voice for English
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(voice => voice.lang.startsWith('en-US'));
    
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }
    
    // Set up event handlers
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    // Store the utterance and start playing
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };
  
  const toggleMute = () => {
    if (isPlaying && !isMuted) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
    setIsMuted(!isMuted);
  };
  
  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (speechRef.current) {
      speechRef.current.volume = value;
    }
  };
  
  return {
    isPlaying,
    isMuted,
    volume,
    handlePlay,
    toggleMute,
    handleVolumeChange
  };
}
