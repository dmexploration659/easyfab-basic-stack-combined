class GCodeGenerator:
    def __init__(self, feedrate=1000):
        self.feedrate = feedrate

    def validate_params(self, required_params, params):
        """Validates if all required parameters are present and valid"""
        missing = [param for param in required_params if param not in params]
        if missing:
            return f"Missing required parameters: {', '.join(missing)}"
        return None

    def generate_rectangle(self, **params):
        """Generates G-code for a rectangle."""
        required = ['start_x', 'start_y', 'width', 'height']
        error = self.validate_params(required, params)
        if error:
            return error
        
        # Validate numeric values
        try:
            start_x = float(params['start_x'])
            start_y = float(params['start_y'])
            width = float(params['width'])
            height = float(params['height'])
            if width <= 0 or height <= 0:
                return "Width and height must be positive numbers"
        except ValueError:
            return "Invalid numeric parameters"

        gcode = ["G21", "G90"]  # Set units to mm, absolute positioning
        gcode.append(f"G0 X{start_x} Y{start_y}")
        gcode.append(f"G1 X{start_x + width} Y{start_y} F{self.feedrate}")
        gcode.append(f"G1 X{start_x + width} Y{start_y + height} F{self.feedrate}")
        gcode.append(f"G1 X{start_x} Y{start_y + height} F{self.feedrate}")
        gcode.append(f"G1 X{start_x} Y{start_y} F{self.feedrate}")
        gcode.append("M30")  # End program
        return "\n".join(gcode)

    def generate_circle(self, **params):
        """Generates G-code for a circle."""
        required = ['start_x', 'start_y', 'radius']
        error = self.validate_params(required, params)
        if error:
            return error

        try:
            center_x = float(params['start_x'])
            center_y = float(params['start_y'])
            radius = float(params['radius'])
            if radius <= 0:
                return "Radius must be a positive number"
        except ValueError:
            return "Invalid numeric parameters"

        gcode = ["G21", "G90"]
        gcode.append(f"G0 X{center_x + radius} Y{center_y}")
        gcode.append(f"G2 X{center_x + radius} Y{center_y} I-{radius} J0 F{self.feedrate}")
        gcode.append("M30")
        return "\n".join(gcode)

    def generate_gcode(self, **kwargs):
        """Dispatch method for generating G-code based on shape."""
        if 'shape' not in kwargs:
            return "Missing required parameter: shape"
        
        shape = kwargs.get('shape')
        if shape == "rectangle":
            return self.generate_rectangle(**kwargs)
        elif shape == "circle":
            return self.generate_circle(**kwargs)
        else:
            return f"Invalid shape type: {shape}"
        

    def makeGcodFromSVG(self, svg_data):
        pass
