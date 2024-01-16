import { useParams, useNavigate } from 'react-router-dom';
import BindingsPanel from './Bindings';
import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import debounce from 'lodash.debounce';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { set } from 'lodash';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

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
        <div style={{ width: '30%' }}> 
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

  const [fetchedGlobalSettings, setFetchedGlobalSettings] = useState(null);
  const [editedGlobalSettings, setEditedGlobalSettings] = useState(null);

  const [fetchedConnectionsSettings, setFetchedConnectionsSettings] = useState(null);
  const [editedConnectionsSettings, setEditedConnectionsSettings] = useState(null);
  const [connectionsList, setConnectionsList] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState(null);



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
        setFetchedGlobalSettings(deepCopy(globalSettings));
        setEditedGlobalSettings(deepCopy(globalSettings));
      };
      getGlobalSettings();
      
      const getConnectionsSettings = async () => {
        // make a deep copy of the connections list
        let connectionsList = deepCopy(thisDevice["data"]["connections"]);
        setFetchedConnectionsSettings(connectionsList);
        setEditedConnectionsSettings(connectionsList);
      };
      getConnectionsSettings();
    }
  }, [thisDevice]);

  useEffect(() => {
    if (editedConnectionsSettings) {
      console.log(editedConnectionsSettings);
      console.log('editedConnectionsSettings:', editedConnectionsSettings);
      const getConnectionsList = async () => {
        let connectionsList = [];
        for (let i = 0; i < editedConnectionsSettings.length; i++) {
          let connection = editedConnectionsSettings[i]; // pass the reference to each connection into the list
          console.log(connection);
          connectionsList.push(connection);
        }
        setConnectionsList(connectionsList);
      };
      getConnectionsList();
    }
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

    if (!fetchedGlobalSettings) {
      return <div>Loading...</div>;
    }

    console.log('editedGlobalSettings:', editedGlobalSettings);

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
          console.log('connection:', connection);
          console.log('connection[name]:', connection["name"]);
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
            //console.log('gestureMouseConfig:', gestureMouseConfig)
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
        //console.log('mode:', mode);
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
        console.log(activeOperationMode);
        connection["current_mode"] = activeOperationMode;
      }, [activeOperationMode]);

      useEffect(() => {
        if (editedConnectionConfig) {
          connection["connection_config"] = JSON.stringify(editedConnectionConfig);
        }
      }, [editedConnectionConfig]);

      useEffect(() => {
        if (editedGestureMouseConfig) {
          connection["mode"]["gesture_mouse"] = JSON.stringify(editedGestureMouseConfig);
        }
      }, [editedGestureMouseConfig]);

      useEffect(() => {
        if (editedTVRemoteConfig) {
          connection["mode"]["tv_remote"] = JSON.stringify(editedTVRemoteConfig);
        }
      }, [editedTVRemoteConfig]);

      useEffect(() => {
        if (editedPointerConfig) {
          connection["mode"]["pointer"] = JSON.stringify(editedPointerConfig);
        }
      }, [editedPointerConfig]);

      useEffect(() => {
        if (editedClickerConfig) {
          console.log('editedClickerConfig:', editedClickerConfig);
          connection["mode"]["clicker"] = JSON.stringify(editedClickerConfig);

        }
      }, [editedClickerConfig]);

      /*
      const handleStateChange = (newValue) => {
        if (newValue) {
          console.log(newValue);
          if (newValue["operation_mode"]["value"] === "clicker") {
            setEditedClickerConfig(deepCopy(newValue));
          } else if (newValue["operation_mode"]["value"] === "pointer") {
            setEditedPointerConfig(deepCopy(newValue));
          } else if (newValue["operation_mode"]["value"] === "gesture_mouse") {
            setEditedGestureMouseConfig(deepCopy(newValue));
          } else if (newValue["operation_mode"]["value"] === "tv_remote") {
            setEditedTVRemoteConfig(deepCopy(newValue));
          }
        }
      }
      */

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

            <BindingsPanel config={editedGestureMouseConfig} />
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
            <BindingsPanel config={editedClickerConfig}/>
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

            <BindingsPanel config={editedGestureMouseConfig}/>
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

            <BindingsPanel config={editedPointerConfig}/>
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
    //console.log('data:', data);
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
      
      

      console.log(editedConnectionsSettings);

      
  
      console.log("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings: ", error);
    }

    // now we have to write the editedConnectionsSettings to the device
    console.log('editedGlobalSettings:', editedGlobalSettings);
    console.log('editedConnectionsSettings:', editedConnectionsSettings);

    const deviceConfig = {
      "connections": [],
      "global_info": editedGlobalSettings,
    }

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
     
    // download the device config

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
  };
  



  //console.log('Device:', thisDevice)

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