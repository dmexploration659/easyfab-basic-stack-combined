import React, { useState } from 'react';
import Sidebar from '../custom/Sidebar';
import Workspace from '../custom/Workspace';
import Workbench from '../custom/Workbench';
import Modal from '../custom/Modal';
import { CanvasProvider } from '../custom/Workspace';

const CNCInterface = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <CanvasProvider>
      <div className="main_cont">
        <Sidebar />
        <Workspace />
        <Workbench />
      </div>
      {isModalOpen && <Modal isOpen={isModalOpen} onClose={handleCloseModal} />}
      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
    </CanvasProvider>
  );
};

export default CNCInterface;
