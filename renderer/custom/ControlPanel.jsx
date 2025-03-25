import React from 'react';

const ControlPanel = () => {
  return (
    <div className="control-paneld">
      <div className="control-section">
        <div className="steps-indicator">
          <span className="steps-label">Steps</span>
          <span className="steps-value">1</span>
        </div>
        
        <div className="control-grid">
          <button className="control-btn home-btn">
            <span role="img" aria-label="Home">🏠</span>
          </button>
          
          <button className="control-btn up-btn">
            <span role="img" aria-label="Up">↑</span>
          </button>
          
          <button className="control-btn a1-btn">a1</button>
          
          <div className="navigation-cluster">
            <button className="control-btn left-btn">
              <span role="img" aria-label="Left">←</span>
            </button>
            
            <button className="control-btn reset-btn">
              <span role="img" aria-label="Reset">↻</span>
            </button>
            
            <button className="control-btn right-btn">
              <span role="img" aria-label="Right">→</span>
            </button>
          </div>
          
          <button className="control-btn down-btn">
            <span role="img" aria-label="Down">↓</span>
          </button>
          
          <button className="control-btn second-a1-btn">a1</button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;