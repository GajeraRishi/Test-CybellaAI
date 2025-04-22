
import React, { useRef, useState, useEffect } from 'react';
import FacialRecognitionCard from './facial-recognition/FacialRecognitionCard';
import { useFacialRecognition } from '@/hooks/useFacialRecognition';
import { EmotionProvider, useEmotion } from '@/contexts/EmotionContext';
import { loadFaceDetectionModels, getLoadedModelsStatus } from '@/utils/recognition';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Emotion } from '@/components/EmotionDisplay';

// Props: no detection visuals, no confidence
interface FacialRecognitionProps {
  onEmotionDetected?: (emotion: Emotion) => void;
  isActive: boolean;
  connectionIssue?: boolean;
}

const FacialRecognitionInner: React.FC<FacialRecognitionProps> = ({
  onEmotionDetected,
  isActive,
  connectionIssue = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { stableEmotion, setEmotionData } = useEmotion();
  const [cameraRequested, setCameraRequested] = useState(false); // camera only starts on session
  const { toast } = useToast();
  const [highAccuracyMode, setHighAccuracyMode] = useState(true);
  const toastShownRef = useRef(false);
  const lastActiveStateRef = useRef(isActive);
  const modelsLoadingRef = useRef(false);
  const isMobile = useIsMobile();
  const sessionIdRef = useRef<string>("");

  // Generate a new session ID when starting
  useEffect(() => {
    if (isActive && !lastActiveStateRef.current) {
      sessionIdRef.current = `session-${Date.now()}`;
      console.log("New face detection session ID:", sessionIdRef.current);
    }
    lastActiveStateRef.current = isActive;
  }, [isActive]);

  // Preload models (but don't request camera yet)
  useEffect(() => {
    if (modelsLoadingRef.current) return;
    modelsLoadingRef.current = true;
    loadFaceDetectionModels()
      .then(() => {
        if (!toastShownRef.current) {
          toast({
            title: "Facial Recognition Ready",
            description: isMobile ?
              "Emotion detection optimized for mobile device." :
              "Emotion detection is ready."
          });
          toastShownRef.current = true;
        }
      })
      .catch(() => {
        toast({
          title: "Detection Models Issue",
          description: "There was a problem loading emotion detection models. Please refresh the page.",
          variant: "destructive"
        });
      });
  }, [toast, isMobile]);

  // Set emotion ONLY, no confidence
  const handleEmotionDetected = (emotion: Emotion) => {
    setEmotionData(emotion, 0);
    if (onEmotionDetected) {
      onEmotionDetected(emotion);
    }
  };

  // Use custom hook (disable detection visuals, confidence, etc.)
  const { permission, error, modelsLoaded, connectionIssue: detectedConnectionIssue, requestCameraAccess } = useFacialRecognition({
    videoRef,
    canvasRef,
    isActive,
    cameraRequested,
    onEmotionDetected: (emotion) => handleEmotionDetected(emotion),
    sessionId: sessionIdRef.current
  });

  const handleRequestCameraAccess = () => {
    setCameraRequested(true);
    requestCameraAccess();
  };

  const hasConnectionIssue = connectionIssue || detectedConnectionIssue;

  // Camera sync with session only
  useEffect(() => {
    if (isActive && !permission && !cameraRequested) {
      setCameraRequested(true);
      setTimeout(() => {
        requestCameraAccess();
      }, 500);
    }
  }, [isActive, permission, cameraRequested, requestCameraAccess]);

  // Reset camera when session ends
  useEffect(() => {
    if (!isActive && lastActiveStateRef.current) {
      setCameraRequested(false);
    }
    lastActiveStateRef.current = isActive;
  }, [isActive]);

  return (
    <FacialRecognitionCard
      videoRef={videoRef}
      canvasRef={canvasRef}
      permission={permission}
      error={error}
      modelsLoaded={modelsLoaded}
      connectionIssue={hasConnectionIssue}
      isActive={isActive}
      emotion={stableEmotion}
      requestCameraAccess={handleRequestCameraAccess}
      cameraRequested={cameraRequested}
      highAccuracyMode={highAccuracyMode}
      mirrored={true}
    />
  );
};

const FacialRecognition: React.FC<FacialRecognitionProps> = (props) => {
  return (
    <EmotionProvider>
      <FacialRecognitionInner {...props} />
    </EmotionProvider>
  );
};

export default FacialRecognition;
