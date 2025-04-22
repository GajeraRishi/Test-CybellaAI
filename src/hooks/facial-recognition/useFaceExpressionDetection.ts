
import * as faceapi from 'face-api.js';
import { Emotion } from '@/components/EmotionDisplay';
import { processEmotions } from '@/utils/recognition/emotionProcessing';

/**
 * Processes face detections to determine the dominant emotion
 * with enhanced accuracy using facial landmarks and more efficient processing
 */
export async function detectFaceExpressions(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  showDetectionVisuals: boolean = true,
  isMobile: boolean = false
): Promise<{ emotion: Emotion; confidence: number } | null> {
  try {
    // Make sure we have video dimensions
    if (!video.videoWidth || !video.videoHeight) {
      console.log("Video dimensions not available");
      return null;
    }
    
    // Always make canvas visible when processing regardless of showDetectionVisuals setting
    canvas.style.display = 'block';
    canvas.style.opacity = showDetectionVisuals ? '1' : '0';
    
    // IMPROVED: Use full resolution on all devices for better accuracy
    const displaySize = { 
      width: video.videoWidth, 
      height: video.videoHeight
    };
    
    // Match canvas size to video
    faceapi.matchDimensions(canvas, displaySize);
    
    // IMPROVED: Higher resolution and lower threshold for better detection
    const detectionOptions = new faceapi.TinyFaceDetectorOptions({
      inputSize: isMobile ? 224 : 320, // Higher resolution for better accuracy
      scoreThreshold: 0.3 // Lower threshold to detect more faces and expressions
    });
    
    // Create a more robust detection with expressions and landmarks
    const detection = await faceapi
      .detectSingleFace(video, detectionOptions)
      .withFaceLandmarks()
      .withFaceExpressions();
    
    // Log detection results
    console.log("Face detection result:", detection ? "Face detected" : "No face detected");
    if (detection) {
      console.log("Expressions:", detection.expressions);
    }
    
    // Clear previous drawings
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (detection) {
      // Resize detections to match display size
      const resizedDetection = faceapi.resizeResults(detection, displaySize);
      
      // Always draw detection visuals to help with debugging
      // We'll control visibility through canvas opacity instead
      if (showDetectionVisuals) {
        try {
          // Draw landmarks and expressions with enhanced visibility
          faceapi.draw.drawDetections(canvas, [resizedDetection]);
          faceapi.draw.drawFaceLandmarks(canvas, [resizedDetection]);
          faceapi.draw.drawFaceExpressions(canvas, [resizedDetection], 0.01); // Lower threshold to show more expressions
          
          // Draw a highlighted box around the face for clarity
          if (ctx) {
            ctx.strokeStyle = '#FF5733'; // Brighter color for better visibility
            ctx.lineWidth = 4; // Thicker lines
            ctx.strokeRect(
              resizedDetection.detection.box.x,
              resizedDetection.detection.box.y,
              resizedDetection.detection.box.width,
              resizedDetection.detection.box.height
            );
          }
        } catch (drawError) {
          console.error("Error drawing detection:", drawError);
        }
      }
      
      // Process detected emotions with enhanced accuracy focus
      const emotions = processEmotions([detection]);
      console.log("Processed emotion result:", emotions);
      return emotions;
    } else {
      console.log("No faces detected in this frame");
      if (ctx && showDetectionVisuals) {
        ctx.fillStyle = 'red';
        ctx.font = '20px Arial';
        ctx.fillText('No face detected', 10, 50);
      }
      return null;
    }
  } catch (error) {
    console.error('Error in emotion detection:', error);
    return null;
  }
}
