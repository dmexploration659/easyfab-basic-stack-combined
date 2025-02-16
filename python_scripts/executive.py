import asyncio
import websockets
import json
from gcode_gen import GCodeGenerator
from serial_comm import SerialCommunication

gcode_gen = GCodeGenerator()
serial_comm = SerialCommunication()
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
                data = json.loads(response)
                await log_to_file(f"websocket logs: Received from server: {data}")

                # If the server requests available serial ports
                if data.get("type") == "private-message":
                    match data.get("title"):
                        
                        case "ports_request":
                            current_ports = serial_comm.get_available_ports()
                            port_response = {
                                "type": "private-message",
                                "message": {
                                    "ports": current_ports
                                },
                                "to": "front-end-client",
                                "title": "available_ports",
                            }                            
                            await websocket.send(json.dumps(port_response))
                            await log_to_file(f"Sent available ports: {current_ports}")


                        case "connect_port":
                            port = data.get("message")["port"]
                            connected = serial_comm.connect(port)
                            await log_to_file(f"port {port} connection status: {connected}")
                            await websocket.send(json.dumps({
                                "type": "private-message",
                                "title": "serial_response",
                                "message": {"text": f"port {port} connection status: {connected}", "connected": connected},
                                "to": "front-end-client"
                                })) 


                        case "send_to_cnc":
                            shape_data = data.get("message")
                            gcode = gcode_gen.generate_gcode(**shape_data)
                            if gcode.startswith("G"):  # Check if it's valid gcode
                                print('gcode:', gcode)
                                await log_to_file(f"converted gcode: {gcode}")
                                cnc_response = serial_comm.send_gcode(gcode)
                                await log_to_file(f"cnc response: {cnc_response}")
                            else:
                                print('error:', gcode) 
                                await log_to_file(f"error: {gcode}")
                                cnc_response = "not sent"
                            await websocket.send(json.dumps({
                                "type": "private-message",
                                "title": "cnc_response",
                                "message": {"serial_response":cnc_response, "used_gcode": gcode},
                                "to": "front-end-client"
                                }))
                            await log_to_file(f"send_to_cnc executed,serial response: {cnc_response}")
                        
                        case "disconnect_port":
                            serial_comm.disconnect()
                            await log_to_file(f"Disconnected from port: {data.get('port')}")
                

            except websockets.exceptions.ConnectionClosed:
                await log_to_file("Connection closed by the server.")
                break

async def main():
    await log_to_file("script started")
    await connect_to_electron()
asyncio.run(main())

