
import * as faceapi from 'face-api.js';
import { Emotion } from '@/components/EmotionDisplay';
import { getEmotionMapping, adjustEmotionScore } from '@/utils/recognition/emotionMapping';
import { analyzeFacialLandmarks, analyzeAdvancedEmotions } from '@/utils/recognition/facial-landmarks';

/**
 * Processes the detected facial expressions to determine the most likely emotion
 * Using improved analysis techniques with better accuracy
 */
export function processEmotions(
  detections: faceapi.WithFaceLandmarks<
    { detection: faceapi.FaceDetection; expressions: faceapi.FaceExpressions },
    faceapi.FaceLandmarks68
  >[]
): { emotion: Emotion; confidence: number } | null {
  if (!detections || detections.length === 0) {
    return null;
  }

  // Enhanced emotion mapping with better categorization
  const emotionMapping = getEmotionMapping();
  
  // Process emotions from all detected faces and find the most confident one
  let bestEmotion: Emotion = 'neutral';
  let highestScore = 0.3; // Higher threshold for more accurate initial detection
  
  for (const detection of detections) {
    // Check if expressions exist in the detection
    if (!detection.expressions) {
      console.log("No expressions detected in this face");
      continue;
    }

    const expressions = detection.expressions;
    
    // Apply confidence threshold and normalization
    const emotionScores: Record<string, number> = {};
    let totalScore = 0;
    
    // First pass - collect all emotion scores with proper threshold
    for (const [emotion, score] of Object.entries(expressions)) {
      if (score > 0.08) { // Higher threshold for initial consideration
        emotionScores[emotion] = score;
        totalScore += score;
      }
    }
    
    if (totalScore === 0) continue;
    
    // Special case for contempt and anger differentiation
    const contemptScore = emotionScores['contemptuous'] || 0;
    const angerScore = emotionScores['angry'] || 0;
    
    if (contemptScore > 0.15 && angerScore > 0.15) {
      // If both contempt and anger are detected, use facial landmarks
      try {
        const mouthAnalysis = require('@/utils/recognition/facial-landmarks/mouthAnalysis')
          .mouthAnalysis(detection.landmarks.positions, detection.detection.box);
        
        // Asymmetry is the key differentiator for contempt
        if (mouthAnalysis && mouthAnalysis.mouthAsymmetry > 0.02) {
          emotionScores['contemptuous'] = contemptScore * 1.8;
        } else {
          emotionScores['angry'] = angerScore * 1.6;
        }
        
        // Recalculate total score
        totalScore = Object.values(emotionScores).reduce((sum, score) => sum + score, 0);
      } catch (error) {
        console.error("Error in contempt/anger disambiguation:", error);
      }
    }
    
    // Second pass - normalize scores with improved adjustments
    for (const [emotion, score] of Object.entries(emotionScores)) {
      // Better normalize score with emphasis on dominant emotions
      const normalizedScore = score / totalScore;
      
      // Apply stronger boosting for clear emotional signals
      let adjustedScore = adjustEmotionScore(emotion, normalizedScore) * 1.7;
      
      // Apply improved facial landmarks analysis
      try {
        const landmarkModifier = analyzeFacialLandmarks(detection, emotion);
        adjustedScore *= landmarkModifier * 1.3;
        
        // Higher boost for primary emotions
        if (['happy', 'sad', 'angry', 'disgusted', 'surprised'].includes(emotion)) {
          adjustedScore *= 1.5;
        }
      } catch (error) {
        console.error("Error in landmark analysis:", error);
      }
      
      if (adjustedScore > highestScore) {
        highestScore = adjustedScore;
        
        // Map to standard emotion
        if (emotion in emotionMapping) {
          bestEmotion = emotionMapping[emotion as keyof typeof emotionMapping];
        } else {
          bestEmotion = 'neutral';
        }
        
        // Apply advanced emotion analysis
        try {
          const advancedAnalysis = analyzeAdvancedEmotions(detection, emotion, adjustedScore);
          
          // Better threshold for complex emotions
          if (advancedAnalysis.emotion !== emotion as Emotion && 
              advancedAnalysis.adjustedScore > adjustedScore * 1.2) {
            bestEmotion = advancedAnalysis.emotion;
            highestScore = advancedAnalysis.adjustedScore;
          }
        } catch (error) {
          console.error("Error in advanced emotion analysis:", error);
        }
      }
    }
    
    // Enhanced confused detection with improved facial feature analysis
    const surprisedScore = emotionScores['surprised'] || 0;
    const neutralScore = emotionScores['neutral'] || 0;
    const fearfulScore = emotionScores['fearful'] || 0;
    
    // Better thresholds for confusion detection
    if (surprisedScore > 0.18 && neutralScore > 0.2 && fearfulScore > 0.12) {
      try {
        // Check specific eyebrow features that indicate confusion
        const eyebrowFeatures = require('@/utils/recognition/facial-landmarks/eyebrowAnalysis')
          .eyebrowAnalysis(detection.landmarks.positions, detection.detection.box);
        
        // Confusion often shows asymmetrical eyebrows and slight head tilt
        if (eyebrowFeatures.browAsymmetry > 0.04) {
          const confusedScore = (surprisedScore * 0.5 + neutralScore * 0.3 + fearfulScore * 0.2) * 2.5;
          if (confusedScore > highestScore) {
            bestEmotion = 'confused';
            highestScore = confusedScore;
          }
        }
      } catch (error) {
        console.error("Error analyzing eyebrows for confusion:", error);
        
        // Fallback confusion detection
        const confusedScore = (surprisedScore * 0.4 + neutralScore * 0.3 + fearfulScore * 0.3) * 2.0;
        if (confusedScore > highestScore) {
          bestEmotion = 'confused';
          highestScore = confusedScore;
        }
      }
    }
    
    // Improved stressed detection
    const angryScore = emotionScores['angry'] || 0;
    const sadScore = emotionScores['sad'] || 0;
    
    if (angryScore > 0.15 && fearfulScore > 0.15 && sadScore > 0.1) {
      // Stress shows in facial tension patterns
      try {
        const mouthFeatures = require('@/utils/recognition/facial-landmarks/mouthAnalysis')
          .mouthAnalysis(detection.landmarks.positions, detection.detection.box);
        
        // Check for jaw tension - key indicator of stress
        if (mouthFeatures && mouthFeatures.jawTension < 0.035) {
          const stressedScore = (angryScore * 0.5 + fearfulScore * 0.3 + sadScore * 0.2) * 2.2;
          if (stressedScore > highestScore) {
            bestEmotion = 'stressed';
            highestScore = stressedScore;
          }
        }
      } catch (error) {
        console.error("Error in mouth analysis for stress:", error);
        
        // Fallback stress detection
        const stressedScore = (angryScore * 0.4 + fearfulScore * 0.3 + sadScore * 0.3) * 2.0;
        if (stressedScore > highestScore) {
          bestEmotion = 'stressed';
          highestScore = stressedScore;
        }
      }
    }
    
    // More accurate anxious detection
    try {
      // Try to analyze eye features for anxiety
      const eyeFeatures = require('@/utils/recognition/facial-landmarks/eyeAnalysis')
        .eyeAnalysis(detection.landmarks.positions, detection.detection.box);
      
      // Anxiety shows in eye behavior and eye openness
      if (eyeFeatures && eyeFeatures.eyeOpenness > 0.07 && 
          (eyeFeatures.leftEyeDeviation > 0.1 || eyeFeatures.rightEyeDeviation > 0.1)) {
        
        // Consider both fear and surprise components for anxiety
        const baseAnxiousScore = ((fearfulScore || 0) * 0.7 + (surprisedScore || 0) * 0.3) * 3.0;
        
        if (baseAnxiousScore > highestScore) {
          bestEmotion = 'anxious';
          highestScore = baseAnxiousScore;
        }
      }
      // Alternative anxiety detection based on eye and mouth features
      else if (fearfulScore > 0.18) {
        const mouthFeatures = require('@/utils/recognition/facial-landmarks/mouthAnalysis')
          .mouthAnalysis(detection.landmarks.positions, detection.detection.box);
        
        // Anxiety can manifest with tension in mouth area
        if (mouthFeatures && mouthFeatures.mouthTension > 0.02) {
          const anxiousScore = fearfulScore * 2.8;
          if (anxiousScore > highestScore) {
            bestEmotion = 'anxious';
            highestScore = anxiousScore;
          }
        }
      }
    } catch (error) {
      console.error("Error in eye/mouth analysis for anxiety:", error);
      
      // Fallback anxiety detection
      if (fearfulScore > 0.2 || (fearfulScore > 0.15 && surprisedScore > 0.15)) {
        const anxiousScore = (fearfulScore * 0.7 + (surprisedScore || 0) * 0.3) * 2.2;
        if (anxiousScore > highestScore) {
          bestEmotion = 'anxious';
          highestScore = anxiousScore;
        }
      }
    }
  }
  
  // Ensure better confidence scoring
  return { 
    emotion: bestEmotion, 
    confidence: Math.min(0.98, highestScore * 1.5) 
  };
}
