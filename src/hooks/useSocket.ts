import { useCallback, useEffect, useState, useRef } from 'react';
import socketService from '../services/socket.service';

export const useSocket = ({ autoConnect = false } = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  
  // Use ref to track if we've already set up listeners to prevent duplicates
  const listenersSetup = useRef(false);

  // Memoize the on function to prevent useEffect dependencies from changing
  // This is crucial - the function reference should never change
  const on = useCallback((event: string, callback: Function) => {
    return socketService.on(event, callback);
  }, []);

  // Memoize other socket functions
  const connect = useCallback(() => {
    socketService.connect();
  }, []);

  const joinMatch = useCallback((matchId: string) => {
    socketService.joinMatch(matchId);
  }, []);

  const leaveMatch = useCallback((matchId: string) => {
    socketService.leaveMatch(matchId);
  }, []);

  const sendMessage = useCallback((matchId: string, content: string, media?: any) => {
    socketService.sendMessage(matchId, content, media);
  }, []);

  const sendTyping = useCallback((matchId: string, isTyping: boolean) => {
    socketService.sendTyping(matchId, isTyping);
  }, []);

  const markAsRead = useCallback((matchId: string) => {
    socketService.markAsRead(matchId);
  }, []);

  // Setup connection listeners only once
  useEffect(() => {
    if (listenersSetup.current) return;

    const handleConnect = () => {
      console.log('Socket connected');
      setIsConnected(true);
    };
    
    const handleDisconnect = (reason: string) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    };

    const connectUnsubscribe = socketService.on('connect', handleConnect);
    const disconnectUnsubscribe = socketService.on('disconnect', handleDisconnect);

    listenersSetup.current = true;

    // Auto-connect if requested
    if (autoConnect) {
      socketService.connect();
    }

    // Set initial connection state
    setIsConnected(socketService.isConnected());

    return () => {
      connectUnsubscribe();
      disconnectUnsubscribe();
      listenersSetup.current = false;
    };
  }, [autoConnect]);

  return {
    isConnected,
    connect,
    joinMatch,
    leaveMatch,
    sendMessage,
    sendTyping,
    markAsRead,
    on, // This is now properly memoized and will never change reference
  };
};