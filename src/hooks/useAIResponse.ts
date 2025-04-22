
import { useState, useCallback } from 'react';

export function useAIResponse() {
  const [aiResponse, setAiResponse] = useState<string>('');
  const [shouldPlayVoice, setShouldPlayVoice] = useState(false);
  const [processingInput, setProcessingInput] = useState(false);
  
  const generateAIResponse = useCallback(async (input: string) => {
    if (!input.trim()) return;
    
    setProcessingInput(true);
    
    try {
      // Simulate AI processing delay (1-2 seconds)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      // Generate simple response based on input
      let response = '';
      
      if (input.toLowerCase().includes('hello') || input.toLowerCase().includes('hi')) {
        response = "Hello! How are you feeling today?";
      } else if (input.toLowerCase().includes('how are you')) {
        response = "I'm here to listen and support you. What's on your mind?";
      } else if (input.toLowerCase().includes('sad') || input.toLowerCase().includes('upset')) {
        response = "I'm sorry to hear you're feeling down. Remember that your feelings are valid, and it's okay to take time for yourself.";
      } else if (input.toLowerCase().includes('happy') || input.toLowerCase().includes('great')) {
        response = "I'm glad to hear you're doing well! It's wonderful to acknowledge positive moments.";
      } else if (input.toLowerCase().includes('anxious') || input.toLowerCase().includes('worry')) {
        response = "Try taking a few deep breaths. Focus on the present moment and remember that you have overcome challenges before.";
      } else {
        response = "I'm here to listen and support you. Please tell me more about how you're feeling.";
      }
      
      setAiResponse(response);
      setShouldPlayVoice(true);
    } catch (error) {
      console.error('Error generating AI response:', error);
      setAiResponse("I'm sorry, I couldn't process that right now. Please try again later.");
    } finally {
      setProcessingInput(false);
    }
  }, []);
  
  return {
    aiResponse,
    shouldPlayVoice,
    processingInput,
    generateAIResponse,
    setAiResponse,
    setShouldPlayVoice
  };
}
