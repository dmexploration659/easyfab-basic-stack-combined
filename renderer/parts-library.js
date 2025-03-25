const partsLibrary = [
    {
      "type": "sheet_metal",
      "thickness": 3,
      "unit": "mm",
      "material": "steel",
      "machining_tool": "router_cnc",
      "sizes": {
        "2x2m": {"length": 2000, "width": 2000, "unit": "mm", "thickness": 3},
        "0.5x0.5m": {"length": 500, "width": 500, "unit": "mm", "thickness": 3},
        "0.2x0.2m": {"length": 200, "width": 200, "unit": "mm", "thickness": 3},
        "3x3m": {"length": 3000, "width": 3000, "unit": "mm", "thickness": 3},
        "1.2x2.4m": {"length": 1200, "width": 2400, "unit": "mm", "thickness": 3}
      },
      "thumbnail": "img/steel_flat_sheet.jpg"
    },
    {
      "type": "square_tube",
      "thickness": 2,
      "unit": "mm",
      "material": "steel",
      "machining_tool": "lathe_cnc",
      "sizes": {
        "40x40mm": {"width": 40, "height": 40, "length": 6000, "unit": "mm", "thickness": 2},
        "20x20mm": {"width": 20, "height": 20, "length": 6000, "unit": "mm", "thickness": 3},
        "16x32mm": {"width": 16, "height": 32, "length": 6000, "unit": "mm", "thickness": 4}
      },
      "thumbnail": "img/steel_square_hollow.jpg"
    },
    {
      "type": "round_tube",
      "thickness": 2,
      "unit": "mm",
      "material": "steel",
      "machining_tool": "lathe_cnc",
      "sizes": {
        "40mm": {"width": 40, "height": 40, "length": 6000, "unit": "mm", "thickness": 1.5},
        "20mm": {"width": 20, "height": 20, "length": 6000, "unit": "mm", "thickness": 1.5},
        "16mm": {"width": 16, "height": 16, "length": 6000, "unit": "mm", "thickness": 2.5}
      },
      "thumbnail": "img/steel_round_hollow.png"
    }
  ];
  
  export default partsLibrary;