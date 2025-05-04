import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import SessionControls from './voice-interface/SessionControls';
import UserTranscription from './voice-interface/UserTranscription';
import AIResponseDisplay from './voice-interface/AIResponseDisplay';
import VoiceControls from './voice-interface/VoiceControls';
import { useVoiceProcessing } from '@/hooks/useVoiceProcessing';
import { useVoiceSession } from '@/hooks/voice/useVoiceSession';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useConnectionStatus } from '@/hooks/facial-recognition/useConnectionStatus';
import { Emotion } from '@/components/EmotionDisplay';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Voice Interface Component (no translations, no multi-language)
 */
interface VoiceInterfaceProps {
  onVoiceEmotionDetected?: (emotion: Emotion, confidence: number) => void;
  onSessionStart?: () => void;
  onSessionEnd?: () => void;
  isOnline?: boolean;
  sessionActive?: boolean;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  onVoiceEmotionDetected,
  onSessionStart,
  onSessionEnd,
  isOnline = true,
  sessionActive: externalSessionActive
}) => {
  const isMobile = useIsMobile();
  const { connectionQuality } = useNetworkStatus();
  const { connectionIssue } = useConnectionStatus({
    externalConnectionIssue: !isOnline || connectionQuality === 'poor'
  });

  const { isAuthenticated, user } = useAuth(); // User auth data

  // Use the external session state if provided, otherwise use internal state
  const isControlledComponent = externalSessionActive !== undefined;

  const session = useVoiceSession({
    onSessionStart,
    onSessionEnd
  });

  // Determine the actual session state
  const actualSessionActive = isControlledComponent ? externalSessionActive : session.sessionActive;

  const voice = useVoiceProcessing({
    sessionActive: actualSessionActive,
    onVoiceEmotionDetected
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // End session on network issues
  useEffect(() => {
    if (!isOnline && session.sessionActive && !isControlledComponent) {
      session.endSession();
    }
  }, [isOnline, session, isControlledComponent]);

  // Initialize AI response when session starts
  useEffect(() => {
    if (actualSessionActive) {
      const nameOrEmail = user?.name || user?.email || "there";
      voice.setAiResponse(`Hi ${nameOrEmail}! I'm Cybella. How are you feeling today? I'm here to chat and support you through whatever's on your mind.`);
      voice.setShouldPlayVoice(true);
    } else {
      voice.setAiResponse("");
      if (voice.setTranscription) {
        voice.setTranscription("");
      }
      if (voice.setInterimTranscript) {
        voice.setInterimTranscript("");
      }
      voice.setShouldPlayVoice(false);
      if (voice.isListening && voice.stopListening) {
        voice.stopListening();
      }
    }
  }, [actualSessionActive, voice, user]);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [voice.aiResponse, voice.transcription]);

  // Adjusted height for better mobile experience
  const contentHeight = isMobile ? "h-[220px]" : "h-[300px]";

  return (
    <Card className="p-2 md:p-4">
      <SessionControls
        sessionActive={actualSessionActive}
        toggleSession={isControlledComponent ? onSessionStart || (() => {}) : session.toggleSession}
        disabled={!isOnline}
        isOnline={isOnline}
      />

      <div className={`overflow-y-auto ${contentHeight} pr-1 md:pr-2`}>
        <div className="space-y-3 md:space-y-4">
          <AIResponseDisplay
            processingInput={voice.processingInput}
            aiResponse={voice.aiResponse}
            shouldPlayVoice={voice.shouldPlayVoice}
            sessionActive={actualSessionActive}
          />

          <UserTranscription
            transcription={voice.transcription}
            interimTranscript={voice.interimTranscript}
            isListening={voice.isListening}
            sessionActive={actualSessionActive}
          />
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="mt-2 pt-2 md:mt-3 md:pt-3 border-t">
        <VoiceControls
          isListening={voice.isListening}
          audioData={voice.audioData}
          sessionActive={actualSessionActive}
          processingInput={voice.processingInput}
          toggleListening={voice.toggleListening}
          connectionIssue={connectionIssue}
        />
      </div>
    </Card>
  );
};

export default VoiceInterface;
