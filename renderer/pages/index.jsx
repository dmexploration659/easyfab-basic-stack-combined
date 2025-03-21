import React from 'react';
import { CanvasProvider } from '../custom/CanvasContext';
import Workspace from '../custom/Workspace';

function App() {
  return (
    <CanvasProvider>
      <Workspace />
    </CanvasProvider>
  );
}

export default App;