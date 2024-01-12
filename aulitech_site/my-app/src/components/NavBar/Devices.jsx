import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {db, auth} from '../../firebase';
import {collection, getDocs, query, where, updateDoc} from 'firebase/firestore';

const getCurrentUserId = () => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const userId = currentUser.uid;
    return userId;
  } else {
    return null;
  }
};

function parseBool(value) {
  if (typeof value === 'string') {
    value = value.toLowerCase().trim();
    if (value === 'true') {
      return true;
    } else if (value === 'false') {
      return false;
    }
  }
  return Boolean(value);
}

const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

const InputSlider = ({ value, onChange, min, max, step, sliderTitle, unit, sliderDescription, sliderLabel }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        <label htmlFor={sliderLabel}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        >{`${sliderTitle} (${value} ${unit})`}</label>
        <input
          type="range"
          id={sliderLabel}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={sliderDescription}  // Providing an accessible name for the range input
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
        {isHovered && 
        <div className="tooltip"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            backgroundColor: '#333',
            color: '#fff',
            padding: '5px',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          {sliderDescription}
        </div>
        }
      </div>
    </div>
  );
};

const Dropdown = ({ value, onChange, title, description, options }) => {
  const formattedOptions = options.map((option) =>
    typeof option === 'object' ? option : { value: option, label: option.toString() }
  );

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };


  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

      <label onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} htmlFor="dropdown" style={{ fontSize: '16px', marginRight: '10px' }}>
        {title}
      </label>
      <select id="dropdown" value={value} onChange={onChange} style={styles.selectStyle}>
        {formattedOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {isHovered &&
        <div className="tooltip"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            backgroundColor: '#333',
            color: '#fff',
            padding: '5px',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          {description}
        </div>
      }
      </div>
    </div>
  );
};

const sliderContainerStyle = {
  padding: '20px',
  margin: '10px 0',
  borderRadius: '8px',
  backgroundColor: '#f5f5f5', // Light grey background
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)' // Subtle shadow for depth
};

const titleStyle = {
  color: '#333', // Darker text for better readability
  textAlign: 'center',
  marginBottom: '20px'
};

const descriptionStyle = {
  fontSize: '14px',
  color: '#666', // Lighter text for the description
  marginBottom: '10px'
};

const styles = {
  dropdownContainer: {
    marginBottom: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  labelStyle: {
    fontSize: '18px',
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '10px',
  },
  selectStyle: {
    padding: '10px 15px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    marginBottom: '10px',
  },
  descriptionStyle: {
    fontSize: '14px',
    color: '#666',
  },
};

const DashedLine = () => {
  const lineStyle = {
    border: '1px dashed #000', // 1px width dashed line with black color
    width: '100%', // Adjust the width as needed
    height: 0,
    marginTop: '10px', // Adjust the margin as needed
  };

  return (
    <div style={lineStyle}>
      {/* You can add content or leave it empty depending on your use case */}
    </div>
  );
};


const Devices = ({devices}) => {
  const { deviceName } = useParams();
  const navigate = useNavigate();

  // Find the specific device
  const thisDevice = devices.find(device => device.data.device_info.device_nickname === deviceName);
  // Check if the device was found
  
  const handleRegisterInterface = () => {
    navigate(`/devices/${deviceName}/register-interface`);
  };

  const [fetchedGlobalSettings, setFetchedGlobalSettings] = useState(false);
  const [editedGlobalSettings, setEditedGlobalSettings] = useState(false);

  const [connectionsList, setConnectionsList] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState(null);


  console.log('Device:', thisDevice)

  if (!thisDevice) {
    return <div>Device not found</div>;
  }
  return (
    <div>
      <h1>Device: {JSON.stringify(thisDevice)}</h1>
      {/* Device details and logic */}
      <button onClick={handleRegisterInterface}
        style={{
          backgroundColor: 'blue',
          color: 'white',
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
        }}>
        <span>+</span>
      </button>
    </div>
  );
};

export default Devices;