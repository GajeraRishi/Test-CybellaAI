
// import React from 'react';
// import { Mic, MicOff, Send, WifiOff } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import AudioVisualizer from '../AudioVisualizer';

// interface VoiceControlsProps {
//   isListening: boolean;
//   audioData: Uint8Array | null;
//   sessionActive: boolean;
//   processingInput: boolean;
//   connectionIssue?: boolean;
//   toggleListening: () => void;
// }

// const VoiceControls: React.FC<VoiceControlsProps> = ({
//   isListening,
//   audioData,
//   sessionActive,
//   processingInput,
//   connectionIssue = false,
//   toggleListening
// }) => {
//   return (
//     <div className="flex items-center">
//       <div className="flex-1">
//         {isListening && audioData && (
//           <AudioVisualizer isListening={isListening} audioData={audioData} />
//         )}
        
//         {connectionIssue && (
//           <div className="flex items-center text-amber-500 mb-1">
//             <WifiOff className="inline mr-1" size={12} />
//             <p className="text-xs">
//               Network connection issues detected. Voice recognition quality may be affected.
//             </p>
//           </div>
//         )}
//       </div>
      
//       <Button 
//         variant="default" 
//         size="icon" 
//         className={`w-12 h-12 rounded-full shadow-md ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`} 
//         disabled={!sessionActive || processingInput || connectionIssue}
//         onClick={toggleListening}
//         aria-label={isListening ? "Stop listening" : "Start listening"}
//       >
//         {isListening ? <MicOff size={20} /> : <Mic size={20} />}
//       </Button>
//     </div>
//   );
// };

// export default VoiceControls;


import React from 'react';
import { Mic, MicOff, WifiOff, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AudioVisualizer from '../AudioVisualizer';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center">
      <div className="flex-1">
        {isListening && audioData && (
          <AudioVisualizer isListening={isListening} audioData={audioData} />
        )}
        
        {connectionIssue && (
          <div className="flex items-center text-amber-500 mb-1">
            <WifiOff className="inline mr-1" size={isMobile ? 10 : 12} />
            <p className="text-2xs md:text-xs">
              Network connection issues detected
            </p>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 md:w-8 md:h-8 rounded-full"
                aria-label="Voice detection information"
              >
                <Info size={isMobile ? 12 : 16} className="text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[250px] text-xs">
              <p>Too smooth or noisy voice recordings may affect emotion detection accuracy or produce incorrect results.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button 
          variant="default" 
          size="icon" 
          className={`w-8 h-8 md:w-12 md:h-12 rounded-full shadow-md ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`} 
          disabled={!sessionActive || processingInput || connectionIssue}
          onClick={toggleListening}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? 
            <MicOff size={isMobile ? 14 : 20} /> : 
            <Mic size={isMobile ? 14 : 20} />
          }
        </Button>
      </div>
    </div>
  );
};

export default VoiceControls;