import React from 'react';
import { CanvasProvider } from '../custom/CanvasContext';
import Workspace from '../custom/Workspace';
import UtilityButtons from '../custom/UtilityButtons';

function App() {
  return (
    <CanvasProvider>
      <Workspace />
      <UtilityButtons />
    </CanvasProvider>
  );
}

export default App;