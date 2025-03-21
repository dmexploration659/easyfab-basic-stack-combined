from svg_to_gcode.svg_parser import parse_string
from svg_to_gcode.compiler import Compiler, interfaces

# Create a compiler object with the required 'pass_depth' argument
my_svg = """
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="775" height="638" viewBox="0 0 775 638" xml:space="preserve">
<desc>Created with Fabric.js 6.5.3</desc>
<defs>
</defs>
<g transform="matrix(1 0 0 1 334.0623 404)"  >
<path style="stroke: rgb(255,0,0); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,255,255); fill-opacity: 0; fill-rule: nonzero; opacity: 1;" vector-effect="non-scaling-stroke"  transform=" translate(-583, -319)" d="M 558 294 L 608 294 L 608 344 L 558 344 Z" stroke-linecap="round" />
</g>
</svg>
"""

gcode_compiler = Compiler(
    interfaces.Gcode,
    movement_speed=1000,  # Speed for non-cutting movements
    cutting_speed=300,    # Speed for cutting movements
    unit="mm",            # Unit of measurement
    pass_depth=1.0        # Depth of each cutting pass (in mm)
)

# Parse the SVG file
curves = parse_string(my_svg)

print('curves:', curves)

# Append the SVG curves to the compiler
gcode_compiler.append_curves(curves)

# Compile the G-code and print instead of saving to a file
gcode_output = gcode_compiler.compile()

# Print the generated G-code
print('gcodes : ',gcode_output)
