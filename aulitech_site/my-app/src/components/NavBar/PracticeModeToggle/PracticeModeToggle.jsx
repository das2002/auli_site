import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './PracticeModeToggle.css';
import '../../../App.css'

const PracticeModeToggle = ({ deviceName, isActive, onToggle }) => {
  const navigate = useNavigate();
  const [isPracticeMode, setIsPracticeMode] = useState(false);

  const handleToggle = () => {
    // Enforce browser compatibility
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    if (!isChrome) {
      alert('Practice mode is only available on Chrome.');
      return;
    }

    // Toggle the practice mode
    setIsPracticeMode(!isPracticeMode)
    onToggle(deviceName); // Passing the device name (or ID)
  };

  return (
    <div className={`box mr-1${isActive ? 'active-device' : ''}`}>
      <div>
        <label className={`flex flex-col switch ${isPracticeMode ? 'active' : ''}`}>
          <input type="checkbox" checked={isPracticeMode} onChange={handleToggle} />
          <span className="slider round"></span>
          <div className='text-white font-medium text-xs'>Practice</div>
        </label>
      </div>
    </div>
  );
};

export default PracticeModeToggle;