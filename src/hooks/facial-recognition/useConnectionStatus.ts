
import { useState, useEffect, useCallback, useRef } from 'react';

interface ConnectionStatusOptions {
  externalConnectionIssue?: boolean;
  checkConnectionQuality?: boolean;
  pollingInterval?: number;
}

export function useConnectionStatus(options: ConnectionStatusOptions = {}) {
  const { 
    externalConnectionIssue,
    checkConnectionQuality: shouldCheckConnectionQuality = true,
    pollingInterval = 15000 // Increased polling interval (15s)
  } = options;
  
  const [connectionIssue, setConnectionIssue] = useState<boolean>(false);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'poor'>('good');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const consecutiveFailuresRef = useRef<number>(0);
  const MIN_CONSECUTIVE_FAILURES = 2; // Require multiple failures
  
  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      consecutiveFailuresRef.current = 0;
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Check connection quality by measuring response time
  const checkConnectionQuality = useCallback(async () => {
    if (!navigator.onLine) {
      setIsOnline(false);
      setConnectionQuality('poor');
      return;
    }
    
    try {
      const startTime = Date.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // Increased timeout (8s)
      
      await fetch(`/favicon.ico?nocache=${Date.now()}`, { 
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      
      // More generous threshold to prevent false positives
      if (responseTime > 3000) { // 3s threshold instead of 1.5s
        consecutiveFailuresRef.current++;
        if (consecutiveFailuresRef.current >= MIN_CONSECUTIVE_FAILURES) {
          setConnectionQuality('poor');
        }
      } else {
        setConnectionQuality('good');
        consecutiveFailuresRef.current = 0;
      }
    } catch (error) {
      // Only set to poor if it's multiple consecutive errors
      if (error.name !== 'AbortError') {
        consecutiveFailuresRef.current++;
        if (consecutiveFailuresRef.current >= MIN_CONSECUTIVE_FAILURES) {
          setConnectionQuality('poor');
        }
      }
    }
  }, []);
  
  // Periodically check connection quality if enabled
  useEffect(() => {
    if (!shouldCheckConnectionQuality) return;
    
    checkConnectionQuality();
    const interval = setInterval(() => {
      checkConnectionQuality();
    }, pollingInterval);
    
    return () => clearInterval(interval);
  }, [shouldCheckConnectionQuality, pollingInterval, checkConnectionQuality]);
  
  // Calculate overall connection issue state
  useEffect(() => {
    // Only consider it an issue if there's a persistent problem
    const hasIssue = (!isOnline || 
                     (connectionQuality === 'poor' && consecutiveFailuresRef.current >= MIN_CONSECUTIVE_FAILURES) || 
                     !!externalConnectionIssue);
    
    // Add a larger delay before setting connection issue to prevent flickering
    const timer = setTimeout(() => {
      setConnectionIssue(hasIssue);
    }, 2000); // 2s delay
    
    return () => clearTimeout(timer);
  }, [isOnline, connectionQuality, externalConnectionIssue]);
  
  return { 
    connectionIssue, 
    isOnline, 
    connectionQuality
  };
}
