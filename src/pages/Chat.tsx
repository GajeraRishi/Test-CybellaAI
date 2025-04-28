import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VoiceInterface from '@/components/VoiceInterface';
import FacialRecognition from '@/components/FacialRecognition';
import EmotionDisplay, { Emotion } from '@/components/EmotionDisplay';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const Chat = () => {
  const [faceEmotion, setFaceEmotion] = React.useState<Emotion | null>(null);
  const [voiceEmotion, setVoiceEmotion] = React.useState<Emotion | null>(null);
  const [sessionActive, setSessionActive] = React.useState<boolean>(false);
  const [sessionCount, setSessionCount] = React.useState<number>(0);
  const isMobile = useIsMobile();
  const { isOnline, connectionQuality } = useNetworkStatus();

  const handleFaceEmotionDetected = (emotion: Emotion) => {
    setFaceEmotion(emotion);
  };

  const handleVoiceEmotionDetected = (emotion: Emotion) => {
    setVoiceEmotion(emotion);
  };

  const toggleSession = () => {
    setSessionActive(prev => !prev);
    if (!sessionActive) {
      setSessionCount(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1E90FF] to-[#87CEEB]">
      <Header />
      <main className="flex-1 container py-8 px-3 mx-auto mt-32">
        <div className="space-y-8 max-w-[1200px] mx-auto">
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-8`}>
            <div className="space-y-6">
              <VoiceInterface
                onVoiceEmotionDetected={handleVoiceEmotionDetected}
                onSessionStart={toggleSession}
                onSessionEnd={() => setSessionActive(false)}
                isOnline={isOnline}
                sessionActive={sessionActive}
                key={`voice-${sessionCount}`}
              />
              {!isMobile && <EmotionDisplay
                faceEmotion={faceEmotion}
                voiceEmotion={voiceEmotion}
              />}
            </div>
            <div className="space-y-6">
              <FacialRecognition
                onEmotionDetected={handleFaceEmotionDetected}
                isActive={sessionActive}
                connectionIssue={!isOnline || connectionQuality === 'poor'}
                key={`face-${sessionCount}`}
              />
              {isMobile && <EmotionDisplay
                faceEmotion={faceEmotion}
                voiceEmotion={voiceEmotion}
              />}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;