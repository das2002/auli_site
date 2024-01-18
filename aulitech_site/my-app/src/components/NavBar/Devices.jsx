import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import debounce from 'lodash.debounce';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { set } from 'lodash';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import { KeyOptions, getKeyOption } from './KeyOptions';
import { fetchAndCompareConfig, overwriteConfigFile } from './ReplaceConfig';


const DarkYellowSlider = styled(Slider)(({ theme }) => ({
  color: '#B8860B',
  '& .MuiSlider-thumb': {
    '&:hover, &.Mui-focusVisible': {
      boxShadow: `0px 0px 0px 8px ${theme.palette.mode === 'dark' ? 'rgb(218 165 32 / 16%)' : 'rgb(218 165 32 / 16%)'}`,
    },
    '&.Mui-active': {
      boxShadow: `0px 0px 0px 14px ${theme.palette.mode === 'dark' ? 'rgb(218 165 32 / 16%)' : 'rgb(218 165 32 / 16%)'}`,
    },
  },
  '& .MuiSlider-rail': {
    opacity: 0.28,
  },
}));

// change it back if needed:
// const sectionHeadingStyle = {
//   fontSize: '20px',
//   marginBottom: '10px',
//   fontWeight: 'bold', 
// };

const sectionHeadingStyle = {
  fontSize: '20px',
  marginBottom: '10px',
  fontWeight: 'bold',
  backgroundColor: '#fcdc6d',
  borderRadius: '10px',
  padding: '5px 15px',
  display: 'inline-block',
  boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
};

const CheckboxOption = ({ checked, onChange, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
      <label
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ fontSize: '16px' }}
      >
        {title}
        {isHovered && (
          <div style={hoverstyle}>
            {description}
          </div>
        )}
      </label>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{
          transform: 'scale(1.5)',
          cursor: 'pointer',
          accentColor: 'black'
        }}
      />
    </div>
  );
};

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
  const [sliderValue, setSliderValue] = useState(value || 0);
  const [isLabelHovered, setIsLabelHovered] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleInputChange = (event) => {
    const newValue = event.target.value === '' ? '' : Number(event.target.value);
    setInputValue(newValue);
  };

  const handleInputCommit = (event) => {
    let newValue = event.target.value === '' ? min : Number(event.target.value);
    newValue = newValue < min ? min : newValue > max ? max : newValue;
    setInputValue(newValue);
    setSliderValue(newValue);
    onChange({ target: { value: newValue } });
  };

  useEffect(() => {
    setSliderValue(value || 0);
  }, [value]);

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  const handleSliderChangeCommitted = (event, newValue) => {
    if (onChange) {
      onChange({ target: { value: newValue } });
    }
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label
          htmlFor={sliderLabel}
          style={{ position: 'relative', display: 'block', cursor: 'pointer' }}
          onMouseEnter={() => setIsLabelHovered(true)}
          onMouseLeave={() => setIsLabelHovered(false)}
        >
          {`${sliderTitle} (${sliderValue} ${unit})`}
          {isLabelHovered && (
            <div className="tooltip" style={hoverstyle}>
              {sliderDescription}
            </div>
          )}
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '40%' }}>

          {/* <div style={{ width: '30%' }}>  */}
          <DarkYellowSlider
            id={sliderLabel}
            value={sliderValue}
            onChange={handleSliderChange}
            onChangeCommitted={handleSliderChangeCommitted}
            aria-labelledby={sliderLabel}
            valueLabelDisplay="auto"
            step={step}
            min={min}
            max={max}
          />
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputCommit}
            style={{ width: '60px', marginLeft: '20px' }}
            min={min}
            max={max}
            step={step}
          />
        </div>
      </div>
    </div>
  );
};

