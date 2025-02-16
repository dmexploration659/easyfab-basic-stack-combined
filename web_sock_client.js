class WebSocketClient {
    constructor(wsAddress, name) {
        this.wsAddress = wsAddress;
        this.name = name;
        this.ws = null;
        this.onMessageCallback = null;
        this.onCloseCallback = null;
    }

    connect() {
        this.ws = new WebSocket(this.wsAddress);

        this.ws.onopen = () => {
            console.log('Connected to the WebSocket server');
            this.register();
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Message from server:', data);

            if (this.onMessageCallback) {
                this.onMessageCallback(data);
            }
        };

        this.ws.onclose = () => {
            console.log('Disconnected from the WebSocket server');
            if (this.onCloseCallback) {
                this.onCloseCallback();
            }
        };
    }

    register() {
        if (!this.name) {
            console.error('Name is required for registration.');
            return;
        }

        this.ws.send(JSON.stringify({
            type: 'register',
            name: this.name,
        }));
    }

    sendPrivateMessage(targetClientName, message) {
        console.log(`request of sending>>>> ${targetClientName} ${message}`);
        if (!targetClientName || !message) {
            console.error('Recipient name and message are required.');
            return;
        }

        this.ws.send(JSON.stringify({
            type: 'private-message',
            from: this.name,
            to: targetClientName,
            title: message.title,
            message: message.content,
        }));
        console.log(`sent ${targetClientName} ${message} the name was ${this.name}`);
    }
    testInteraction(message){
        console.log(`request of testing interaction ${message} `);
    }


    onMessage(callback) {
        this.onMessageCallback = callback;
    }

    onClose(callback) {
        this.onCloseCallback = callback;
    }

    close() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

export default WebSocketClient;