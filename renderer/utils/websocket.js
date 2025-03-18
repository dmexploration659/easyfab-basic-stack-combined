class WebSocketClient {
    constructor(url, clientId) {
      this.url = url;
      this.clientId = clientId;
      this.socket = null;
      this.messageHandlers = [];
    }
  
    connect() {
      this.socket = new WebSocket(this.url);
      
      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.socket.send(JSON.stringify({ type: 'register', clientId: this.clientId }));
      };
      
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.messageHandlers.forEach(handler => handler(data));
      };
      
      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
        // Reconnect logic can be added here
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }
    
    sendPrivateMessage(recipient, message) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
          type: 'private-message',
          recipient,
          sender: this.clientId,
          message
        }));
      } else {
        console.error('WebSocket is not open');
      }
    }
    
    onMessage(handler) {
      this.messageHandlers.push(handler);
    }
    
    disconnect() {
      if (this.socket) {
        this.socket.close();
      }
    }
  }
  
  export default WebSocketClient;