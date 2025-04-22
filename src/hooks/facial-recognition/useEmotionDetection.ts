import { useRef, RefObject, useCallback } from 'react';
import { Emotion } from '@/components/EmotionDisplay';
import { detectFaceExpressions } from './useFaceExpressionDetection';
import { useIsMobile } from '@/hooks/use-mobile';

interface UseEmotionDetectionProps {
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  showDetectionVisuals?: boolean;
}

export function useEmotionDetection({
  videoRef,
  canvasRef,
  showDetectionVisuals = true,
}: UseEmotionDetectionProps) {
  const isMobile = useIsMobile();
  
  // Process frames frequently but only consider detected emotions valid for 5 seconds
  const lastProcessTimeRef = useRef<number>(0);
  // Keep processing interval relatively short for camera stability
  // but use emotion history with 5-second window for final output
  const PROCESS_INTERVAL_MS = isMobile ? 400 : 300; // Shorter intervals for camera stability
  
  // Flag to prevent concurrent detection runs
  const isProcessingRef = useRef<boolean>(false);

  const detectEmotion = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isProcessingRef.current) return null;
    
    // Check if video is playing and has dimensions
    if (videoRef.current.paused || videoRef.current.ended || 
        videoRef.current.readyState < 2) {
      console.log("Video not ready for emotion detection", videoRef.current.readyState);
      return null;
    }
    
    // Set processing flag to prevent concurrent runs
    isProcessingRef.current = true;
    
    try {
      console.log("Attempting emotion detection...");
      const result = await detectFaceExpressions(
        videoRef.current, 
        canvasRef.current, 
        showDetectionVisuals,
        isMobile
      );
      
      isProcessingRef.current = false;
      
      if (result) {
        console.log(`Emotion detected: ${result.emotion} (${result.confidence.toFixed(2)}) at ${new Date().toISOString()}`);
        return result;
      } else {
        console.log("No emotion detected in this frame");
        return null;
      }
    } catch (error) {
      console.error('Error in emotion detection:', error);
      isProcessingRef.current = false;
      return null;
    }
  }, [videoRef, canvasRef, showDetectionVisuals, isMobile]);

  return {
    detectEmotion,
    lastProcessTimeRef,
    PROCESS_INTERVAL_MS
  };
}
