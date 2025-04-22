
# Cybella - AI Therapy Assistant

## Project Overview

Cybella is an AI-powered voice therapy assistant designed to provide emotional support through conversation. The application uses facial recognition and voice analysis to detect emotions and provide personalized support.

## Features

- 🎭 Real-time facial emotion recognition
- 🗣️ Voice interaction with transcription
- 🧠 AI responses to user input
- 📊 Combined emotion analysis display
- 📱 Responsive design for all devices

## Technical Components

### Core Components
- **VoiceInterface**: Handles speech recognition, transcription, and AI responses.
- **FacialRecognition**: Processes webcam feed to detect facial expressions.
- **EmotionDisplay**: Shows detected emotions from both voice and face.

### Emotion Detection
- Uses face-api.js for facial analysis (20+ facial points tracking)
- Simulates voice emotion detection (could be replaced with real API)

### Voice Processing
- Browser's SpeechRecognition API for voice-to-text
- SpeechSynthesis for text-to-speech responses

### UI/UX
- Responsive design adapts to all screen sizes
- Tailwind CSS for styling with shadcn/ui components
- Notification system for user feedback

## Running Locally

```bash
# Install dependencies
    npm install

# Install Vite (Optional)
    npm install vite

# Start the development server
    npm run dev
```

## Browser Support

Works best in Chrome, Edge, or Safari. Firefox has limited speech recognition support.

