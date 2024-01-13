import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import debounce from 'lodash.debounce';
import { collection, getDocs, query, where, updateDoc } from 'firebase/firestore';

const HardwareUIDField = ({ hardwareUID }) => {
  return (
    <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'left', justifyContent: 'left' }}>
      <h2 style={{ fontSize: '16px', marginRight: '10px' }}>Hardware UID</h2>
      <input
        value={hardwareUID}
        style={{
          borderColor: 'black',
          borderWidth: 1,
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '14px',
        }}
        type="text"
        placeholder="Hardware UID"
        readOnly={true}
      />
    </div>
  );
};

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
  textAlign: 'left',
  marginBottom: '20px',
  fontWeight: 'bold',
  fontSize: '24px'
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


const Devices = ({ devices }) => {
  const { deviceName } = useParams();
  const navigate = useNavigate();

  // Find the specific device
  const thisDevice = devices.find(device => device.data.device_info.device_nickname === deviceName);
  // Check if the device was found

  const handleRegisterInterface = () => {
    navigate(`/devices/${deviceName}/register-interface`);
  };

  const [fetchedGlobalSettings, setFetchedGlobalSettings] = useState(null);
  const [editedGlobalSettings, setEditedGlobalSettings] = useState(null);

  const [connectionsList, setConnectionsList] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState(null);

  

  const handleGlobalConfigChange = (keyList) => (value) => {
    const deepGlobalConfigCopy = deepCopy(editedGlobalSettings);
    let currentConfig = deepGlobalConfigCopy;
    for (let i = 0; i < keyList.length - 1; i++) {
      currentConfig = currentConfig[keyList[i]];
    }
    currentConfig[keyList[keyList.length - 1]] = value;
    setEditedGlobalSettings(deepGlobalConfigCopy);
  };

  // what should happen as soon as we get thisDevice
  useEffect(() => {
    if (thisDevice) {
      // Get the global settings
      const getGlobalSettings = async () => {
        let globalSettingsString = thisDevice["data"]["device_info"]["global_config"];
        let globalSettings = (JSON.parse(globalSettingsString))["global_info"];
        setFetchedGlobalSettings(deepCopy(globalSettings));
        setEditedGlobalSettings(deepCopy(globalSettings));
      };
      getGlobalSettings();
      // Get the connections list
      const getConnectionsList = async () => {
        let connectionsList = thisDevice["data"]["device_info"]["connections_list"];
        setConnectionsList(connectionsList);
      };
      getConnectionsList();
    }
  }, [thisDevice]);

  const GlobalInfoSection = () => {
    if (!editedGlobalSettings) {
      return <div>Loading...</div>;
    }

    console.log('editedGlobalSettings:', editedGlobalSettings);

    const sectionStyle = {
      marginBottom: '20px',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
    };

    const sectionHeadingStyle = {
      fontSize: '20px',
      marginBottom: '10px',
      fontWeight: 'bold', // Add the fontWeight property
    };

    return (
      <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h1 style={titleStyle}>Device Settings</h1>
      <div style={sliderContainerStyle}>
        <HardwareUIDField hardwareUID={editedGlobalSettings["HW_UID"]["value"]} />
        <div style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>Sleep</h2>
          <InputSlider 
            sliderLabel={'sleepTimeout'} 
            value={editedGlobalSettings["sleep"]["value"]["timeout"]["value"]}
            onChange={(e) => handleGlobalConfigChange(['sleep', 'value', 'timeout', 'value'])(parseInt(e.target.value))}
            min={10}
            max={1200}
            step={10}
            sliderTitle={'Sleep Timeout'}
            unit={'s'}
            sliderDescription={'Number of consecutive low-movement seconds before Cato sleeps'}
          />
          <InputSlider 
            sliderLabel={'sleepThreshold'} 
            value={editedGlobalSettings["sleep"]["value"]["threshold"]["value"]}
            onChange={(e) => handleGlobalConfigChange(['sleep', 'value', 'threshold', 'value'])(parseFloat(e.target.value))}
            min={2.0}
            max={10.0}
            step={0.5}
            sliderTitle={'Sleep Threshold'}
            unit={'level'}
            sliderDescription={'Movement level below which Cato starts counting towards sleep'} 
          />
        </div>
      </div>
    </div>
    )
  };




  console.log('Device:', thisDevice)

  if (!thisDevice) {
    return <div>Device not found</div>;
  }
  return (
    <div>
      <h1>Device: {JSON.stringify(thisDevice)}</h1>
      <GlobalInfoSection />
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