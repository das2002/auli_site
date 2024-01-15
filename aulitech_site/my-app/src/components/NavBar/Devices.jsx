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

const sectionHeadingStyle = {
  fontSize: '20px',
  marginBottom: '10px',
  fontWeight: 'bold', // Add the fontWeight property
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

  useEffect(() => {
    setSliderValue(value || 0);
  }, [value]);

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  const handleSliderChangeCommitted = (event, newValue) => {
    //console.log('Final Value:', newValue);
    if (onChange) {
      onChange({ target: { value: newValue } }); 
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label htmlFor={sliderLabel}>{`${sliderTitle} (${sliderValue} ${unit})`}</label>
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
      <div style={{ marginTop: '10px' }}>
        {sliderDescription}
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
      // Get the connections list
      const getConnectionsList = async () => {
        let connectionsList = [];
        for (let i = 0; i < thisDevice["data"]["connections"].length; i++) {
          let connection = thisDevice["data"]["connections"][i];
          connectionsList.push(connection);
        }
        setConnectionsList(connectionsList);
      };
      getConnectionsList();

      // Get the connections settings
      const getConnectionsSettings = async () => {
        // make a deep copy of the connections list
        let connectionsList = deepCopy(thisDevice["data"]["connections"]);
        setFetchedConnectionsSettings(connectionsList);
        setEditedConnectionsSettings(connectionsList);
      };
      getConnectionsSettings();
    }
  }, [thisDevice]);



  const GlobalInfoSection = () => {
    if (!fetchedGlobalSettings) {
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
      
        <div style={sliderContainerStyle}>
          <HardwareUIDField hardwareUID={editedGlobalSettings["HW_UID"]["value"]} />
          <div style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>Sleep</h2>
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
          <div style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>Orientation</h2>
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
          <div style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>Calibration</h2>
            <InputSlider
              sliderLabel={'calibrationThreshold'}
              value={editedGlobalSettings["calibration"]["value"]["auto_threshold"]["value"]}
              onChange={(e) => handleGlobalConfigChange(['calibration', 'value', 'auto_threshold', 'value'])(parseFloat(e.target.value))}
              min={0.2}
              max={1.0}
              step={0.01}
              sliderTitle={'Auto-Calibration Threshold'}
              unit={'x'}
              sliderDescription={"movement required (as a scale of mouse>idle_threshold) to fail automatic calibration for gyro drift"}
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
              sliderDescription={"number of samples to wait (at below auto_threshold) required to trigger auto recalibratoion"}
            ></InputSlider>
          </div>
        </div>
      </div>
    )
  };


  const AccordionList = ({ data }) => {
    //console.log('data:', data);
    return (
      <div style={sliderContainerStyle}>
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
    gap: '1rem',
    borderBottom: '1px solid #ccc', // Add bottom border
    borderRadius: '4px',
    padding: '1rem',
  };
  
  const sliderContainerStyle = {
    margin: '1rem',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
    padding: '1rem',
  };

  const ConnectionAccordion = ({ connection }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [fetchedConnectionConfig, setFetchedConnectionConfig] = useState(null);
    const [editedConnectionConfig, setEditedConnectionConfig] = useState(null);
    const [activeOperationMode, setActiveOperationMode] = useState(null);

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
          setEditedConnectionConfig(deepCopy(connectionSettings));
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

    const ConnectionSpecificSettings = () => {
      return (
        <div style={{ maxWidth: '600px', margin: 'auto' }}>
          <h1 style={titleStyle}>Connection Settings</h1>
          <div style={sliderContainerStyle}>
            <InputSlider
              sliderLabel={'screenSizeHeight'}
              value={editedConnectionConfig.screen_size.value.height.value}
              onChange={(e) => handleConnectionConfigChange(['screen_size', 'value', 'height', 'value'])(e.target.value)}
              min={600}
              max={4320}
              step={1}
              sliderTitle={"Screen Size - Height"}
              unit={"px"}
              sliderDescription={"height of interface screen"}
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
              sliderDescription={"width of interface screen"}
            />
          </div>
        </div>
      );
    };

    const MouseOptions = (config) => {
      //(config);
      return (
        <div style={{ maxWidth: '600px', margin: 'auto' }}>
          <h1 style={titleStyle}>Mouse Settings</h1>
          <div style={sliderContainerStyle}>
            <p style={descriptionStyle}>Adjust your mouse settings below:</p>
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
            <Dropdown
              value={config.config.mouse.value.dwell_repeat.value}
              onChange={(e) => handleModeConfigChange(['mouse', 'value', 'dwell_repeat', 'value'], activeOperationMode)(parseBool(e.target.value))}
              title="Dwell Repeat Clicks"
              description="Continued idle causes multiple clicks"
              options={[true, false]}
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
              sliderDescription="size of cursor movement for gesturer indicator"
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
        </div>
      )
    };

    const ClickerOptions = (config) => {
      return (
        <div style={{ maxWidth: '600px', margin: 'auto' }}>
          <h2 style={sectionHeadingStyle}>Clicker Settings</h2>
          <div style={sliderContainerStyle}>
            <p style={descriptionStyle}>Adjust your clicker settings below:</p>
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
        </div>
      );
    };

    const GestureOptions = (config) => {
      return (
        <div style={{ maxWidth: '600px', margin: 'auto' }}>
          <h1 style={titleStyle}>Gesture Settings</h1>
          <div style={sliderContainerStyle}>
            <p style={descriptionStyle}>Adjust your gesture collection settings below:</p>
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
        </div>
      )
    }

    const TVRemoteOptions = (config) => {
      return (
        // give a title for the TV Remote Options
        <div style={{ maxWidth: '600px', margin: 'auto' }}>
          <h1 style={titleStyle}> TV Remote Options </h1>
          <div style={sliderContainerStyle}>
            <Dropdown
              value={config.config.tv_remote.value.await_actions.value}
              onChange={(e) => handleModeConfigChange(['tv_remote', 'value', 'await_actions', 'value'], activeOperationMode)(parseBool(e.target.value))}
              title="Await Actions"
              description="wait for previous action to end before reading a new gesture"
              options={[true, false]}
            />
          </div>
        </div>
  
      );
    };

    const GestureMouseSetting = () => {
      if (!fetchedGestureMouseConfig) {
        return <div>Loading...</div>;
      }
      return (
        <div>
          <MouseOptions config={editedGestureMouseConfig} />
          <GestureOptions config={editedGestureMouseConfig} />
          <BindingsPanel config={editedGestureMouseConfig} />
        </div>
      );
    }

    const ClickerSetting = () => {
      if (!fetchedClickerConfig) {
        return <div>Loading...</div>;
      }
      return (
        <div>
          <ClickerOptions config={editedClickerConfig} />
          <BindingsPanel config={editedClickerConfig} />
        </div>
      );
    }

    const TVRemoteSetting = () => {
      if (!fetchedTVRemoteConfig) {
        return <div>Loading...</div>;
      }
      return (
        <div>
          <TVRemoteOptions config={editedTVRemoteConfig} />
          <GestureOptions config={editedTVRemoteConfig} />
          <BindingsPanel config={editedGestureMouseConfig} />
        </div>
      );
    };

    const PointerSetting = () => {
      if (!fetchedPointerConfig) {
        return <div>Loading...</div>;
      }
      return (
        <div>
          <MouseOptions config={editedPointerConfig} />
          <BindingsPanel config={editedPointerConfig} />
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
            <Dropdown
              value={operationModeConversion(activeOperationMode)}
              onChange={(e) => handleOperationModeSelection(e.target.value)}
              title="Operation Mode"
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

  const handleSave = async () => {
    const userId = getCurrentUserId(); 
    const userCatoDocId = thisDevice.id;
  
    const userCatoDocRef = doc(db, "users", userId, "userCatos", userCatoDocId);
  
    try {
      const globalConfigUpdate = {
        "global_info": editedGlobalSettings,
      };

      // for each connection, update the connection_config
      
      console.log(connectionsList);

      // iterate through the accordion list and update the connectionList connection-by-connection

      console.log(editedConnectionsSettings);

      
      //firebase update
      await updateDoc(userCatoDocRef, {
        'device_info.global_config': JSON.stringify(globalConfigUpdate),
      });
      

      //TODO: write to user device
  
      console.log("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings: ", error);
    }
  };
  


  //console.log('Device:', thisDevice)

  if (!thisDevice) {
    return <div>Device not found</div>;
  }
  return (
    <div>
      <GlobalInfoSection />
      <AccordionList data={connectionsList} />
      {/* Device details and logic */}
      <button onClick={handleRegisterInterface}
        style={{
          backgroundColor: '#8B0000', // Dark red color
          color: 'white',
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
        }}>
        <span>+</span>
      </button>
      <button onClick={handleSave}
        style={{
          backgroundColor: '#B8860B', 
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