const hoverstyle = {
  position: 'absolute',
  backgroundColor: '#333',
  color: 'white',
  padding: '5px',
  borderRadius: '4px',
  fontSize: '12px',
  top: '-25px',
  right: '100%',
  transform: 'translateX(100%)',
  whiteSpace: 'nowrap',
  zIndex: 2
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
    <div style={{ marginBottom: '0px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {title && (
          <label onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} htmlFor="dropdown" style={{ fontSize: '16px', marginRight: '10px' }}>
            {title}
          </label>
        )}

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
  // const lineStyle = {
  //   border: '1px dashed #000', 
  //   width: '100%', 
  //   height: 0,
  //   marginTop: '10px', 
  // };

  return (
    <hr style={{ borderColor: '#ccc', borderWidth: '1px', margin: '10px 0' }} />
    // <div style={lineStyle}>
    // </div>
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

  const [editedGlobalSettings, setEditedGlobalSettings] = useState(null);
  const [editedConnectionsSettings, setEditedConnectionsSettings] = useState(null);
  const [connectionsList, setConnectionsList] = useState([]);

  const handleGlobalConfigChange = (keyList) => {
    return debounce((value) => {
      const newEditedGlobalSettings = deepCopy(editedGlobalSettings);
      let currentConfig = newEditedGlobalSettings;
      for (let i = 0; i < keyList.length - 1; i++) {
        currentConfig = currentConfig[keyList[i]];
      }
      currentConfig[keyList[keyList.length - 1]] = value;
      setEditedGlobalSettings(newEditedGlobalSettings);
    }, 100);

  };



  // what should happen as soon as we get thisDevice
  useEffect(() => {
    if (thisDevice) {
      // Get the global settings
      const getGlobalSettings = async () => {
        let globalSettingsString = thisDevice["data"]["device_info"]["global_config"];
        let globalSettings = (JSON.parse(globalSettingsString))["global_info"];
        setEditedGlobalSettings(deepCopy(globalSettings));
      };
      getGlobalSettings();

      const getConnectionsSettings = async () => {
        // make a deep copy of the connections list
        let connectionsList = thisDevice["data"]["connections"];
        setEditedConnectionsSettings(deepCopy(connectionsList));
      };
      getConnectionsSettings();
    }
  }, [thisDevice]);

  useEffect(() => {
    if (editedConnectionsSettings) {
      const getConnectionsList = async () => {
        let connectionsList = [];
        for (let i = 0; i < editedConnectionsSettings.length; i++) {
          let connection = editedConnectionsSettings[i]; // pass the reference to each connection into the list
          connectionsList.push(connection);
        }
        setConnectionsList(connectionsList);
      };
      getConnectionsList();
    };
  }, [editedConnectionsSettings]);



  const GlobalInfoSection = () => {
    const [isSleepExpanded, setIsSleepExpanded] = useState(true);
    const [isOrientationExpanded, setIsOrientationExpanded] = useState(true);
    const [isCalibrationExpanded, setIsCalibrationExpanded] = useState(true);

    const toggleSleepSection = () => {
      setIsSleepExpanded(!isSleepExpanded);
    };
    const toggleOrientationSection = () => {
      setIsOrientationExpanded(!isOrientationExpanded);
    };
    const toggleCalibrationSection = () => {
      setIsCalibrationExpanded(!isCalibrationExpanded);
    };

    const sectionHeadingDynamicStyle = (isExpanded) => ({
      ...sectionHeadingStyle,
      backgroundColor: isExpanded ? '#fcdc6d' : '#1A202C',
      color: isExpanded ? 'black' : 'white',
      cursor: 'pointer',
    });

    if (!editedGlobalSettings) {
      return <div>Loading...</div>;
    }

    const sectionStyle = {
      // marginBottom: '10px',
      // padding: '10px',
      // border: '1px solid #ccc',
      // borderRadius: '5px',
    };

    return (
      <div>
        <div style={sliderContainerStyle}>
          <HardwareUIDField hardwareUID={editedGlobalSettings["HW_UID"]["value"]} />
          <hr style={{ borderColor: '#ccc', borderWidth: '1px', margin: '10px 0' }} />

          {/* Sleep Section */}
          <h2 style={sectionHeadingDynamicStyle(isSleepExpanded)} onClick={toggleSleepSection}>
            Sleep
          </h2>
          {isSleepExpanded && (
            <div>
              <InputSlider
                sliderLabel={'sleepTimeout'}
                value={editedGlobalSettings.sleep.value.timeout.value}
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
            // </div>
          )}

          <hr style={{ borderColor: '#ccc', borderWidth: '1px', margin: '10px 0' }} />
          <h2 style={sectionHeadingDynamicStyle(isOrientationExpanded)} onClick={toggleOrientationSection}>
            Orientation
          </h2>
          {isOrientationExpanded && (
            <div style={sectionStyle}>
              <Dropdown
                title={'Front'}
                description={'Orientation of the device'}
                value={editedGlobalSettings["orientation"]["value"]["front"]["value"]}
                onChange={(e) => handleGlobalConfigChange(['orientation', 'value', 'front', 'value'])(e.target.value)}
                options={[
                  "+x",
                  "-x",
                  "+y",
                  "-y",
                  "+z",
                  "-z"
                ]}
              />
              <Dropdown
                title={'Bottom'}
                description={'Orientation of the device'}
                value={editedGlobalSettings["orientation"]["value"]["bottom"]["value"]}
                onChange={(e) => handleGlobalConfigChange(['orientation', 'value', 'bottom', 'value'])(e.target.value)}
                options={[
                  "+x",
                  "-x",
                  "+y",
                  "-y",
                  "+z",
                  "-z"
                ]}
              />
              <Dropdown
                title={'Left'}
                description={'Orientation of the device'}
                value={editedGlobalSettings["orientation"]["value"]["left"]["value"]}
                onChange={(e) => handleGlobalConfigChange(['orientation', 'value', 'left', 'value'])(e.target.value)}
                options={[
                  "+x",
                  "-x",
                  "+y",
                  "-y",
                  "+z",
                  "-z"
                ]}
              />
            </div>
          )}

          <div style={sectionStyle}>
            <hr style={{ borderColor: '#ccc', borderWidth: '1px', margin: '10px 0' }} />
            <h2 style={sectionHeadingDynamicStyle(isCalibrationExpanded)} onClick={toggleCalibrationSection}>
              Calibration
            </h2>
            {isCalibrationExpanded && (
              <div>
                <InputSlider
                  sliderLabel={'calibrationThreshold'}
                  value={editedGlobalSettings["calibration"]["value"]["auto_threshold"]["value"]}
                  onChange={(e) => handleGlobalConfigChange(['calibration', 'value', 'auto_threshold', 'value'])(parseFloat(e.target.value))}
                  min={0.2}
                  max={1.0}
                  step={0.01}
                  sliderTitle={'Auto-Calibration Threshold'}
                  unit={'x'}
                  sliderDescription={"Movement required (as a scale of mouse>idle_threshold) to fail automatic calibration for gyro drift"}
                ></InputSlider>
                <InputSlider
                  sliderLabel={'calibrationSamples'}
                  value={editedGlobalSettings["calibration"]["value"]["auto_samples"]["value"]}
                  onChange={(e) => handleGlobalConfigChange(['calibration', 'value', 'auto_samples', 'value'])(parseFloat(e.target.value))}
                  min={1}
                  max={300}
                  step={1}
                  sliderTitle={'Auto-Calibration Samples Taken'}
                  unit={'samples'}
                  sliderDescription={"Number of samples to wait (at below auto_threshold) required to trigger auto recalibratoion"}
                ></InputSlider>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  };


  const AccordionList = ({ data }) => {
    const noConnectionsStyle = {
      textAlign: 'center',
      padding: '20px',
      fontSize: '16px',
      color: '#666',
    };

    if (data.length === 0) { //no connections display
      return (
        <div style={noConnectionsStyle}>
          No connections yet. Add a connection to begin.
        </div>
      );
    }

    const ConnectionAccordion = ({ connection }) => {
      const [isExpanded, setIsExpanded] = useState(false);
      const [collapsedSections, setCollapsedSections] = useState({});
      const toggleSection = (sectionKey) => {
        setCollapsedSections((prevSections) => ({
          ...prevSections,
          [sectionKey]: !prevSections[sectionKey],
        }));
      };

      // const [collapsedSections, setCollapsedSections] = useState({
      //   connectionSettings: false,
      //   mouseSettings: false,
      //   clickerSettings: false,
      //   gestureSettings: false,
      //   tvRemoteOptions: false,
      // });

      // const toggleSection = (sectionKey) => {
      //   setCollapsedSections((prevSections) => ({
      //     ...prevSections,
      //     [sectionKey]: !prevSections[sectionKey],
      //   }));
      // };


      const [fetchedConnectionConfig, setFetchedConnectionConfig] = useState(null);
      const [editedConnectionConfig, setEditedConnectionConfig] = useState(null);
      const [activeOperationMode, setActiveOperationMode] = useState(connection["current_mode"]);

      const [fetchedGestureMouseConfig, setFetchedGestureMouseConfig] = useState(null);
      const [editedGestureMouseConfig, setEditedGestureMouseConfig] = useState(null);

      const [fetchedTVRemoteConfig, setFetchedTVRemoteConfig] = useState(null);
      const [editedTVRemoteConfig, setEditedTVRemoteConfig] = useState(null);

      const [fetchedPointerConfig, setFetchedPointerConfig] = useState(null);
      const [editedPointerConfig, setEditedPointerConfig] = useState(null);

      const [fetchedClickerConfig, setFetchedClickerConfig] = useState(null);
      const [editedClickerConfig, setEditedClickerConfig] = useState(null);

      useEffect(() => {
        if (connection) {
          // Get the connection settings
          const getConnectionSettings = async () => {
            let connectionSettingsString = connection["connection_config"];
            let connectionSettings = (JSON.parse(connectionSettingsString));
            setFetchedConnectionConfig(deepCopy(connectionSettings));
            setEditedConnectionConfig(connectionSettings);
          };
          getConnectionSettings();
          setActiveOperationMode(connection["current_mode"]);

          const getGestureMouseConfig = async () => {
            let gestureMouseConfigString = connection["mode"]["gesture_mouse"]
            let gestureMouseConfig = (JSON.parse(gestureMouseConfigString));
            setFetchedGestureMouseConfig(deepCopy(gestureMouseConfig));
            setEditedGestureMouseConfig(deepCopy(gestureMouseConfig));
          };
          getGestureMouseConfig();

          const getTVRemoteConfig = async () => {
            let tvRemoteConfigString = connection["mode"]["tv_remote"]
            let tvRemoteConfig = (JSON.parse(tvRemoteConfigString));
            setFetchedTVRemoteConfig(deepCopy(tvRemoteConfig));
            setEditedTVRemoteConfig(deepCopy(tvRemoteConfig));
          };
          getTVRemoteConfig();

          const getPointerConfig = async () => {
            let pointerConfigString = connection["mode"]["pointer"]
            let pointerConfig = (JSON.parse(pointerConfigString));
            setFetchedPointerConfig(deepCopy(pointerConfig));
            setEditedPointerConfig(deepCopy(pointerConfig));
          };
          getPointerConfig();

          const getClickerConfig = async () => {
            let clickerConfigString = connection["mode"]["clicker"]
            let clickerConfig = (JSON.parse(clickerConfigString));
            setFetchedClickerConfig(deepCopy(clickerConfig));
            setEditedClickerConfig(deepCopy(clickerConfig));
          };
          getClickerConfig();
        }
      }, []);

      const toggleIsExpanded = () => {
        setIsExpanded(!isExpanded);
      };

      const handleOperationModeSelection = (value) => {
        if (value === "Gesture Mouse") {
          setActiveOperationMode("gesture_mouse");
        } else if (value === "TV Remote") {
          setActiveOperationMode("tv_remote");
        } else if (value === "Pointer") {
          setActiveOperationMode("pointer");
        } else if (value === "Clicker") {
          setActiveOperationMode("clicker");
        }
      }

      const operationModeConversion = (mode) => {
        if (mode === "gesture_mouse") {
          return "Gesture Mouse";
        } else if (mode === "tv_remote") {
          return "TV Remote";
        } else if (mode === "pointer") {
          return "Pointer";
        } else if (mode === "clicker") {
          return "Clicker";
        }
      };

      const handleConnectionConfigChange = (keyList) => {
        return debounce((value) => {
          const newEditedConnectionConfig = deepCopy(editedConnectionConfig);
          let currentConfig = newEditedConnectionConfig;
          for (let i = 0; i < keyList.length - 1; i++) {
            currentConfig = currentConfig[keyList[i]];
          }
          currentConfig[keyList[keyList.length - 1]] = value;
          setEditedConnectionConfig(newEditedConnectionConfig);
        }, 100);
      }

      const handleModeConfigChange = (keyList, mode) => {
        return debounce((value) => {
          if (mode === "gesture_mouse") {
            const newEditedGestureMouseConfig = deepCopy(editedGestureMouseConfig);
            let currentConfig = newEditedGestureMouseConfig;
            for (let i = 0; i < keyList.length - 1; i++) {
              currentConfig = currentConfig[keyList[i]];
            }
            currentConfig[keyList[keyList.length - 1]] = value;
            setEditedGestureMouseConfig(newEditedGestureMouseConfig);
          } else if (mode === "tv_remote") {
            const newEditedTVRemoteConfig = deepCopy(editedTVRemoteConfig);
            let currentConfig = newEditedTVRemoteConfig;
            for (let i = 0; i < keyList.length - 1; i++) {
              currentConfig = currentConfig[keyList[i]];
            }
            currentConfig[keyList[keyList.length - 1]] = value;
            setEditedTVRemoteConfig(newEditedTVRemoteConfig);
          } else if (mode === "pointer") {
            const newEditedPointerConfig = deepCopy(editedPointerConfig);
            let currentConfig = newEditedPointerConfig;
            for (let i = 0; i < keyList.length - 1; i++) {
              currentConfig = currentConfig[keyList[i]];
            }
            currentConfig[keyList[keyList.length - 1]] = value;
            setEditedPointerConfig(newEditedPointerConfig);
          } else if (mode === "clicker") {
            const newEditedClickerConfig = deepCopy(editedClickerConfig);
            let currentConfig = newEditedClickerConfig;
            for (let i = 0; i < keyList.length - 1; i++) {
              currentConfig = currentConfig[keyList[i]];
            }
            currentConfig[keyList[keyList.length - 1]] = value;
            setEditedClickerConfig(newEditedClickerConfig);
          }
        }, 100);
      }

      useEffect(() => {
        connection["current_mode"] = activeOperationMode;
      }, [activeOperationMode]);

      useEffect(() => {
        console.log('editedConnectionConfig: ' + editedConnectionConfig)
        if (editedConnectionConfig) {
          connection["connection_config"] = JSON.stringify(editedConnectionConfig);
        }
      }, [editedConnectionConfig]);

      useEffect(() => {
        console.log('editedGestureMouseConfig: ' + editedGestureMouseConfig)
        if (editedGestureMouseConfig) {
          connection["mode"]["gesture_mouse"] = JSON.stringify(editedGestureMouseConfig);
        }
      }, [editedGestureMouseConfig]);

      useEffect(() => {
        console.log('editedTVRemoteConfig: ' + editedTVRemoteConfig)
        if (editedTVRemoteConfig) {
          console.log('editedTVRemoteConfig: ' + editedTVRemoteConfig)
          connection["mode"]["tv_remote"] = JSON.stringify(editedTVRemoteConfig);
        }
      }, [editedTVRemoteConfig]);

      useEffect(() => {
        console.log('editedPointerConfig: ' + editedPointerConfig)
        console.log(editedPointerConfig);
        if (editedPointerConfig) {
          connection["mode"]["pointer"] = JSON.stringify(editedPointerConfig);
        }
      }, [editedPointerConfig]);

      useEffect(() => {
        console.log('editedClickerConfig: ' + editedClickerConfig)
        if (editedClickerConfig) {
          connection["mode"]["clicker"] = JSON.stringify(editedClickerConfig);

        }
      }, [editedClickerConfig]);

      const ConnectionSpecificSettings = () => {
        const [collapsedSections, setCollapsedSections] = useState({});

        const toggleSection = (sectionKey) => {
          setCollapsedSections((prevSections) => ({
            ...prevSections,
            [sectionKey]: !prevSections[sectionKey],
          }));
        };

        return (
          <div style={{ maxWidth: '600px', margin: '0' }}>
            <button
              onClick={() => toggleSection('connectionSettings')}
              style={{

                backgroundColor: collapsedSections['connectionSettings'] ? '#1A202C' : '#fcdc6d',
                color: collapsedSections['connectionSettings'] ? '#FFFFFF' : '#000000',
                borderRadius: '10px',
                padding: '5px 15px',
                display: 'inline-block',
                boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                fontSize: '20px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                marginBottom: '10px',
              }}
            >Connection Settings</button>
            {!collapsedSections['connectionSettings'] && (
              <div>
                <InputSlider
                  sliderLabel={'screenSizeHeight'}
                  value={editedConnectionConfig.screen_size.value.height.value}
                  onChange={(e) => handleConnectionConfigChange(['screen_size', 'value', 'height', 'value'])(e.target.value)}
                  min={600}
                  max={4320}
                  step={1}
                  sliderTitle={"Screen Size - Height"}
                  unit={"px"}
                  sliderDescription={"Height of interface screen"}
                />

                <InputSlider
                  sliderLabel={'screenSizeWidth'}
                  value={editedConnectionConfig.screen_size.value.width.value}
                  onChange={(e) => handleConnectionConfigChange(['screen_size', 'value', 'width', 'value'])(e.target.value)}
                  min={800}
                  max={8192}
                  step={1}
                  sliderTitle={"Screen Size - Width"}
                  unit={"px"}
                  sliderDescription={"Width of interface screen"}
                />
              </div>
            )}
          </div>
        );
      };

      const MouseOptions = (config) => {
        const [isCollapsed, setIsCollapsed] = useState(false);

        const toggleCollapse = () => {
          setIsCollapsed(!isCollapsed);
        };

        return (
          <div style={{ maxWidth: '600px', margin: '0' }}>
            <button
              onClick={toggleCollapse}
              style={{
                backgroundColor: isCollapsed ? '#1A202C' : '#fcdc6d',
                color: isCollapsed ? '#FFFFFF' : '#000000',
                borderRadius: '10px',
                padding: '5px 15px',
                display: 'inline-block',
                boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                fontSize: '20px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                marginBottom: '10px',
              }}
            >Mouse Settings</button>
            {!isCollapsed && (
              <div>
                {/* <h1 style={titleStyle}>Mouse Settings</h1> */}
                {/* <div style={sliderContainerStyle}> */}
                {/* <p style={descriptionStyle}>Adjust your mouse settings below:</p> */}
                <InputSlider
                  sliderLabel={'mouseIdleThreshold'}
                  value={config.config.mouse.value.idle_threshold.value}
                  onChange={(e) => handleModeConfigChange(['mouse', 'value', 'idle_threshold', 'value'], activeOperationMode)(parseInt(e.target.value))}
                  min={5}
                  max={12}
                  step={1}
                  sliderTitle="Mouse Idle Threshold"
                  unit={""}
                  sliderDescription="Value of move speed below which is considered idle. Causes mouse exit; High value: easier to idle out; Low value: mouse stays active."
                />
                <InputSlider
                  sliderLabel={'minMouseRuntime'}
                  value={config.config.mouse.value.min_run_cycles.value}
                  onChange={(e) => handleModeConfigChange(['mouse', 'value', 'min_run_cycles', 'value'], activeOperationMode)(parseInt(e.target.value))}
                  min={0}
                  max={100}
                  step={1}
                  sliderTitle="Minimum Mouse Runtime"
                  unit={"cs"}
                  sliderDescription="Minimum time (in .01 second increments) that mouse will always run before checking idle conditions for exit"
                />
                <InputSlider
                  sliderLabel={'mouseIdleDuration'}
                  value={config.config.mouse.value.idle_duration.value}
                  onChange={(e) => handleModeConfigChange(['mouse', 'value', 'idle_duration', 'value'], activeOperationMode)(parseInt(e.target.value))}
                  min={30}
                  max={150}
                  step={1}
                  unit={"cs"}
                  sliderTitle="Idle Timeout Cycles"
                  sliderDescription="Amount of idle time (in .01 second increments) required to trigger mouse exit"
                />
                <InputSlider
                  sliderLabel={'mouseDwellDuration'}
                  value={config.config.mouse.value.dwell_duration.value}
                  onChange={(e) => handleModeConfigChange(['mouse', 'value', 'dwell_duration', 'value'], activeOperationMode)(parseInt(e.target.value))}
                  min={20}
                  max={100}
                  step={1}
                  unit={"cs"}
                  sliderTitle="Dwell Trigger Cycles"
                  sliderDescription="Amount of idle time (in .01 second increments) needed to trigger action in dwell_click"
                />
                <CheckboxOption
                  checked={config.config.mouse.value.dwell_repeat.value}
                  onChange={(e) => handleModeConfigChange(['mouse', 'value', 'dwell_repeat', 'value'], activeOperationMode)(e.target.checked)}
                  title="Dwell Repeat Clicks"
                  description="Continued idle causes multiple clicks"
                />
                <InputSlider
                  sliderLabel={'mouseScaleX'}
                  value={config.config.mouse.value.scale_x.value}
                  onChange={(e) => handleModeConfigChange(['mouse', 'value', 'scale_x', 'value'], activeOperationMode)(e.target.value)}
                  min={0.1}
                  max={4.0}
                  step={0.1}
                  unit={"x"}
                  sliderTitle="Horizontal Movement Scale Factor"
                  sliderDescription="Mouse sensitivity to horizontal movement"
                />
                <InputSlider
                  sliderLabel={'mouseScaleY'}
                  value={config.config.mouse.value.scale_y.value}
                  onChange={(e) => handleModeConfigChange(['mouse', 'value', 'scale_y', 'value'], activeOperationMode)(e.target.value)}
                  min={0.1}
                  max={4.0}
                  step={0.1}
                  unit={"x"}
                  sliderTitle="Vertical Movement Scale Factor"
                  sliderDescription="Mouse sensitivity to vertical movement"
                />
                <InputSlider
                  sliderLabel={'mouseShakeSize'}
                  value={config.config.mouse.value.shake_size.value}
                  onChange={(e) => handleModeConfigChange(['mouse', 'value', 'shake_size', 'value'], activeOperationMode)(e.target.value)}
                  min={0}
                  max={20}
                  step={1}
                  unit={"px"}
                  sliderTitle="Shake Size"
                  sliderDescription="Size of cursor movement for gesturer indicator"
                />
                <InputSlider
                  sliderLabel={'mouseNumberShakes'}
                  value={config.config.mouse.value.num_shake.value}
                  onChange={(e) => handleModeConfigChange(['mouse', 'value', 'num_shake', 'value'], activeOperationMode)(e.target.value)}
                  min={1}
                  max={4}
                  step={1}
                  sliderTitle="Number of Shakes"
                  unit={"shakes"}
                  sliderDescription="Number of times to repeat gesture ready indicator"
                />
              </div>
            )}
          </div>
        );
      };

      const ClickerOptions = (config) => {
        const [collapsedSections, setCollapsedSections] = useState({ clickerSettings: false });

        const toggleSection = (sectionKey) => {
          setCollapsedSections((prevSections) => ({
            ...prevSections,
            [sectionKey]: !prevSections[sectionKey],
          }));
        };

        return (
          <div style={{ maxWidth: '600px', margin: '0' }}>
            <button
              onClick={() => toggleSection('clickerSettings')}
              style={{
                backgroundColor: collapsedSections['clickerSettings'] ? '#1A202C' : '#fcdc6d',
                color: collapsedSections['clickerSettings'] ? '#FFFFFF' : '#000000',
                borderRadius: '10px',
                padding: '5px 15px',
                display: 'inline-block',
                boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                fontSize: '20px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                marginBottom: '10px',
              }}
            >
              Clicker Settings
            </button>
            {!collapsedSections['clickerSettings'] && (
              <div>
                {/* <div style={sliderContainerStyle}> */}
                {/* <p style={descriptionStyle}>Adjust your clicker settings below:</p> */}
                <InputSlider
                  value={config.config.clicker.value.max_click_spacing.value}
                  onChange={(e) => handleModeConfigChange(['clicker', 'value', 'max_click_spacing', 'value'], activeOperationMode)(parseFloat(e.target.value))}
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  unit={"s"}
                  sliderTitle={"Max Click Spacing"}
                  sliderDescription={"Time (seconds) to await next tap before dispatching counted result"}
                  sliderLabel={"clickerMaxClickSpacing"}
                />
                <InputSlider
                  value={config.config.clicker.value.tap_ths.value}
                  onChange={(e) => handleModeConfigChange(['clicker', 'value', 'tap_ths', 'value'], activeOperationMode)(parseFloat(e.target.value))}
                  min={0}
                  max={31}
                  step={1}
                  unit={"level"}
                  sliderTitle={"Tap Threshold"}
                  sliderDescription={"Level of impact needed to trigger a click. Lower -> more Sensitive to impact"}
                  sliderLabel={"clickerTapThreshold"}
                />
                <InputSlider
                  value={config.config.clicker.value.quiet.value}
                  onChange={(e) => handleModeConfigChange(['clicker', 'value', 'quiet', 'value'], activeOperationMode)(parseInt(e.target.value))}
                  min={0}
                  max={3}
                  step={1}
                  unit={"level"}
                  sliderTitle={"Quiet"}
                  sliderDescription={"Amount of quiet required after a click"}
                  sliderLabel={"clickerQuiet"}
                />
                <InputSlider
                  value={config.config.clicker.value.shock.value}
                  onChange={(e) => handleModeConfigChange(['clicker', 'value', 'shock', 'value'], activeOperationMode)(parseInt(e.target.value))}
                  min={0}
                  max={3}
                  step={1}
                  unit={"s"}
                  sliderTitle={"Shock"}
                  sliderDescription={"Max duration of over threshold event"}
                  sliderLabel={"clickerShock"}
                />

              </div>
            )}
          </div>
        );
      };


      const GestureOptions = (config) => {
        const [isCollapsed, setIsCollapsed] = useState(false);

        const toggleCollapse = () => {
          setIsCollapsed(!isCollapsed);
        };

        return (
          <div style={{ maxWidth: '600px', margin: '0' }}>
            <button
              onClick={toggleCollapse}
              style={{
                backgroundColor: isCollapsed ? '#1A202C' : '#fcdc6d',
                color: isCollapsed ? '#FFFFFF' : '#000000',
                borderRadius: '10px',
                padding: '5px 15px',
                display: 'inline-block',
                boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                fontSize: '20px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                marginBottom: '10px',
              }}
            >
              Gesture Settings
            </button>
            {!isCollapsed && (
              <div>
                {/* <div style={sliderContainerStyle}> */}
                {/* <p style={descriptionStyle}>Adjust your gesture collection settings below:</p> */}
                <InputSlider
                  sliderLabel={'gestureConfidenceThreshold'}
                  value={config.config.gesture.value.confidence_threshold.value}
                  onChange={(e) => handleModeConfigChange(['gesture', 'value', 'confidence_threshold', 'value'], activeOperationMode)(parseFloat(e.target.value))}
                  min={0.55}
                  max={0.90}
                  step={0.01}
                  sliderTitle="Gesture Confidence Threshold"
                  unit={""}
                  sliderDescription="Threshold of gesture confidence probability [0, 1], for Cato to accept gesture and execute command. Low value -> few dry-fires, more frequent misinterpretation. High value -> frequent dry-fires, rare misinterpretation"
                />
                <InputSlider
                  sliderLabel={'gestureTimeout'}
                  value={config.config.gesture.value.timeout.value}
                  onChange={(e) => handleModeConfigChange(['gesture', 'value', 'timeout', 'value'], activeOperationMode)(parseFloat(e.target.value))}
                  min={0.1}
                  max={3.0}
                  step={0.05}
                  sliderTitle="Gesture Timeout Window Length"
                  unit={"s"}
                  sliderDescription="Maximum Time (seconds) to Wait for Gesture Start before exiting recognition window"
                />
                <InputSlider
                  sliderLabel={'gestureCollectionTimeout'}
                  value={config.config.gesture.value.gc_timeout.value}
                  onChange={(e) => handleModeConfigChange(['gesture', 'value', 'gc_timeout', 'value'], activeOperationMode)(parseFloat(e.target.value))}
                  min={5}
                  max={30}
                  step={1}
                  sliderTitle="Gesture Collection Wait Period"
                  unit={"s"}
                  sliderDescription="Time to wait before beginning gesture collection over bluetooth"
                />

              </div>
            )}
          </div>
        );
      };

      const TVRemoteOptions = (config) => {
        return (
          // give a title for the TV Remote Options
          <div style={{ maxWidth: '600px', margin: '0' }}>
            <h2 style={sectionHeadingStyle}>TV Remote Options</h2>
            {/* <h1 style={titleStyle}> TV Remote Options </h1> */}
            {/* <div style={sliderContainerStyle}> */}
            <CheckboxOption
              checked={config.config.tv_remote.value.await_actions.value}
              onChange={(e) => handleModeConfigChange(['tv_remote', 'value', 'await_actions', 'value'], activeOperationMode)(parseBool(e.target.value))}
              title="Await Actions"
              description="Wait for previous action to end before reading a new gesture"
              options={[true, false]}
            />
          </div>
          // </div>

        );
      };

      const BindingsPanel = ({ config }) => {

        console.log(config);

        const getInitialBindingsForMode = (config) => {
          console.log(config);
          const defaultConfig = [
            { gesture: 'None', command: 'noop', setting1: '', setting2: '', setting3: '' },
            { gesture: 'Nod Up', command: 'noop', setting1: '', setting2: '', setting3: '' },
            { gesture: 'Nod Down', command: 'noop', setting1: '', setting2: '', setting3: '' },
            { gesture: 'Nod Right', command: 'noop', setting1: '', setting2: '', setting3: '' },
            { gesture: 'Nod Left', command: 'noop', setting1: '', setting2: '', setting3: '' },
            { gesture: 'Tilt Right', command: 'noop', setting1: '', setting2: '', setting3: '' },
            { gesture: 'Tilt Left', command: 'noop', setting1: '', setting2: '', setting3: '' },
          ];
          if (config) {
            if (config.bindings.value) {
              return config.bindings.value;
            }
          }

          return defaultConfig;
        };

        function generateDescription(binding) {
          switch (binding.command) {
            case "noop":
              return "Does nothing.";
            case "quick_sleep":
              return "Puts Cato in sleep mode with tap to wake.";
            case "pointer_sleep":
              return "Puts Cato in pointer sleep, wake with a gesture.";
            case "quick_calibrate":
              return "Runs quick calibration for drift removal.";
            case "dwell_click":
              if (binding.setting1 && binding.setting2) {
                return `Moves cursor and taps ${buttonMapping(binding.setting1)} on dwell, tilts at speed ${binding.setting2} to cancel.`;
              }
              return "Moves cursor and taps on dwell, tilt to cancel.";
            case "_scroll":
              return "Freezes cursor, look up/down to scroll, look left/right to cancel.";
            case "_scroll_lr":
              return "Freezes cursor, look up/down to scroll horizontally, look left/right to cancel.";
            case "button_action":
              if (binding.setting1 && binding.setting2 && binding.setting3) {
                return `Button Action: ${actorMapping(binding.setting1)} ${actionMapping(binding.setting2)} on ${buttonMapping(binding.setting3)}.`;
              }
              return "Performs a specified action.";
            default:
              return "Unknown command.";
          }
        }
        function actorMapping(actor) {
          return actor === "0" ? "Mouse" : "Keyboard";
        }
        function actionMapping(action) {
          const actionMappings = {
            "tap": "taps",
            "double_tap": "double taps",
            "press": "presses and holds",
            "release": "releases",
            "toggle": "toggles press/release",
            "hold_until_idle": "holds until idle",
            "hold_until_sig_motion": "holds until significant motion detected"
          };
          return actionMappings[action] || "Unknown action";
        }
        function buttonMapping(button) {
          if (button === "1") return "Left Click";
          if (button === "2") return "Right Click";
          else {
            return getKeyOption(button);
          }
        }
        const toggleStyle = {
          backgroundColor: collapsedSections['bindingsPanel'] ? '#1A202C' : '#fcdc6d',
          color: collapsedSections['bindingsPanel'] ? '#FFFFFF' : '#000000',
          borderRadius: '10px',
          padding: '5px 15px',
          display: 'inline-block',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          fontSize: '20px',
          fontWeight: 'bold',
          border: 'none',
          cursor: 'pointer',
          outline: 'none',
          width: 'fit-content',
          marginBottom: '10px',
        };
        const handleCommandChange = (index, value) => {
          let updatedBindings = [...config["bindings"]["value"]];
          let currentBinding = updatedBindings[index];

          // Set default settings only when the command changes for the first time
          if (currentBinding.command !== value) {
            switch (value) {
              case 'dwell_click':
                updatedBindings[index].setting1 = "1";
                updatedBindings[index].setting2 = "2";
                updatedBindings[index].setting3 = '';
                break;
              case 'button_action':
                updatedBindings[index].setting1 = "0";
                updatedBindings[index].setting2 = 'tap';
                updatedBindings[index].setting3 = "1";
                break;
              default:
                // Reset settings for other commands, if necessary
                updatedBindings[index].setting1 = '';
                updatedBindings[index].setting2 = '';
                updatedBindings[index].setting3 = '';
                break;
            }
          }
          updatedBindings[index].command = value;


          switch (activeOperationMode) {
            case "gesture_mouse":
              const newEditedGestureMouseConfig = deepCopy(editedGestureMouseConfig);
              newEditedGestureMouseConfig.bindings.value = updatedBindings;
              setEditedGestureMouseConfig(newEditedGestureMouseConfig);
              break;
            case "tv_remote":
              const newEditedTVRemoteConfig = deepCopy(editedTVRemoteConfig);
              newEditedTVRemoteConfig.bindings.value = updatedBindings;
              setEditedTVRemoteConfig(newEditedTVRemoteConfig);
              break;
            case "pointer":
              const newEditedPointerConfig = deepCopy(editedPointerConfig);
              newEditedPointerConfig.bindings.value = updatedBindings;
              setEditedPointerConfig(newEditedPointerConfig);
              break;
            case "clicker":
              const newEditedClickerConfig = deepCopy(editedClickerConfig);
              newEditedClickerConfig.bindings.value = updatedBindings;
              setEditedClickerConfig(newEditedClickerConfig);
              break;
          }

        };

        const handleSettingsChange = (index, settingNumber, value) => {

          let updatedBindings = [...config["bindings"]["value"]];
          let currentBinding = updatedBindings[index];

          if (currentBinding.command === 'button_action') {
            if (settingNumber === 1) {  // If the actor is being changed
              // Set defaults based on the new actor value
              currentBinding.setting2 = 'tap'; // Default action remains the same
              currentBinding.setting3 = (value === '0') ? '1' : '4'; // Default button based on actor
            }
          }

          // Update the setting that has been changed
          currentBinding[`setting${settingNumber}`] = value;
          //setEditedBindings(updatedBindings);

          switch (activeOperationMode) {
            case "gesture_mouse":
              const newEditedGestureMouseConfig = deepCopy(editedGestureMouseConfig);
              newEditedGestureMouseConfig.bindings.value = updatedBindings;
              setEditedGestureMouseConfig(newEditedGestureMouseConfig);
              break;
            case "tv_remote":
              const newEditedTVRemoteConfig = deepCopy(editedTVRemoteConfig);
              newEditedTVRemoteConfig.bindings.value = updatedBindings;
              setEditedTVRemoteConfig(newEditedTVRemoteConfig);
              break;
            case "pointer":
              const newEditedPointerConfig = deepCopy(editedPointerConfig);
              newEditedPointerConfig.bindings.value = updatedBindings;
              setEditedPointerConfig(newEditedPointerConfig);
              break;
            case "clicker":
              const newEditedClickerConfig = deepCopy(editedClickerConfig);
              newEditedClickerConfig.bindings.value = updatedBindings;
              setEditedClickerConfig(newEditedClickerConfig);
              break;
          }
        };

        const gesturesList = [
          'None',
          'Nod Up',
          'Nod Down',
          'Nod Right',
          'Nod Left',
          'Tilt Right',
          'Tilt Left'
        ]

        const toggleSection = (sectionKey) => {
          setCollapsedSections((prevSections) => ({
            ...prevSections,
            [sectionKey]: !prevSections[sectionKey],
          }));
        };

        return (
          <div className='w-16/12 flex flex-col'>
            <button
              onClick={() => toggleSection('bindingsPanel')}
              style={toggleStyle}
            >Bindings Panel</button>
            {!collapsedSections['bindingsPanel'] && (
              <div>

                {/* <h2 style= {sectionHeadingStyle}>Bindings Panel</h2> */}
                <table className='table-fixed'>
                  <thead>
                    <tr>
                      <th className="w-2/12 p-2 border border-gray-200">Gesture</th>
                      <th className="w-2/12 p-2 border border-gray-200">Command</th>
                      <th className="w-6/12 p-2 border border-gray-200">Settings</th>
                      <th className="w-6/12 p-2 border border-gray-200">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {config.bindings.value.map((binding, index) => (

                      <tr key={index} className="max-h-16 h-16">

                        {/* Gesture */}
                        <td className="bg-white px-3 py-4 border border-gray-200 text-gray-800 text-md">
                          {gesturesList[index]}
                        </td>

                        {/* Command */}
                        <td className="bg-white px-3 py-4 border border-gray-200 text-gray-800 text-md">
                          <select
                            value={binding.command}
                            onChange={(e) => handleCommandChange(index, e.target.value)}
                          >
                            <option value="noop">None (noop)</option>
                            <option value="quick_sleep">Quick Sleep</option>
                            <option value="pointer_sleep">Pointer Sleep</option>
                            <option value="quick_calibrate">Quick Calibrate</option>
                            <option value="dwell_click">Dwell Click</option>
                            <option value="_scroll">Vertical Scroll</option>
                            <option value="_scroll_lr">Horizontal Scroll</option>
                            <option value="button_action">Button Action</option>
                          </select>
                        </td>

                        {/* Settings */}
                        <td className={
                          'bg-grey-200 px-3 text-gray-800 text-md ' +
                          (binding.command === 'dwell_click' || binding.command === 'button_action'
                            ? 'border border-gray-200'
                            : 'border-x border-gray-200')
                        }>
                          {binding.command === 'dwell_click' ? (
                            <div className="w-full h-full flex flex-row ">
                              {/* BUTTON */}
                              <div className='w-full flex-0 flex flex-col items-center'>
                                <th className="w-full px-4 text-center text-sm">Button</th>
                                <select className='w-full py-1 text-sm'
                                  value={binding.setting1}
                                  onChange={(e) => handleSettingsChange(index, 1, e.target.value)}
                                >
                                  <option value={1}>Left Mouse Click</option>
                                  <option value={2}>Right Mouse Click</option>
                                </select>
                              </div>

                              {/* CANCEL_THS */}
                              <div className='w-full flex-0 flex flex-col items-center'>
                                <th className="w-full px-4 text-center text-sm">Cancel Speed</th>
                                <select className='w-5/6 py-1 text-sm'
                                  value={binding.setting2}
                                  onChange={(e) => handleSettingsChange(index, 2, e.target.value)}
                                >
                                  <option value={1}>1</option>
                                  <option value={2}>2</option>
                                  <option value={3}>3</option>
                                  <option value={4}>4</option>
                                  <option value={5}>5</option>
                                  <option value={6}>6</option>
                                  <option value={7}>7</option>
                                  <option value={8}>8</option>
                                  <option value={9}>9</option>
                                  <option value={10}>10</option>
                                </select>
                              </div>
                            </div>
                          ) : <div className="w-full h-full" />}
                          {binding.command === 'button_action' ? (
                            <div className="w-full h-full flex flex-row">
                              {/* ACTOR */}
                              <div className='w-full px-3 flex-0 flex flex-col items-center'>
                                <th className="w-full px-1 text-center text-sm">Actor</th>
                                <select className='w-5/6 py-1 text-sm'
                                  value={binding.setting1}
                                  onChange={(e) => handleSettingsChange(index, 1, e.target.value)}
                                >
                                  <option selected="selected" value={0}>Mouse</option>
                                  <option value={1}>Keyboard</option>
                                </select>
                              </div>

                              {/* ACTION */}
                              <div className='w-full px-3 flex-0 flex flex-col items-center'>
                                <th className="w-full px-1 text-center text-sm">Action</th>
                                <select className='w-5/6 py-1 text-sm'
                                  value={binding.setting2}
                                  onChange={(e) => handleSettingsChange(index, 2, e.target.value)}
                                >
                                  <option value={'tap'}>Tap</option>
                                  <option value={'double_tap'}>Double Tap</option>
                                  <option value={'press'}>Press and Hold</option>
                                  <option value={'release'}>Release</option>
                                  <option value={'toggle'}>Toggle</option>
                                  <option value={'hold_until_idle'}>Hold Until Idle</option>
                                  <option value={'hold_until_sig_motion'}>Hold Until Significant Motion</option>=
                                </select>
                              </div>
                              {/* BUTTON */}
                              {binding.setting1 === "1" ? (
                                <div className='px-3 w-full flex-0 flex flex-col items-center'>
                                  <th className="w-full px-1 text-center text-sm">Button</th>
                                  <select className='w-5/6 py-1 text-sm'
                                    value={binding.setting3}
                                    onChange={(e) => handleSettingsChange(index, 3, e.target.value)}>
                                    <KeyOptions />
                                  </select>
                                </div>
                              ) : (
                                <div className='px-3 w-full flex-0 flex flex-col items-center'>
                                  <th className="w-full px-1 text-center text-sm">Button</th>
                                  <select className='w-5/6 py-1 text-sm'
                                    value={binding.setting3}
                                    onChange={(e) => handleSettingsChange(index, 3, e.target.value)}>
                                    <option value={1}>Left Mouse Click</option>
                                    <option value={2}>Right Mouse Click</option>
                                  </select>
                                </div>
                              )}
                            </div>
                          ) : <div className="w-full h-full" />}
                        </td>

                        {/* Description Cell */}
                        <td className="bg-white px-3 py-2 border border-gray-200 text-gray-800 text-sm overflow-hidden">
                          <div className="max-h-16">
                            {generateDescription(binding)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Button Container */}

              </div>
            )}
          </div>
        );


      }



      const GestureMouseSetting = () => {
        if (!fetchedGestureMouseConfig) {
          return <div>Loading...</div>;
        }
        return (
          <div>
            <hr style={{ borderColor: '#ccc', borderWidth: '1px', margin: '10px 0' }} />

            <MouseOptions config={editedGestureMouseConfig} />
            <hr style={{ borderColor: '#ccc', borderWidth: '1px', margin: '10px 0' }} />

            <GestureOptions config={editedGestureMouseConfig} />
            <hr style={{ borderColor: '#ccc', borderWidth: '1px', margin: '10px 0' }} />

            <BindingsPanel config={editedGestureMouseConfig} mode={"gesture_mouse"} />
            <hr style={{ borderColor: '#ccc', borderWidth: '1px', margin: '10px 0' }} />

          </div>
        );
      }

      const ClickerSetting = () => {
        const [collapsedSections, setCollapsedSections] = useState({});

        if (!fetchedClickerConfig) {
          return <div>Loading...</div>;
        }
        return (
          <div>
            <hr style={{ borderColor: '#ccc', borderWidth: '1px', margin: '10px 0' }} />
            {/* <ClickerOptions config={editedClickerConfig} /> */}
            <ClickerOptions
              config={editedClickerConfig}
              collapsedSections={collapsedSections}
              setCollapsedSections={setCollapsedSections}
            />
            <hr style={{ borderColor: '#ccc', borderWidth: '1px', margin: '10px 0' }} />
            <BindingsPanel config={editedClickerConfig} mode="clicker" />
            <hr style={{ borderColor: '#ccc', borderWidth: '1px', margin: '10px 0' }} />

          </div>
        );
      }

      const TVRemoteSetting = () => {
        if (!fetchedTVRemoteConfig) {
          return <div>Loading...</div>;
        }
        return (
          <div>
            <hr style={{ borderColor: '#ccc', borderWidth: '1px', margin: '10px 0' }} />

            <TVRemoteOptions config={editedTVRemoteConfig} />
            <hr style={{ borderColor: '#ccc', borderWidth: '1px', margin: '10px 0' }} />

            <GestureOptions config={editedTVRemoteConfig} />
            <hr style={{ borderColor: '#ccc', borderWidth: '1px', margin: '10px 0' }} />

            <BindingsPanel config={editedGestureMouseConfig} mode={"tv_remote"} />
          </div>
        );
      };

      const PointerSetting = () => {
        //pointer setting
        if (!fetchedPointerConfig) {
          return <div>Loading...</div>;
        }
        return (
          <div>
            <hr style={{ borderColor: '#ccc', borderWidth: '1px', margin: '10px 0' }} />

            <MouseOptions config={editedPointerConfig} />
            <hr style={{ borderColor: '#ccc', borderWidth: '1px', margin: '10px 0' }} />

            <BindingsPanel config={editedPointerConfig} mode={"pointer"} />
            <hr style={{ borderColor: '#ccc', borderWidth: '1px', margin: '10px 0' }} />


          </div>
        );
      }

      return (
        <div style={{ marginBottom: '1rem' }}>
          <button
            onClick={toggleIsExpanded}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              textAlign: 'left',
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            {connection.name}
          </button>
          {isExpanded && (
            <div>
              <h2 style={sectionHeadingStyle}>Operation Mode</h2>
              <Dropdown
                value={operationModeConversion(activeOperationMode)}
                onChange={(e) => handleOperationModeSelection(e.target.value)}
                title=""
                description="Select the operation mode"
                options={[
                  "Gesture Mouse",
                  "TV Remote",
                  "Pointer",
                  "Clicker"
                ]}
              ></Dropdown>
              {activeOperationMode == "gesture_mouse" && <GestureMouseSetting />}
              {activeOperationMode == "clicker" && <ClickerSetting />}
              {activeOperationMode == "tv_remote" && <TVRemoteSetting />}
              {activeOperationMode == "pointer" && <PointerSetting />}
              <ConnectionSpecificSettings connectionConfig={editedConnectionConfig} />
            </div>
          )}
        </div>
      )
    }
    return (
      <div style={sliderContainerStyle}>
        {/* @pratyush uncomment below if needed */}

        <div style={accordionListStyle}>
          {data.map((item, index) => (
            <div key={index}>
              <ConnectionAccordion connection={item}>
                {item.name}
              </ConnectionAccordion>
              {index !== data.length - 1 && <DashedLine style={{ marginBottom: '1rem' }} />}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const accordionListStyle = {
    display: 'grid',
    // gap: '0 rem',
    borderBottom: '1px solid #ccc',
    borderRadius: '4px',
    // padding: '1rem',
  };

  const sliderContainerStyle = {
    margin: '1rem',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
    padding: '1rem',
  };

  const handleSave = async () => {
    console.log(editedGlobalSettings);
    console.log(editedConnectionsSettings);

    const webAppHwUid = editedGlobalSettings["HW_UID"]["value"];

    const hwUidMatch = await fetchAndCompareConfig(webAppHwUid);
    console.log(webAppHwUid);
    console.log(hwUidMatch);
    // const configFile = await fetchConfigFileFromDevice();
    // const configData = JSON.parse(configFile);
    // const deviceHwUid = configData.global_info.HW_UID.value;

    // const hwUidMatch = await fetchAndCompareConfig(webAppHwUid);
    if (!hwUidMatch) {
      console.error("HW_UID does not match with the connected device.");
      return;
    }


    const userId = getCurrentUserId();
    const userCatoDocId = thisDevice.id;
    const userCatoDocRef = doc(db, "users", userId, "userCatos", userCatoDocId);

    

    try {
      const globalConfigUpdate = {
        "global_info": editedGlobalSettings,
      };


      await updateDoc(userCatoDocRef, {
        'device_info.global_config': JSON.stringify(globalConfigUpdate),
        'connections': editedConnectionsSettings,
      });


      console.log("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings: ", error);
    }


    const deviceConfig = {
      "connections": [],
      "global_info": editedGlobalSettings,
    };


    for (let i = 0; i < editedConnectionsSettings.length; i++) {
      let connection = editedConnectionsSettings[i];
      let connectionConfig = JSON.parse(connection["connection_config"]);
      let currentModeConfig = JSON.parse(connection["mode"][connection["current_mode"]]);
      let pushedConnection = {
        ...connectionConfig,
        ...currentModeConfig,
      };
      deviceConfig["connections"].push(pushedConnection);
    };

    try {
      const blob = new Blob([JSON.stringify(deviceConfig)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "config.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log("download new config error: ", error);
    }

    await overwriteConfigFile(deviceConfig);

  };


  if (!thisDevice) {
    return <div>Device not found</div>;
  }
  return (
    <div>
      <div className="ml-90">
        <header className="shrink-0 bg-transparent border-b border-gray-200">
          <div className="ml-0 flex h-16 max-w-7xl items-center justify-between ">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Device Settings
            </h2>
          </div>
        </header>
      </div>

      <GlobalInfoSection />

      <div className="ml-90">
        <header className="shrink-0 bg-transparent border-b border-gray-200">
          <div className="ml-0 flex h-16 max-w-7xl items-center justify-between ">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {/* Interfaces */}
              Connections
            </h2>
          </div>
        </header>
      </div>

      <AccordionList data={connectionsList} />
      <button onClick={handleRegisterInterface}
        style={{
          backgroundColor: '#8B0000', //red
          color: 'white',
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
        }}>
        <span>Add Connection</span>

        {/* <span>+</span> */}
      </button>
      <button onClick={handleSave}
        style={{
          backgroundColor: '#B8860B', //B8860B
          color: 'white',
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
          marginLeft: '10px',
        }}>
        Save
      </button>
    </div>
  );

};
export default Devices;