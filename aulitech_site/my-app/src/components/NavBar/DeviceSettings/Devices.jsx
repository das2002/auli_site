import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../../firebase';
import debounce from 'lodash.debounce';
import { updateDoc, doc, deleteDoc } from 'firebase/firestore';

// styles
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import { KeyOptions, getKeyOption } from './KeyOptions';
import { fetchAndCompareConfig, overwriteConfigFile, deleteConfigFileIfExists } from '../RegisterDevices/ReplaceConfig';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// images
import flatImage from '../images/flatImage.png';
import landscapeImage from '../images/landscapeImage.png';
import portraitImage from '../images/portraitImage.png';

import AccordionList from './AccordionList';

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
  fontSize: '18px',
  marginBottom: '10px',
  fontWeight: 'bold',
  display: 'inline-block',
  marginLeft: '20px'
};


const HardwareUIDField = ({ hardwareUID }) => {
  return (
    <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
      <h2 style={{ fontSize: '16px', marginRight: '10px' }}><strong>Serial Number:</strong></h2>
      <span
        style={{
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

const Devices = ({ devices }) => {
  const editButtonRef = useRef(null);
  const inputRef = useRef(null);

  const [originalConnectionName, setOriginalConnectionName] = useState('');

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editedConnectionName, setEditedConnectionName] = useState('');
  const popupRef = useRef();

  const [editingConnectionIndex, setEditingConnectionIndex] = useState(null);
  const [temporaryConnectionName, setTemporaryConnectionName] = useState('');

  const { deviceName } = useParams();
  const navigate = useNavigate();

  const [isUniversalSettingsExpanded, setIsUniversalSettingsExpanded] = useState(true);
  const [isConnectionsExpanded, setIsConnectionsExpanded] = useState(true);

  const [editedGlobalSettings, setEditedGlobalSettings] = useState(null);
  const [editedConnectionsSettings, setEditedConnectionsSettings] = useState(null);
  const [connectionsList, setConnectionsList] = useState([]);

  const toggleUniversalSettings = () => {
    setIsUniversalSettingsExpanded(!isUniversalSettingsExpanded);
  };

  const toggleConnections = () => {
    setIsConnectionsExpanded(!isConnectionsExpanded);
  };

  const thisDevice = devices.find(device => device.data.device_info.device_nickname === deviceName);

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
      cursor: 'pointer',
    });

    if (!editedGlobalSettings) {
      return <div>Loading...</div>;
    }

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
                    backgroundColor: selectedOrientation === key ? '#f9da6b' : 'transparent',
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
          )}

          <hr style={{ borderColor: '#ccc', borderWidth: '1px', margin: '10px 0' }} />
          <OrientationSection />
        </div>
      </div>
    )
  };

  const sliderContainerStyle = {
    margin: '1rem',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
    padding: '1rem',
  };

  const handleSave = async () => {
    // if the connections array is empty, return
    if (editedConnectionsSettings.length === 0) {
      console.error("No connections to save");
      toast.error("Must add at least one connection to save.", {
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

    const webAppHwUid = editedGlobalSettings["HW_UID"]["value"];
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

    navigate(`/devices/${newDeviceName}`);
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
            {/* <AccordionList data={connectionsList} /> */}
            <AccordionList data={connectionsList} devices={devices} />
          </>
        )}
      </div>

      <button onClick={handleSave}
        style={{
          backgroundColor: '#8c6209', //B8860B
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
