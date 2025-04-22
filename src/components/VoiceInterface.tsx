
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

/**
 * Voice Interface Component (no translations, no multi-language)
 */
interface VoiceInterfaceProps {
  onVoiceEmotionDetected?: (emotion: string) => void;
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
  sessionActive
}) => {
  const isMobile = useIsMobile();
  const { connectionQuality } = useNetworkStatus();
  const { connectionIssue } = useConnectionStatus({
    externalConnectionIssue: !isOnline || connectionQuality === 'poor'
  });

  const session = useVoiceSession({
    onSessionStart,
    onSessionEnd
  });

  const voice = useVoiceProcessing({
    sessionActive: typeof sessionActive === "boolean" ? sessionActive : session.sessionActive,
    onVoiceEmotionDetected
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isOnline && session.sessionActive) {
      session.endSession();
    }
  }, [isOnline, session]);

  useEffect(() => {
    // Only in English now
    if (session.sessionActive) {
      voice.setAiResponse("Hi there! I'm Cybella. How are you feeling today? I'm here to chat and support you through whatever's on your mind.");
      voice.setShouldPlayVoice(true);
    }
  }, [session.sessionActive]);

  useEffect(() => {
    scrollToBottom();
  }, [voice.aiResponse, voice.transcription]);

  const contentHeight = isMobile ? "h-[250px]" : "h-[300px]";

  return (
    <Card className="p-3 md:p-4">
      <SessionControls
        sessionActive={typeof sessionActive === "boolean" ? sessionActive : session.sessionActive}
        toggleSession={session.toggleSession}
        disabled={!isOnline}
        isOnline={isOnline}
      />

      <div className={`overflow-y-auto ${contentHeight} pr-2`}>
        <div className="space-y-4">
          <AIResponseDisplay
            processingInput={voice.processingInput}
            aiResponse={voice.aiResponse}
            shouldPlayVoice={voice.shouldPlayVoice}
            sessionActive={typeof sessionActive === "boolean" ? sessionActive : session.sessionActive}
          />

          <UserTranscription
            transcription={voice.transcription}
            interimTranscript={voice.interimTranscript}
            isListening={voice.isListening}
            sessionActive={typeof sessionActive === "boolean" ? sessionActive : session.sessionActive}
          />
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t">
        <VoiceControls
          isListening={voice.isListening}
          audioData={voice.audioData}
          sessionActive={typeof sessionActive === "boolean" ? sessionActive : session.sessionActive}
          processingInput={voice.processingInput}
          toggleListening={voice.toggleListening}
          connectionIssue={connectionIssue}
        />
      </div>
    </Card>
  );
};

export default VoiceInterface;
