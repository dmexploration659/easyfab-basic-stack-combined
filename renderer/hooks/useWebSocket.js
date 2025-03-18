import { useState, useEffect, useRef } from 'react';
import WebSocketClient from '../utils/websocket';

export default function useWebSocket(url, clientId) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const wsClientRef = useRef(null);
  
  useEffect(() => {
    wsClientRef.current = new WebSocketClient(url, clientId);
    wsClientRef.current.connect();
    
    wsClientRef.current.onMessage((data) => {
      setMessages(prev => [...prev, data]);
      
      if (data?.type === 'private-message' && data?.title === 'serial_response') {
        setIsConnected(data.message.connected);
      }
    });
    
    return () => {
      if (wsClientRef.current) {
        wsClientRef.current.disconnect();
      }
    };
  }, [url, clientId]);
  
  const sendMessage = (recipient, message) => {
    if (wsClientRef.current) {
      wsClientRef.current.sendPrivateMessage(recipient, message);
    }
  };
  
  return {
    isConnected,
    messages,
    sendMessage,
    wsClient: wsClientRef.current
  };
}
