// LoadingIndicator.jsx
import React from 'react';
import './LoadingIndicator.css'; 

const LoadingIndicator = ({ style }) => {
  return (
    <div className="loading-container" style={style}>
      Loading<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
    </div>
  );
};

export default LoadingIndicator;
