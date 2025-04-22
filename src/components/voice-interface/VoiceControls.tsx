
import React from 'react';
import { Mic, MicOff, Send, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AudioVisualizer from '../AudioVisualizer';

interface VoiceControlsProps {
  isListening: boolean;
  audioData: Uint8Array | null;
  sessionActive: boolean;
  processingInput: boolean;
  connectionIssue?: boolean;
  toggleListening: () => void;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  isListening,
  audioData,
  sessionActive,
  processingInput,
  connectionIssue = false,
  toggleListening
}) => {
  return (
    <div className="flex items-center">
      <div className="flex-1">
        {isListening && audioData && (
          <AudioVisualizer isListening={isListening} audioData={audioData} />
        )}
        
        {connectionIssue && (
          <div className="flex items-center text-amber-500 mb-1">
            <WifiOff className="inline mr-1" size={12} />
            <p className="text-xs">
              Network connection issues detected. Voice recognition quality may be affected.
            </p>
          </div>
        )}
      </div>
      
      <Button 
        variant="default" 
        size="icon" 
        className={`w-12 h-12 rounded-full shadow-md ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`} 
        disabled={!sessionActive || processingInput || connectionIssue}
        onClick={toggleListening}
        aria-label={isListening ? "Stop listening" : "Start listening"}
      >
        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
      </Button>
    </div>
  );
};

export default VoiceControls;
