import serial
import serial.tools.list_ports
import time
import threading
import asyncio

class SerialCommunication:
    def __init__(self, baudrate=115200):
        self.baudrate = baudrate
        self.serial_connection = None
        self.port_in_use = None
        self.running = False
        self.data_callback = None
        self.loop = None

    def register_callback(self, callback):
        """Register an async callback function"""
        self.data_callback = callback
        print(f"Callback registered: {callback}")  # Debug print
        
    def get_available_ports(self):
        """Returns a list of available serial ports with their descriptions."""
        ports = serial.tools.list_ports.comports()
        return [{
            'device': port.device,
            'description': port.description,
            'manufacturer': port.manufacturer,
            'product': port.product,
            'serial_number': port.serial_number,
            'hwid': port.hwid
        } for port in ports]
    
    def start_serial_listener(self, loop=None):
        """Start continuous serial monitoring"""
        self.running = True
        self.loop = loop
        self.monitor_thread = threading.Thread(target=self._serial_listener)
        self.monitor_thread.daemon = True
        self.monitor_thread.start()

    def _serial_listener(self):
        """Serial listener that handles async callbacks"""
        while self.running:
            if self.serial_connection and self.serial_connection.in_waiting:
                try:
                    data = self.serial_connection.readline().decode('utf-8').strip()
                    print(f"Serial received: {data}")
                    
                    # Debug each condition
                    print(f"Has callback: {self.data_callback is not None}")
                    print(f"Has loop: {self.loop is not None}")
                    if self.loop:
                        print(f"Loop running: {self.loop.is_running()}")
                    
                    if self.data_callback and self.loop and self.loop.is_running():
                        print("About to call callback")
                        self.loop.call_soon_threadsafe(
                            lambda: asyncio.create_task(self.data_callback(data))
                        )
                        print("Callback scheduled")
                except Exception as e:
                    print(f"Error in serial listener: {str(e)}")
            time.sleep(0.01)

    def connect(self, port):
        """Establishes a connection to the serial port."""
        try:
            if self.serial_connection and self.serial_connection.is_open:
                self.serial_connection.close()
                time.sleep(0.5)

            self.serial_connection = serial.Serial(port, baudrate=self.baudrate, timeout=1)
            self.port_in_use = port
            time.sleep(0.2)
            return True
        except serial.SerialException:
            return False

    def send_gcode(self, gcode):
        """Sends G-code over the serial connection and reads the response."""
        if not self.serial_connection or not self.serial_connection.is_open:
            raise ConnectionError("Serial connection is not open.")

        self.serial_connection.write((gcode + "\n").encode("utf-8"))

    def disconnect(self):
        """Closes the serial connection."""
        try:
            if self.serial_connection and self.serial_connection.is_open:
                self.serial_connection.close()
                time.sleep(0.2)  # 200ms delay is good for port to settle
        except Exception as e:
            print(f"Error closing serial connection: {e}")
        finally:
            self.serial_connection = None
            self.port_in_use = None
