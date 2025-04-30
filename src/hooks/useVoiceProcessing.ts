import { useState } from 'react';
import { Emotion } from '@/components/EmotionDisplay';
import { useAIResponse } from '@/hooks/useAIResponse';
import { 
  useSpeechRecognition, 
  useAudioVisualization, 
  useEmotionDetection 
} from '@/hooks/voice';

// Main hook that combines all voice processing functionality
export function useVoiceProcessing({
  sessionActive,
  onVoiceEmotionDetected,
}: {
  sessionActive: boolean;
  onVoiceEmotionDetected?: (emotion: Emotion, confidence: number) => void;
}) {
  const [transcription, setTranscription] = useState<string>('');
  
  const { 
    aiResponse, 
    shouldPlayVoice, 
    processingInput, 
    generateAIResponse,
    setAiResponse,
    setShouldPlayVoice
  } = useAIResponse();
  
  const { detectVoiceEmotion } = useEmotionDetection({
    sessionActive,
    onVoiceEmotionDetected
  });
  
  const processUserInput = (input: string) => {
    if (!input.trim()) return;
    
    setTranscription(input);
    detectVoiceEmotion();
    generateAIResponse(input);
  };
  
  const speechRecognition = useSpeechRecognition({
    sessionActive,
    onTranscriptionComplete: processUserInput
  });
  
  const audioData = useAudioVisualization(speechRecognition.isListening);
  
  return {
    isListening: speechRecognition.isListening,
    transcription,
    setTranscription,
    interimTranscript: speechRecognition.interimTranscript,
    setInterimTranscript: (transcript: string) => {
      // This is a pass-through function since interimTranscript is managed by speechRecognition
      // But we need to expose it for the component
    },
    aiResponse,
    shouldPlayVoice,
    audioData,
    processingInput,
    sessionActive,
    speechRecognitionSupported: speechRecognition.speechRecognitionSupported,
    toggleListening: speechRecognition.toggleListening,
    startListening: speechRecognition.startListening,
    stopListening: speechRecognition.stopListening,
    setAiResponse,
    setShouldPlayVoice
  };
}

// Re-export from voice hooks for backward compatibility
export * from './voice/useVoiceSession';