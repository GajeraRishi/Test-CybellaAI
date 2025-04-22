
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VoiceInterface from '@/components/VoiceInterface';
import FacialRecognition from '@/components/FacialRecognition';
import EmotionDisplay, { Emotion } from '@/components/EmotionDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { toast } from '@/hooks/use-toast';

/**
 * Main index page component - cleansed of multi-language and detection visuals
 */
const Index = () => {
  const [sessionActive, setSessionActive] = useState<boolean>(false);
  const [faceEmotion, setFaceEmotion] = useState<Emotion | null>(null);
  const [voiceEmotion, setVoiceEmotion] = useState<Emotion | null>(null);
  const [hasNetworkIssue, setHasNetworkIssue] = useState<boolean>(false);
  const [sessionCount, setSessionCount] = useState<number>(0); // Track session count for resets
  const isMobile = useIsMobile();
  const { isOnline, connectionQuality } = useNetworkStatus();

  // Update network issue state
  useEffect(() => {
    setHasNetworkIssue(!isOnline || connectionQuality === 'poor');
  }, [isOnline, connectionQuality]);

  // Handle emotions
  const handleFaceEmotionDetected = (emotion: Emotion) => {
    setFaceEmotion(emotion);
  };

  const handleVoiceEmotionDetected = (emotion: Emotion) => {
    setVoiceEmotion(emotion);
  };

  const handleSessionStart = () => {
    if (!isOnline) {
      toast({
        title: "Cannot Start Session",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
      return;
    }
    if (connectionQuality === 'poor') {
      toast({
        title: "Network Quality Warning",
        description: "Your connection quality may affect the application performance.",
        variant: "warning",
      });
    }
    setSessionActive(true);
    setSessionCount(prevCount => prevCount + 1); // Increment session counter for clean restart
    toast({
      title: "Session Started",
      description: "Both voice and facial recognition are now active.",
    });
  };

  const handleSessionEnd = () => {
    setSessionActive(false);
    setFaceEmotion(null);
    setVoiceEmotion(null);
    toast({
      title: "Session Ended",
      description: "Voice and facial recognition have been stopped.",
    });
  };

  useEffect(() => {
    if (!isOnline && sessionActive) {
      toast({
        title: "Network Connection Lost",
        description: "Please check your internet connection. Some features may be limited.",
        variant: "destructive",
      });
    }
  }, [isOnline, sessionActive]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-soothing">
      <Header />
      <main className="flex-1 container py-4 px-3 mx-auto">
        <div className="space-y-4 max-w-[1200px] mx-auto">
          <Card className="border-none shadow-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur">
            <CardHeader className="p-4">
              <CardTitle className="text-xl md:text-2xl">Cybella AI</CardTitle>
              <CardDescription>
                AI-powered voice therapy for relaxation and emotional support. Speak naturally with Cybella, designed to help you relax and process your emotions.
              </CardDescription>
            </CardHeader>
          </Card>
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
            <VoiceInterface
              onVoiceEmotionDetected={handleVoiceEmotionDetected}
              onSessionStart={handleSessionStart}
              onSessionEnd={handleSessionEnd}
              isOnline={isOnline}
              sessionActive={sessionActive}
              key={`voice-${sessionCount}`} // Force component recreation on session change
            />
            <FacialRecognition
              onEmotionDetected={handleFaceEmotionDetected}
              isActive={sessionActive}
              connectionIssue={hasNetworkIssue}
              key={`face-${sessionCount}`} // Force component recreation on session change
            />
          </div>
          <EmotionDisplay
            faceEmotion={faceEmotion}
            voiceEmotion={voiceEmotion}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
