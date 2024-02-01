import React, { useState, useEffect } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom';

import './PracticeModeToggle.css';
import '../../../App.css';

const PracticeModeToggle = ({ deviceName, onToggle }) => {
  const location = useLocation();
  const isPracticePage = location.pathname.includes('/practice');

  const [isToggled, setIsToggled] = useState(isPracticePage);

  useEffect(() => {
    setIsToggled(isPracticePage);
  }, [isPracticePage]);

  const handleToggle = () => {
    setIsToggled(!isToggled);
    onToggle();
  };

  return (
    <div className={`box mr-1${isToggled ? 'active-device' : ''}`}> 
      <div>
        <label className={`flex flex-col switch ${isToggled ? 'active' : ''}`}> 
          <input type="checkbox" checked={isToggled} onChange={handleToggle} />
          <span className="slider round"></span>
          <div className='text-white font-medium text-xs'>Practice</div>
        </label>
      </div>
    </div>
  );
};

export default PracticeModeToggle;
