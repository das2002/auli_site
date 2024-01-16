import React, { useState } from 'react';
import './PracticeModeToggle.css'; // Make sure to create a CSS file with the corresponding styles
import '../../../App.css'

const PracticeModeToggle = ({ deviceName, isActive, onToggle }) => {
  const [isPracticeMode, setIsPracticeMode] = useState(false);

  const handleToggle = () => {
    const newPracticeModeState = !isPracticeMode;
    setIsPracticeMode(newPracticeModeState);
    onToggle(deviceName, newPracticeModeState);
  };

  return (
    <div className={`box mr-0.5${isActive ? 'active-device' : ''}`}>
      <div>
        <span className="device-name">{deviceName}</span>
        <label className={`flex flex-col switch ${isPracticeMode ? 'active' : ''}`}>
          <input type="checkbox" checked={isPracticeMode} onChange={handleToggle} />
          <span className="slider round"></span>
          <div className='text-white font-medium text-xs'>Practice Mode</div>
        </label>
      </div>
    </div>
  );

};

export default PracticeModeToggle;
