import asyncio
import websockets
import json

async def connect_to_electron():
    uri = "ws://localhost:8080"

    async with websockets.connect(uri) as websocket:
        print("Connected to WebSocket server!")

        registration_data = json.dumps({
            "type": "register",
            "name": "python-client"
        })
        await websocket.send(registration_data)

        # Listen for messages from the WebSocket server
        while True:
            try:
                response = await websocket.recv()
                data = json.loads(response)
                print(f"Received from server: {data}")

                # Handle private messages
                if data.get("type") == "private-message":
                    print(f"\nNew private message received:")
                    print(f"From: {data.get('from')}")
                    print(f"Title: {data.get('title')}")
                    print(f"Message: {data.get('message')}\n")
                    
                    reply = {
                        "type": "private-message",
                        "to": data.get("from"),
                        "title": "Reply from Python",
                        "message": "Got your message!"
                    }
                    await websocket.send(json.dumps(reply))

            except websockets.exceptions.ConnectionClosed:
                print("Connection closed by the server")
                break
