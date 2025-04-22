
import { useState, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { speechRecognition } from '@/utils/recognition';

export interface VoiceSessionOptions {
  onSessionStart?: () => void;
  onSessionEnd?: () => void;
}

export function useVoiceSession({
  onSessionStart,
  onSessionEnd
}: VoiceSessionOptions) {
  const [sessionActive, setSessionActive] = useState<boolean>(false);
  const sessionStartTimeRef = useRef<number>(0);
  
  const startSession = () => {
    setSessionActive(true);
    sessionStartTimeRef.current = Date.now();
    
    if (onSessionStart) onSessionStart();
    
    toast({
      title: "Session started",
      description: "Your Cybella AI therapy session has begun. Click the microphone and speak when you're ready.",
    });
    
    return "Hello, I'm Cybella, your AI therapy assistant. I'm here to listen and help you with whatever you're going through. How are you feeling today?";
  };
  
  const endSession = () => {
    setSessionActive(false);
    speechRecognition.stop();
    
    toast({
      title: "Session ended",
      description: "Your Cybella AI therapy session has ended. Thank you for using our service.",
    });
    
    if (onSessionEnd) onSessionEnd();
  };
  
  const toggleSession = () => {
    if (sessionActive) {
      endSession();
      return null;
    } else {
      return startSession();
    }
  };

  return {
    sessionActive,
    toggleSession,
    startSession,
    endSession,
    sessionStartTime: sessionStartTimeRef.current
  };
}
