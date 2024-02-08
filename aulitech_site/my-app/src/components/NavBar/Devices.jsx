import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../firebase';
import debounce from 'lodash.debounce';
import { collection, getDocs, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { set } from 'lodash';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import { KeyOptions, getKeyOption } from './KeyOptions';
import { fetchAndCompareConfig, overwriteConfigFile, deleteConfigFileIfExists } from './ReplaceConfig';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamicMouseGraphic from '../../images/dynamic_mouse_graphic.png';

import flatImage from './flatImage.png';
import landscapeImage from './landscapeImage.png';
import portraitImage from './portraitImage.png';

import emptystar from './emptyStar.png';
import filledin from './filledStar.png';

import PencilEditIcon from './pencil-edit.svg';

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
  fontSize: '16px',
  marginBottom: '10px',
  fontWeight: 'bold',
  backgroundColor: '#fcdc6d',
  borderRadius: '10px',
  padding: '5px 15px',
  display: 'inline-block',
  boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
  marginLeft: '20px'
};

const CheckboxOption = ({ checked, onChange, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', marginLeft: '40px' }}>
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
    <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
      <h2 style={{ fontSize: '16px', marginRight: '10px' }}><strong>Serial Number:</strong></h2>
      <span
        style={{
          // display: 'inline-block',
          // padding: '5px 10px',
          // fontSize: '14px',
          // background: '#f2f2f2', 
          // borderRadius: '5px',
          marginRight: '20px'
        }}
      >
        {hardwareUID}
      </span>
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
    if (value === 'true' || value === 'on') {
      return 'true';
    } else if (value === 'false' || value === 'off') {
      return 'false';
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
    setInputValue(newValue);
  };

  const handleSliderChangeCommitted = (event, newValue) => {
    if (onChange) {
      onChange({ target: { value: newValue } });
    }
  };

  return (
    <div style={{ marginBottom: '10px', marginLeft: '40px' }}>
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
          <label
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            htmlFor="dropdown"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
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

        {isHovered && (
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
        )}
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
  const editButtonRef = useRef(null);
  const inputRef = useRef(null);

  const [originalConnectionName, setOriginalConnectionName] = useState('');

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editedConnectionName, setEditedConnectionName] = useState('');
  const [currentEditingConnection, setCurrentEditingConnection] = useState(null);
  const popupRef = useRef();

  const [editingConnectionIndex, setEditingConnectionIndex] = useState(null);
  const [temporaryConnectionName, setTemporaryConnectionName] = useState('');

  const startEditing = (connection, index) => {
    if (connection.name === "Default Connection") {
      console.log("Editing default connection is not allowed.");
      return;
    }
    setOriginalConnectionName(connection.name);
    setTemporaryConnectionName(connection.name);
    setEditingConnectionIndex(index);
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target) &&
      editButtonRef.current && !editButtonRef.current.contains(event.target)) {
      setTemporaryConnectionName(originalConnectionName);
      setEditingConnectionIndex(null);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [originalConnectionName]);


  const closeEditPopup = () => {
    setIsEditPopupOpen(false);
  };

  const handleSaveEditedName = async () => {
    if (editingConnectionIndex === null) {
      console.error("No connection selected for editing");
      return;
    }

    console.log("Saving edited name for index:", editingConnectionIndex);

    const updatedConnections = [...connectionsList];
    updatedConnections[editingConnectionIndex] = {
      ...updatedConnections[editingConnectionIndex],
      name: temporaryConnectionName,
    };

    setConnectionsList(updatedConnections);
    setEditedConnectionsSettings(updatedConnections);

    setEditingConnectionIndex(null);
    setTemporaryConnectionName('');

    try {
      const userId = getCurrentUserId();
      const userCatoDocRef = doc(db, "users", userId, "userCatos", thisDevice.id);

      await updateDoc(userCatoDocRef, {
        connections: updatedConnections
      });

      console.log("Connection name updated successfully in Firestore");
      closeEditPopup();
    } catch (error) {
      console.error("Error updating connection name in Firestore: ", error);
    }

  };




  const { deviceName } = useParams();
  const navigate = useNavigate();

  const [isUniversalSettingsExpanded, setIsUniversalSettingsExpanded] = useState(true);
  const [isConnectionsExpanded, setIsConnectionsExpanded] = useState(true);

  const toggleUniversalSettings = () => {
    setIsUniversalSettingsExpanded(!isUniversalSettingsExpanded);
  };

  const toggleConnections = () => {
    setIsConnectionsExpanded(!isConnectionsExpanded);
  };


  // Find the specific device
  const thisDevice = devices.find(device => device.data.device_info.device_nickname === deviceName);
  // Check if the device was found

  const handleRegisterInterface = () => {
    navigate(`/devices/${deviceName}/register-interface`);
  };

  const DeviceNameField = ({ intialDeviceName, onNameChange }) => {
    const [editedDeviceName, setEditedDeviceName] = useState(intialDeviceName);

    const handleNameChange = (event) => {
      setEditedDeviceName(event.target.value);
    };

    const handleNameCommit = (event) => {
      onNameChange(event.target.value);
    }

    return (
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'left', justifyContent: 'left' }}>
        <h2 style={{ fontSize: '16px', marginRight: '10px' }}><strong>Device Name:</strong></h2>
        <input
          value={editedDeviceName}
          onChange={handleNameChange}
          onBlur={handleNameCommit}
          style={{
            borderColor: 'black',
            borderWidth: 1,
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '14px',
          }}
          type="text"
          placeholder="Device Name"
        />
      </div>
    );
  };

  const [editedGlobalSettings, setEditedGlobalSettings] = useState(null);
  const [editedConnectionsSettings, setEditedConnectionsSettings] = useState(null);
  const [connectionsList, setConnectionsList] = useState([]);

  const makePrimary = async (primaryConnection) => {
    // update local variables
    const updatedConnections = [primaryConnection, ...connectionsList.filter(conn => conn.name !== primaryConnection.name)];

    setConnectionsList(updatedConnections);
    setEditedConnectionsSettings(updatedConnections);

    try {
      const userId = getCurrentUserId();
      const userCatoDocRef = doc(db, "users", userId, "userCatos", thisDevice.id);

      await updateDoc(userCatoDocRef, {
        connections: updatedConnections.map(connection => ({
          ...connection,
        }))
      });
      console.log("Connections order updated successfully in Firestore");
    } catch (error) {
      console.error("Error updating connections order in Firestore: ", error);
    }
  };


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

  const handleConnectionDeletion = async (connectionName) => {
    if (!thisDevice || !connectionName) {
      console.error("Device or connection name not provided");
      return;
    }

    // Prompt the user for confirmation
    const confirmed = window.confirm(
      "Are you sure you want to delete the connection? Deleting this connection will remove it from your cloud database. Please ensure to Save after deleting to ensure synchronization."
    );

    if (!confirmed) {
      return;
    }

    try {
      const userId = getCurrentUserId();
      const userCatoDocRef = doc(db, "users", userId, "userCatos", thisDevice.id);

      //find connection to delete
      const updatedConnections = editedConnectionsSettings.filter(conn => conn.name !== connectionName);

      //firebase
      await updateDoc(userCatoDocRef, {
        'connections': updatedConnections

      });

      //local states
      setEditedConnectionsSettings(updatedConnections);
      setConnectionsList(updatedConnections);

      console.log("Connection deleted successfully");
    } catch (error) {
      console.error("Error deleting connection: ", error);
    }
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

    const handleDeviceNameChange = (value) => {
      const newEditedGlobalSettings = deepCopy(editedGlobalSettings);
      newEditedGlobalSettings["name"]["value"] = value;
      setEditedGlobalSettings(newEditedGlobalSettings);
    }

    const OrientationSection = () => {
      const [selectedOrientation, setSelectedOrientation] = useState('');

      useEffect(() => {
        const fetchedOrientation = editedGlobalSettings.orientation.value;
        const orientationKey = Object.keys(orientations).find(key =>
          JSON.stringify(orientations[key].config) === JSON.stringify(fetchedOrientation)
        );
        setSelectedOrientation(orientationKey);
      }, [editedGlobalSettings.orientation.value]);

      // const orientations = {
      //   flat: { config: { front: "-x", bottom: "+z", left: "+y" }, image: flatImage },
      //   landscape: { config: { front: "-x", bottom: "+y", left: "-z" }, image: landscapeImage },
      //   portrait: { config: { front: "+y", bottom: "+x", left: "-z" }, image: portraitImage }
      // };
      const orientations = {
        flat: {
          config: {
            front: {
              label: "front",
              value: "-x"
            },
            bottom: {
              label: "bottom",
              value: "+z"
            },
            left: {
              label: "left",
              value: "+y"
            }
          },
          image: flatImage
        },
        landscape: {
          config: {
            front: {
              label: "front",
              value: "-x"
            },
            bottom: {
              label: "bottom",
              value: "+y"
            },
            left: {
              label: "left",
              value: "-z"
            }
          },
          image: landscapeImage
        },
        portrait: {
          config: {
            front: {
              label: "front",
              value: "+y"
            },
            bottom: {
              label: "bottom",
              value: "+x"
            },
            left: {
              label: "left",
              value: "-z"
            }
          },
          image: portraitImage
        },

      };

      const handleOrientationSelect = (orientationKey) => {
        setSelectedOrientation(orientationKey);
        const orientationConfig = orientations[orientationKey].config;
        const newEditedGlobalSettings = deepCopy(editedGlobalSettings);
        newEditedGlobalSettings.orientation.value = orientationConfig;
        setEditedGlobalSettings(newEditedGlobalSettings);
      };

      const darkerYellow = '#f9da6b';

      return (
        <div>
          <h2 style={sectionHeadingDynamicStyle(isOrientationExpanded)} onClick={toggleOrientationSection}>
            Orientation
          </h2>
          {isOrientationExpanded && (
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginLeft: '40px' }}>
              {Object.entries(orientations).map(([key, { image }]) => (
                <div
                  key={key}
                  onClick={() => handleOrientationSelect(key)}
                  style={{ margin: '10px', cursor: 'pointer' }}
                >
                  <img src={image} alt={key} />
                  <p style={{
                    backgroundColor: selectedOrientation === key ? darkerYellow : 'transparent',
                    padding: selectedOrientation === key ? '5px' : '0'
                  }}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };


    return (
      <div>
        <div style={sliderContainerStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <DeviceNameField intialDeviceName={editedGlobalSettings["name"]["value"]} onNameChange={handleDeviceNameChange} />
            </div>
            <div>
              <HardwareUIDField hardwareUID={editedGlobalSettings["HW_UID"]["value"]} />
            </div>
            {/* <div>
              <button onClick={handleDeviceDelete} style={{ backgroundColor: '#8B0000', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>
                Delete Device
              </button>
            </div> */}
          </div>
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
                unit={'degrees per second'}
                sliderDescription={'Movement level below which Cato starts counting towards sleep'}
              />
            </div>
            // </div>
          )}

          <hr style={{ borderColor: '#ccc', borderWidth: '1px', margin: '10px 0' }} />
          <OrientationSection />

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

    const ConnectionAccordion = ({ connection, onDelete, makePrimary, index }) => {
      // const ConnectionAccordion = ({ connection, onDelete }) => {
      const [isExpanded, setIsExpanded] = useState(false);
      const [collapsedSections, setCollapsedSections] = useState({});

      const isDefaultConnection = connection.name === "Default Connection";

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
        if (value == "Gesture Mouse") {
          setActiveOperationMode("gesture_mouse");
        } else if (value == "TV Remote") {
          setActiveOperationMode("tv_remote");
        } else if (value == "Pointer") {
          setActiveOperationMode("pointer");
        } else if (value == "Clicker") {
          setActiveOperationMode("clicker");
        } else if (value == "Select Operation Mode") {
          setActiveOperationMode("practice");
        }
      }

      const operationModeConversion = (mode) => {
        if (mode == "gesture_mouse") {
          return "Gesture Mouse";
        } else if (mode == "tv_remote") {
          return "TV Remote";
        } else if (mode == "pointer") {
          return "Pointer";
        } else if (mode == "clicker") {
          return "Clicker";
        } else if (mode == "practice") {
          return "Select Operation Mode";
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
          if (mode == "gesture_mouse") {
            const newEditedGestureMouseConfig = deepCopy(editedGestureMouseConfig);
            let currentConfig = newEditedGestureMouseConfig;
            for (let i = 0; i < keyList.length - 1; i++) {
              currentConfig = currentConfig[keyList[i]];
            }
            currentConfig[keyList[keyList.length - 1]] = value;
            setEditedGestureMouseConfig(newEditedGestureMouseConfig);
          } else if (mode == "tv_remote") {
            const newEditedTVRemoteConfig = deepCopy(editedTVRemoteConfig);
            let currentConfig = newEditedTVRemoteConfig;
            for (let i = 0; i < keyList.length - 1; i++) {
              currentConfig = currentConfig[keyList[i]];
            }
            currentConfig[keyList[keyList.length - 1]] = value;
            setEditedTVRemoteConfig(newEditedTVRemoteConfig);
          } else if (mode == "pointer") {
            const newEditedPointerConfig = deepCopy(editedPointerConfig);
            let currentConfig = newEditedPointerConfig;
            for (let i = 0; i < keyList.length - 1; i++) {
              currentConfig = currentConfig[keyList[i]];
            }
            currentConfig[keyList[keyList.length - 1]] = value;
            setEditedPointerConfig(newEditedPointerConfig);
          } else if (mode == "clicker") {
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
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                marginBottom: '10px',
                marginLeft: '20px'
              }}
            >Screen Size</button>
            {!collapsedSections['connectionSettings'] && (
              <div>
                <InputSlider
                  sliderLabel={'screenSizeHeight'}
                  value={editedConnectionConfig.screen_size.value.height.value}
                  onChange={(e) => handleConnectionConfigChange(['screen_size', 'value', 'height', 'value'])(e.target.value)}
                  min={600}
                  max={4320}
                  step={1}
                  sliderTitle={"Height"}
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
                  sliderTitle={"Width"}
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
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                marginBottom: '10px',
                marginLeft: '20px'
              }}
            >
              Mouse Settings</button>
            {!isCollapsed && (
              <div>
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

                <div>
                  <h3 style={{ marginLeft: '40px' }}>Dynamic Mouse:</h3>
                  <div style={{ marginLeft: '80px' }}>
                    <h3>User Speed:</h3>
                    <div style={{ marginLeft: '0px' }}>
                      <InputSlider
                        sliderLabel={'dynamicMouseInputSlowMovement'}
                        value={config.config.mouse.value.dynamic_mouse.value.input.value.slow.value}
                        onChange={(e) => handleModeConfigChange(['mouse', 'value', 'dynamic_mouse', 'value', 'input', 'value', 'slow', 'value'], activeOperationMode)(parseInt(e.target.value))}
                        min={0}
                        max={400}
                        step={1}
                        sliderTitle="Slow Movement"
                        unit={"degrees/second"}
                        sliderDescription="Rotation speed floor below which scale remains constant."
                      />
                      <InputSlider
                        sliderLabel={'dynamicMouseInputFastMovement'}
                        value={config.config.mouse.value.dynamic_mouse.value.input.value.fast.value}
                        onChange={(e) => handleModeConfigChange(['mouse', 'value', 'dynamic_mouse', 'value', 'input', 'value', 'fast', 'value'], activeOperationMode)(parseInt(e.target.value))}
                        min={0}
                        max={500}
                        step={1}
                        sliderTitle="Fast Movement"
                        unit={"degrees/second"}
                        sliderDescription="Rotation speed ceiling above which scale remains constant."
                      />
                    </div>
                  </div>
                  <div style={{ marginLeft: '80px' }}>
                    <h3>Cursor Speed:</h3>
                    <div style={{ marginLeft: '0px' }}>
                      <InputSlider
                        sliderLabel={'dynamicMouseOutputSlowMovement'}
                        value={config.config.mouse.value.dynamic_mouse.value.output.value.slow.value}
                        onChange={(e) => handleModeConfigChange(['mouse', 'value', 'dynamic_mouse', 'value', 'output', 'value', 'slow', 'value'], activeOperationMode)(parseFloat(e.target.value))}
                        min={0.1}
                        max={2.0}
                        step={0.1}
                        sliderTitle="Slow Movement"
                        unit={""}
                        sliderDescription="Scale factor at (and below) slowest input speed."
                      />
                      <InputSlider
                        sliderLabel={'dynamicMouseOutputFastMovement'}
                        value={config.config.mouse.value.dynamic_mouse.value.output.value.fast.value}
                        onChange={(e) => handleModeConfigChange(['mouse', 'value', 'dynamic_mouse', 'value', 'output', 'value', 'fast', 'value'], activeOperationMode)(parseFloat(e.target.value))}
                        min={1.0}
                        max={6.0}
                        step={0.1}
                        sliderTitle="Fast Movement"
                        unit={""}
                        sliderDescription="Scale factor at (and above) fastest input speed."
                      />
                    </div>
                  </div>
                  <div style={{ marginLeft: '120px' }}>
                  <img src={dynamicMouseGraphic} alt="Dynamic Mouse Graph" style={{ width: '75%', marginTop: '20px', marginBottom: '30px' }} />
                </div>
                </div>





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
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                marginBottom: '10px',
                marginLeft: '20px'
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
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                marginBottom: '10px',
                marginLeft: '20px'

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
              onChange={(e) => handleModeConfigChange(['tv_remote', 'value', 'await_actions', 'value'], activeOperationMode)((e.target.checked))}
              title="Await Actions"
              description="Wait for previous action to end before reading a new gesture"
            />
          </div>
          // </div>

        );
      };

      const BindingsPanel = ({ config, mode }) => {
        // const [isBindingsExpanded, setIsBindingsExpanded] = useState(true);
        // const toggleBindings = () => {
        //   setIsBindingsExpanded(!isBindingsExpanded);
        // };
        const [isExpanded, setIsExpanded] = useState(true);
        const toggleExpanded = () => {
          setIsExpanded(!isExpanded);
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
              if (binding.args[0] && binding.args[1]) {
                return `Moves cursor and taps ${buttonMapping(binding.args[0])} on dwell, tilts at speed ${binding.args[1]} to cancel.`;
              }
              return "Moves cursor and taps on dwell, tilt to cancel.";
            case "_scroll":
              return "Freezes cursor, look up/down to scroll, look left/right to cancel.";
            case "_scroll_lr":
              return "Freezes cursor, look up/down to scroll horizontally, look left/right to cancel.";
            case "button_action":
              return `Cato ${actionMapping(binding.args[1])} the ${actorMapping(binding.args[0])} on ${buttonMapping(binding.args[2])}.`;
            // if (binding.args[0] && binding.args[1] && binding.args[2]) {
            //   return `Button Action: ${actorMapping(binding.args[0])} ${actionMapping(binding.args[1])} on ${buttonMapping(binding.args[2])}.`;
            // }
            // return "Performs a specified action.";
            default:
              return "Unknown command.";
          }
        }
        function actorMapping(actor) {
          return actor == "0" ? "Mouse" : "Keyboard";
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
          if (button == "1") return "Left Click";
          if (button == "2") return "Right Click";
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
          fontSize: '16px',
          fontWeight: 'bold',
          border: 'none',
          cursor: 'pointer',
          outline: 'none',
          width: 'fit-content',
          marginBottom: '10px',
          marginLeft: '20px',
        };
        const handleCommandChange = (index, value) => {
          let updatedBindings = [...config["bindings"]["value"]];
          let currentBinding = updatedBindings[index];

          // Set default settings only when the command changes for the first time
          if (currentBinding.command !== value) {
            switch (value) {
              case 'dwell_click':
                updatedBindings[index]["args"][0] = "1";
                updatedBindings[index]["args"][1] = "2";
                updatedBindings[index]["args"][2] = '';
                break;
              case 'button_action':
                updatedBindings[index]["args"][0] = "0";
                updatedBindings[index]["args"][1] = 'tap';
                updatedBindings[index]["args"][2] = "1";
                break;
              default:
                // Reset settings for other commands, if necessary
                updatedBindings[index]["args"][0] = '';
                updatedBindings[index]["args"][1] = '';
                updatedBindings[index]["args"][2] = '';
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

          if (currentBinding.command == 'button_action') {
            if (settingNumber == 0) {  // If the actor is being changed
              // Set defaults based on the new actor value
              currentBinding.args[1] = 'tap'; // Default action remains the same
              currentBinding.args[2] = (value == '0') ? '1' : '4'; // Default button based on actor
            }
          }
          currentBinding["args"][settingNumber] = value;

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
        let gesturesList;
        let bindingsSettings;
        if (mode === "clicker") {
          gesturesList = ['None', 'Single', 'Double', 'Triple'];
          bindingsSettings = config.bindings.value; //correct way to do this?
        } else {
          gesturesList = [
            'None',
            'Nod Up',
            'Nod Down',
            'Nod Right',
            'Nod Left',
            'Tilt Right',
            'Tilt Left'
          ];
          bindingsSettings = config.bindings.value;
        }

        const toggleSection = (sectionKey) => {
          setCollapsedSections((prevSections) => ({
            ...prevSections,
            [sectionKey]: !prevSections[sectionKey],
          }));
        };

        return (
          <div className='w-16/12 flex flex-col'>
            <div className='flex justify-between items-center mb-10' style={{ marginLeft: '20px', marginRight: '20px' }}>
              <button
                onClick={toggleExpanded}
                style={{
                  backgroundColor: isExpanded ? '#fcdc6d' : '#1A202C',
                  color: isExpanded ? '#000000' : '#FFFFFF',
                  borderRadius: '10px',
                  padding: '5px 15px',
                  boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {mode === "clicker" ? "Taps" : "Bindings"}
              </button>
              <a
                href="https://youtu.be/aiT06Bs-OH0"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#0000EE',
                }}
              >
                Tutorial Video
              </a>
            </div>
            {/* {!collapsedSections['bindingsPanel'] && ( */}
            {isExpanded && (
              <div style={{ marginLeft: '40px' }}>
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
                    {bindingsSettings.map((binding, index) => {
                      console.log(binding);
                      console.log(index);
                      //if row isn't empty (for clicker):
                      if (gesturesList[index] && index != 0) { //temporary solution for the first item being ignored
                        return (
                          <tr key={index} className="max-h-16 h-16">

                            <td className="bg-white px-3 py-4 border border-gray-200 text-gray-800 text-md">
                              {gesturesList[index]}
                            </td>

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

                            <td className={
                              'bg-grey-200 px-3 text-gray-800 text-md ' +
                              (binding.command === 'dwell_click' || binding.command === 'button_action'
                                ? 'border border-gray-200'
                                : 'border-x border-gray-200')
                            }>
                              {binding.command === 'dwell_click' ? (
                                <div className="w-full h-full flex flex-row ">
                                  <div className='w-full flex-0 flex flex-col items-center'>
                                    <th className="w-full px-4 text-center text-sm">Button</th>
                                    <select className='w-full py-1 text-sm'
                                      value={binding.args[0]}
                                      onChange={(e) => handleSettingsChange(index, 0, e.target.value)}
                                    >
                                      <option value={1}>Left Mouse Click</option>
                                      <option value={2}>Right Mouse Click</option>
                                    </select>
                                  </div>

                                  <div className='w-full flex-0 flex flex-col items-center'>
                                    <th className="w-full px-4 text-center text-sm">Cancel Speed</th>
                                    <select className='w-5/6 py-1 text-sm'
                                      value={binding.args[1]}
                                      onChange={(e) => handleSettingsChange(index, 1, e.target.value)}
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
                                      value={binding.args[0]}
                                      onChange={(e) => handleSettingsChange(index, 0, e.target.value)}
                                    >
                                      <option selected="selected" value={0}>Mouse</option>
                                      <option value={1}>Keyboard</option>
                                    </select>
                                  </div>

                                  {/* ACTION */}
                                  <div className='w-full px-3 flex-0 flex flex-col items-center'>
                                    <th className="w-full px-1 text-center text-sm">Action</th>
                                    <select className='w-5/6 py-1 text-sm'
                                      value={binding.args[1]}
                                      onChange={(e) => handleSettingsChange(index, 1, e.target.value)}
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
                                  {binding.args[0] == "1" ? (
                                    <div className='px-3 w-full flex-0 flex flex-col items-center'>
                                      <th className="w-full px-1 text-center text-sm">Button</th>
                                      <select className='w-5/6 py-1 text-sm'
                                        value={binding.args[2]}
                                        onChange={(e) => handleSettingsChange(index, 2, e.target.value)}>
                                        <KeyOptions />
                                      </select>
                                    </div>
                                  ) : (
                                    <div className='px-3 w-full flex-0 flex flex-col items-center'>
                                      <th className="w-full px-1 text-center text-sm">Button</th>
                                      <select className='w-5/6 py-1 text-sm'
                                        value={binding.args[2]}
                                        onChange={(e) => handleSettingsChange(index, 2, e.target.value)}>
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

                        );
                      }
                      return null; // Do not render anything for empty gestures
                    })}
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

            <BindingsPanel config={editedTVRemoteConfig} mode={"tv_remote"} />
            <hr style={{ borderColor: '#ccc', borderWidth: '1px', margin: '10px 0' }} />

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
          </div>
        );
      }

      // const handleConnectionDeletion = async () => {
      /*
      const userId = getCurrentUserId();
      const userCatoDocId = thisDevice.id;
      const userCatoDocRef = doc(db, "users", userId, "userCatos", userCatoDocId);

      try {
        await updateDoc(userCatoDocRef, {
          'connections': arrayRemove(editedConnectionConfig),
        });
        console.log("Connection deleted successfully");
      } catch (error) {
        console.error("Error deleting connection: ", error);
      }
      */

      // }

      return (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {editingConnectionIndex === index ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <input
                  ref={inputRef}
                  autoFocus
                  type="text"
                  value={temporaryConnectionName}
                  onChange={(e) => setTemporaryConnectionName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveEditedName(index);
                    }
                  }}
                  style={{
                    fontSize: '16px',
                    padding: '10px',
                    marginRight: '10px',
                  }}
                />
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                {/* <strong style={{ marginRight: '10px' }}>
                  {connection.name}
                </strong> */}
                <button
                  onClick={toggleIsExpanded}
                  style={{
                    padding: '10px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                >
                  <strong>{connection.name}</strong>
                </button>
                {connection.name !== "Default Connection" && (
                  <button ref={editButtonRef} onClick={() => startEditing(connection, index)}>
                    <img src={PencilEditIcon} alt="Edit" style={{ width: '16px', height: '16px' }} />
                  </button>
                )}
              </div>
            )}

            <div style={{ display: 'flex' }}>
              <button
                onClick={() => makePrimary(connection)}
                style={{
                  cursor: 'pointer',
                  marginRight: '16px',
                }}
                aria-label="Make Primary"
              >
                <img
                  src={index === 0 ? filledin : emptystar}
                  alt="Star Icon"
                  style={{ width: '20px', height: '20px' }}
                />
              </button>

              {!isDefaultConnection && (
                <button
                  onClick={() => onDelete(connection.name)}
                  style={{
                    backgroundColor: '#8B0000',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '10px',
                    fontSize: '16px',
                    cursor: 'pointer',
                  }}
                >
                  Delete Connection
                </button>
              )}
            </div>
          </div>


          {isExpanded && (
            <div>
              <h2 style={sectionHeadingStyle}>
                Operation Mode
              </h2>
              <div style={{ marginLeft: '40px' }}>
                <Dropdown
                  value={operationModeConversion(activeOperationMode)}
                  onChange={(e) => handleOperationModeSelection(e.target.value)}
                  title=""
                  description="Select the operation mode"
                  options={[
                    "Select Operation Mode",
                    "Gesture Mouse",
                    "TV Remote",
                    "Pointer",
                    "Clicker"
                  ]}
                ></Dropdown>
              </div>
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
        <div style={accordionListStyle}>
          {data.map((item, index) => (
            <div key={index}>
              <ConnectionAccordion
                connection={item}
                onDelete={handleConnectionDeletion} //delete connections
                makePrimary={makePrimary}
                index={index}
              >
                {item.name}
              </ConnectionAccordion>
              {index !== data.length - 1 && <DashedLine />}
            </div>
          ))}
          <DashedLine />
          <div style={{ marginBottom: '10px' }}>
            <button onClick={handleRegisterInterface}
              style={{
                backgroundColor: '#8B0000',
                color: 'white',
                padding: '10px',
                fontSize: '16px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-block',
                margin: '10px auto',
                maxWidth: '200px',
              }}>
              Add Connection
            </button>

          </div>
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

    const webAppHwUid = editedGlobalSettings["HW_UID"]["value"];

    // const directoryHandle = await getDirectoryHandle();

    let calibratedWithFirebase = false;


    const hwUidMatch = await fetchAndCompareConfig(webAppHwUid);
    if (!hwUidMatch) {
      console.error("HW_UID does not match with the connected device.");
      // create a prompt to inform the user that the HW_UID does not match and that if they press continue, they will only be editing the web settings
      const confirmed = window.confirm("The HW_UID does not match with the connected device. If you continue, you will only be editing the web settings. Do you want to continue?");
      if (!confirmed) {
        return;
      } else {
        calibratedWithFirebase = false;
      }
    }



    const userId = getCurrentUserId();
    const userCatoDocId = thisDevice.id;
    const userCatoDocRef = doc(db, "users", userId, "userCatos", userCatoDocId);

    try {
      const globalConfigUpdate = {
        "global_info": editedGlobalSettings,
      };

      if (hwUidMatch) {
        await updateDoc(userCatoDocRef, {
          'device_info.device_nickname': editedGlobalSettings["name"]["value"],
          'device_info.global_config': JSON.stringify(globalConfigUpdate),
          'connections': editedConnectionsSettings,
        });
      } else {
        await updateDoc(userCatoDocRef, {
          'device_info.device_nickname': editedGlobalSettings["name"]["value"],
          'device_info.global_config': JSON.stringify(globalConfigUpdate),
          'connections': editedConnectionsSettings,
          'device_info.calibrated': calibratedWithFirebase,
        });
      }

      console.log("Web settings updated successfully");

      toast.success('Web settings updated successfully', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (error) {
      console.error("Error updating web settings: ", error);
      toast.error("Error updating web settings. Aborting save operation.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (hwUidMatch) {
      const deviceConfig = {
        "connections": [],
        "global_info": editedGlobalSettings,
      };

      for (let i = 0; i < editedConnectionsSettings.length; i++) {
        let connection = editedConnectionsSettings[i];
        let connectionConfig = JSON.parse(connection["connection_config"]);
        let currentModeConfig = null;
        if (connection["current_mode"] === "practice") {
          currentModeConfig = JSON.parse(thisDevice["data"]["device_info"]["practice_config"]);
        } else {
          currentModeConfig = JSON.parse(connection["mode"][connection["current_mode"]]);
        }

        connectionConfig["connection_name"]["value"] = connection.name;

        let pushedConnection = {
          ...connectionConfig,
          ...currentModeConfig,
        };
        deviceConfig["connections"].push(pushedConnection);
      };
      const overwriteSuccess = await overwriteConfigFile(deviceConfig);

      if (overwriteSuccess) {
        toast.success('Device settings updated successfully', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        calibratedWithFirebase = true;
      } else {
        toast.error("Error updating device settings. Device not in sync with web.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        calibratedWithFirebase = false;
      };
      await updateDoc(userCatoDocRef, {
        'device_info.calibrated': calibratedWithFirebase,
      });
    };
    const newDeviceName = editedGlobalSettings["name"]["value"];

    navigate(`/devices/${newDeviceName}`); // is this the correct order?
    window.location.reload(); //TODO: change later for permission?


  };

  if (!thisDevice) {
    return (
      <div className="ml-90">
        <header
          className="shrink-0 bg-transparent border-b border-gray-200"
          onClick={toggleUniversalSettings}
          style={{ cursor: 'pointer' }}
        >
          <div className="flex h-16 max-w-7xl items-center justify-between">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Device Settings
            </h2>
          </div>
        </header>
        <div className="mt-4 ml-4">
          <p className="text-lg text-gray-700">
            This device is not registered yet.
          </p>
          <p className="text-lg text-gray-700 mt-6">
            Likely reasons you're here:
            <ul className="list-disc ml-5">
              <li>You entered the URL incorrectly</li>
              <li>You have a bookmark to a device that has since been renamed</li>
            </ul>
          </p>
        </div>
      </div>
    );
  }

  const handleDeviceDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your device? All associated data will be deleted.");
    if (!confirmed) {
      return;
    }

    // delete the device from the database
    if (thisDevice) {
      const deviceRef = doc(db, 'users', getCurrentUserId(), 'userCatos', thisDevice.id);
      try {
        await deleteDoc(deviceRef);
        console.log('device deleted');
      } catch {
        console.log('error deleting device');
      }
    }

    const deviceRef = doc(db, 'users', getCurrentUserId(), 'userCatos', thisDevice.id);
    try {
      await deleteDoc(deviceRef);
      console.log('Device deleted successfully');
    } catch (error) {
      console.error('Error deleting device: ', error);
    }

    setTimeout(() => {
      navigate('/devices');
      //refresh the page
      window.location.reload();
    }, 2000);
  }

  return (
    <div>
      {isEditPopupOpen && (
        <div
          ref={popupRef}

          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid black',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}>
          <input
            type="text"
            value={editedConnectionName}
            onChange={(e) => setEditedConnectionName(e.target.value)}
          />
          <button onClick={handleSaveEditedName}>Save</button>
          {/* <button onClick={closeEditPopup}>Cancel</button> */}
        </div>
      )}

      <div className="ml-90">
        <header
          className="shrink-0 bg-transparent border-b border-gray-200"
          onClick={toggleUniversalSettings}
          style={{ cursor: 'pointer' }}
        >
          <div className="flex h-16 items-center justify-between">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Universal Settings
            </h2>
            <div className="flex-grow">
              <div className="flex justify-end">
                <button onClick={handleDeviceDelete} style={{ backgroundColor: '#8B0000', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>
                  Delete Device
                </button>
              </div>
            </div>
          </div>
        </header>
        {isUniversalSettingsExpanded && <GlobalInfoSection />}
      </div>

      <div className="ml-90">
        <header
          className="shrink-0 bg-transparent border-b border-gray-200"
          onClick={toggleConnections}
          style={{ cursor: 'pointer' }}
        >
          <div className="flex h-16 max-w-7xl items-center justify-between">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Connections
            </h2>

          </div>

        </header>

        {isConnectionsExpanded && (
          <>
            <AccordionList data={connectionsList} />
            {/* Add Connection button should be here, inside the same conditional rendering block */}

          </>
        )}


      </div>

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
      <ToastContainer />
    </div>
  );

};
export default Devices;