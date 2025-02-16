import WebSocketClient from '../web_sock_client.js';

// Initialize the WebSocket client
const wsAddress = 'ws://localhost:8080';
const clientName = 'ws_test';
const wsClient = new WebSocketClient(wsAddress, clientName);

// Connect to the WebSocket server
wsClient.connect();

// Handle incoming messages
wsClient.onMessage((data) => {
    if (data.type === 'register-response') {
        if (data.success) {
            appendMessage(data.message);
        } else {
            alert(data.message);
        }
    } else if (data.type === 'private-message') {
        appendMessage(`Private message from ${data.from}: ${data.message}`);
    } else if (data.type === 'user-joined') {
        appendMessage(`User "${data.name}" has joined the chat.`);
    } else if (data.type === 'user-left') {
        appendMessage(`User "${data.name}" has left the chat.`);
    }
});

// Handle connection close
wsClient.onClose(() => {
    appendMessage('Disconnected from the server.');
});

// Function to send a private message
function sendPrivateMessage() {
    const targetClientName = document.getElementById('targetClientName').value.trim();
    const message = document.getElementById('messageInput').value.trim();

    if (!targetClientName || !message) {
        alert('Please enter a recipient name and a message.');
        return;
    }

    wsClient.sendPrivateMessage(targetClientName, message);
    appendMessage(`You to ${targetClientName}: ${message}`);
    document.getElementById('messageInput').value = '';
}

// Function to append messages to the output area
function appendMessage(message) {
    const output = document.getElementById('output');
    output.textContent += message + '\n'+'--------------------------------'+'\n\n';
}



// Expose the sendPrivateMessage function to the global scope
window.sendPrivateMessage = sendPrivateMessage;