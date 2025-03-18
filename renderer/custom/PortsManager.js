import { useEffect, useState } from 'react';

export default function PortsManager({ wsClient }) {
  const [ports, setPorts] = useState([]);
  const [selectedPort, setSelectedPort] = useState('none');
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    if (!wsClient) return;
    
    wsClient.onMessage((data) => {
      if (data?.type === 'private-message' && data?.title === 'available_ports') {
        const portOptions = data.message.ports.map(port => ({
          value: port.device,
          label: port.description.includes("USB") 
            ? `${port.device} (${port.description})` 
            : port.device
        }));
        setPorts(portOptions);
      }
      
      if (data?.type === 'private-message' && data?.title === 'serial_response') {
        setIsConnected(data.message.connected);
      }
    });
  }, [wsClient]);
  
  const handlePortFocus = () => {
    if (wsClient) {
      wsClient.sendPrivateMessage(
        "py-executive-client", 
        {title: "ports_request", content: "ports_request"}
      );
    }
  };
  
  const handlePortChange = (e) => {
    setSelectedPort(e.target.value);
    if (wsClient) {
      wsClient.sendPrivateMessage(
        "py-executive-client", 
        {title: "connect_port", content: {port: e.target.value}}
      );
    }
  };
  
  return {
    ports,
    selectedPort,
    isConnected,
    handlePortFocus,
    handlePortChange
  };
}