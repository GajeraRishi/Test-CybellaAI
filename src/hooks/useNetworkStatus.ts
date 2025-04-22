
import { useState, useEffect, useRef } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'poor'>('good');
  const [hasBuffering, setHasBuffering] = useState<boolean>(false);
  const [lastConnectionChange, setLastConnectionChange] = useState<Date>(new Date());
  const consecutiveIssuesRef = useRef<number>(0);
  const MIN_CONSECUTIVE_ISSUES = 2; // Require multiple failures before showing warnings
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastConnectionChange(new Date());
      consecutiveIssuesRef.current = 0;
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setLastConnectionChange(new Date());
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check connection quality by measuring response time
    const checkConnection = async () => {
      if (!navigator.onLine) {
        setIsOnline(false);
        return;
      }
      
      try {
        const startTime = Date.now();
        // Use a more reliable check - tiny request with cache busting
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // Longer timeout (8s)
        
        await fetch(`/favicon.ico?nocache=${Date.now()}`, { 
          method: 'HEAD',
          cache: 'no-store',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const responseTime = Date.now() - startTime;
        
        // More lenient thresholds to prevent false positives
        if (responseTime > 2500) { // Higher threshold (2.5s)
          consecutiveIssuesRef.current++; 
          
          // Only set poor connection if we have consecutive issues
          if (consecutiveIssuesRef.current >= MIN_CONSECUTIVE_ISSUES) {
            setConnectionQuality('poor');
            setHasBuffering(true);
          }
        } else {
          // Reset consecutive issues counter if response is good
          setConnectionQuality('good');
          setHasBuffering(false);
          consecutiveIssuesRef.current = 0;
        }
        
        setIsOnline(true);
      } catch (error) {
        // If fetch fails, only flag as issue if there are consecutive problems
        if (error instanceof DOMException && error.name === 'AbortError') {
          consecutiveIssuesRef.current++;
          
          if (consecutiveIssuesRef.current >= MIN_CONSECUTIVE_ISSUES) {
            setConnectionQuality('poor');
            setHasBuffering(true);
          }
        } else if (!navigator.onLine) {
          setIsOnline(false);
        }
      }
    };
    
    // Check connection less frequently (every 15 seconds)
    checkConnection();
    const interval = setInterval(checkConnection, 15000);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  // Add a convenience method to determine if there's an actual connection issue
  // that warrants displaying a warning to the user
  const hasSignificantConnectionIssue = !isOnline || 
    (connectionQuality === 'poor' && consecutiveIssuesRef.current >= MIN_CONSECUTIVE_ISSUES);

  return { 
    isOnline, 
    connectionQuality, 
    hasBuffering,
    lastConnectionChange,
    hasSignificantConnectionIssue
  };
}
