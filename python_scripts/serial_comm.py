import serial
import serial.tools.list_ports
import time

class SerialCommunication:
    def __init__(self, baudrate=115200):
        self.baudrate = baudrate
        self.serial_connection = None
        self.port_in_use = None

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
        time.sleep(0.2)
        return self.serial_connection.readline().decode("utf-8").strip()

    def close_connection(self):
        """Closes the serial connection."""
        if self.serial_connection and self.serial_connection.is_open:
            self.serial_connection.close()
            time.sleep(0.2)

        self.serial_connection = None
        self.port_in_use = None
