import asyncio
import websockets
import json
import serial.tools.list_ports


LOG_FILE = "out_logs.txt"
URI = "ws://localhost:8080"

async def log_to_file(message):
    """Writes logs to a file instead of printing."""
    print(f"\nlogging to file: {message}")
    try:
        with open(LOG_FILE, "a+") as file:  # Changed "a" to "a+" to create file if it doesn't exist
            file.write(f"{message}\n")  # Added f-string for consistency
    except Exception as e:
        print(f"Error writing to log file: {e}")  # Fallback error handling

async def get_serial_ports():
    """Gets available serial ports and returns as a list."""
    ports = serial.tools.list_ports.comports()
    return [port.device for port in ports]

async def connect_to_electron():
    async with websockets.connect(URI) as websocket:
        await log_to_file("Connected to WebSocket server.")

        # Register as "python-client"
        registration_data = json.dumps({
            "type": "register",
            "name": "py-executive-client"
        })
        await websocket.send(registration_data)
        await log_to_file("Sent registration data.")

        while True:
            try:
                response = await websocket.recv()
                print(f"Received from server--py-executive-client: {response}")
                data = json.loads(response)
                await log_to_file(f"Received from server: {data}")

                # If the server requests available serial ports
                if data.get("type") == "private-message":
                    ports = await get_serial_ports()
                    port_response = {
                        "type": "private-message",
                        "ports": ports,
                        "to": "part_planner",
                        "title": "Available ports",
                    }
                    await websocket.send(json.dumps(port_response))
                    await log_to_file(f"Sent available ports: {ports}")

                
                elif data.get("type") == "oover_usb":
                    await log_to_file(f"Logged 'oover_usb' message: {data}")

            except websockets.exceptions.ConnectionClosed:
                await log_to_file("Connection closed by the server.")
                break

async def main():
    await log_to_file("script started")
    await connect_to_electron()

asyncio.run(main())
