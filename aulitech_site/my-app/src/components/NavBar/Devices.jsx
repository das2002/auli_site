import React, { useEffect, useState } from 'react';
import { db } from "../../firebase";
import { collection,doc, getDocs, query, updateDoc } from 'firebase/firestore';
import USBDeviceList from './USBDeviceList.jsx';
import { auth } from "../../firebase"
import * as clickerDefault from './cato_schemas/clicker.json';
import * as mouseDefault from './cato_schemas/mouse.json';
import * as gestureDefault from './cato_schemas/gesture.json';
import * as tvRemoteDefault from './cato_schemas/tv_remote.json';
import * as bindingsDefault from './cato_schemas/bindings.json';
import * as connectionSpecificDefault from './cato_schemas/connection_specific.json';

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

const InputSlider = ({ value, onChange, min, max, sliderTitle, sliderDescription, sliderLabel }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor={sliderLabel}>{`${sliderTitle} (${value}px)`}</label>
      <input
        type="range"
        id={sliderLabel}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={sliderDescription}  // Providing an accessible name for the range input
      />
    </div>
  );
};


const Dropdown = ({ value, onChange, title, description, options }) => {
  const formattedOptions = options.map((option) =>
    typeof option === 'object' ? option : { value: option, label: option.toString() }
  );
  return (
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor="dropdown" style={{ fontSize: '16px', marginRight: '10px' }}>
        {title}
      </label>
      <select id="dropdown" value={value} onChange={onChange} style={styles.selectStyle}>
        {formattedOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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

const getDeviceData = async (currentUserId) => {
  try {
    const releasesRef = collection(db, 'users', currentUserId, 'userCatos');
    const querySnapshot = await getDocs(releasesRef);
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

const Devices = () => {

  //once we get the current user id, we need to get all of the devices that are associated with that userID
  //const [usbDevices, setUsbDevices] = useState([]); // this is the list of all aulicato USB devices connected to the computer
  const [userDeviceData, setUserDeviceData] = useState(null); //this is the result of pulling everything under userCatos

  //once we get all the data from userCatos, we need to get the list of all the nicknames of the devices
  const [userCatosList, setUserCatosList] = useState([]); // this is the list of all the nicknames of userCatos

  // once the user selects a nickname from the list of nicknames, we need to get the name of the device and the data associated with that device
  const [selectedDocumentId, setSelectedDocumentId] = useState(''); // this is the document id of the device that is selected from the Select Device dropdown
  const [selectedDevice, setSelectedDevice] = useState(''); // this is the device that is selected from the Select Device dropdown
  const [selectedDeviceData, setSelectedDeviceData] = useState(null); // this is the data associated with the device that is selected
  const [interfaceOptions, setInterfaceOptions] = useState([]); // this is the list of all interface options associated with the selected device

  // once the user selects an interface from the list of interfaces, we need to get the data associated with that interface
  const [selectedInterface, setSelectedInterface] = useState(''); // this is the interface that is selected from the Select Interface dropdown
  const [fetchedInterfaceData, setFetchedInterfaceData] = useState(null); // this is the data associated with the interface that is selected
  const [fetchedDeviceConfig, setFetchedDeviceConfig] = useState(null); // this is the config file associated with the interace that is selected
  const [isConfigFetched, setIsConfigFetched] = useState(false); // this is a boolean that tells us whether or not the config file has been fetched
  const [editedDeviceConfig, setEditedDeviceConfig] = useState(null); // this is the config file that is edited by the user

  // for now, we will just do one operation mode per interface
  const [activeOperationMode, setActiveOperationMode] = useState(''); // this is the operation mode that is active on the device
  const [fetchedConnectionSpecificConfig, setFetchedConnectionSpecificConfig] = useState(null); // this is the config file associated with the connection
  const [isConnectionConfigFetched, setIsConnectionConfigFetched] = useState(false); // this is a boolean that tells us whether or not the config file has been fetched
  const [editedConnectionSpecificConfig, setEditedConnectionSpecificConfig] = useState(null); // this is the config file that is edited by the user

  const [devices, setUSBDevices] = useState([]); // this is the list of all USB devices connected to the computer
  const [selectedOperationMode, setSelectedOperationMode] = useState(''); // this is the operation mode that is selected from the Select Operation Mode
  const [scaleXSlider, setscaleXSlider] = useState(0);
  const [scaleYSlider, setscaleYSlider] = useState(0);
  const [screenSizeSlider, setscreenSizeSlider] = useState(0);
  const [sleepSlider, setSleepSlider] = useState(0);
  const [maxClick, setmaxClick] = useState(0);
  const [tapThreshold, settapThreshold] = useState(0);
  const [quietValue, setQuietValue] = useState(0);
  const [selectedSetting, setSelectedSetting] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [isSelected, setIsSelected] = useState(false);
  const [givenDevice, setGivenDevice] = useState(null);
  const [awaitSet, setAwaitSet] = useState('');
  const [deviceHeight, setDeviceHeight] = useState('');
  const [deviceWidth, setDeviceWidth] = useState('');
  const [opMode, setOpMode] = useState('');
  const [threshold, setThreshold] = useState('');

  // the first step is to get the current user id
  const currentUserId = getCurrentUserId();

  //once we get the current user id, we have to get all the device data associated with that user id
  useEffect(() => {
    console.log('currentUserId: ', currentUserId);
    const fetchData = async () => {
      try {
        const userDeviceDataValue = await getDeviceData(currentUserId);
        setUserDeviceData(userDeviceDataValue);
      } catch (error) {
        console.error('error fetching data:', error);
      }
    };
    fetchData();
    //checkForAuliCatoDevices();
  }, [currentUserId]);

  // now that we have all the device data, we need to get the list of all the nicknames of the devices
  useEffect(() => {
    console.log('userDeviceData: ', userDeviceData);
    if (userDeviceData) {
      const userCatosList = [];
      for (let i = 0; i < userDeviceData.length; i++) {
        //console.log(userDeviceData[i].device_info.device_nickname);
        userCatosList.push(userDeviceData[i].device_info.device_nickname);
      }
      console.log(userCatosList);
      setUserCatosList(userCatosList);
    }
  }, [userDeviceData]);

  // when a user selects a device from the userCatosList, we need to get the data associated with that device

  const handleDeviceSelection = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === 'Select A Device Here') {
      setSelectedDevice('');
      setSelectedDeviceData(null);
      setSelectedInterface('');
      setInterfaceOptions([]);
    } else {
      setSelectedDevice(selectedValue);
    }
  };

  const getDocID = async (userId, index) => {
    try {
      const releasesRef = collection(db, 'users', userId, 'userCatos');
      const querySnapshot = await getDocs(releasesRef);
      const qd = querySnapshot.docs[index]._key.path.segments[8];
      return qd;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  // once the user has selected a device, we need to get the data associated with that device
  useEffect(() => {
    console.log('selectedDevice: ', selectedDevice);

    const getSelectedDeviceData = async () => {
      try {
        for (let i = 0; i < userDeviceData.length; i++) {
          if (userDeviceData[i].device_info.device_nickname === selectedDevice) {
            setSelectedDeviceData(userDeviceData[i]);
            const docId = await getDocID(currentUserId, i);
            console.log("docId: ", docId);
            setSelectedDocumentId(docId);
            break;
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getSelectedDeviceData();
  }, [selectedDevice]);


  //once we get the data associated with the device, we need to get the list of all the interfaces associated with that device
  useEffect(() => {
    console.log('selectedDeviceData: ', selectedDeviceData);
    const getFetchedDeviceConfig = async () => {
      try {
        const fetchedDeviceConfig = await selectedDeviceData.device_info.global_config;
        const jsonObject = JSON.parse(fetchedDeviceConfig);
        setFetchedDeviceConfig(jsonObject);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const getInterfaceOptions = async () => {
      try {
        const interfaceOptions = [];
        if (selectedDeviceData) {
          for (let i = 0; i < selectedDeviceData.connection.length; i++) {
            interfaceOptions.push(selectedDeviceData.connection[i].device_type);
          }
        }
        setInterfaceOptions(interfaceOptions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getFetchedDeviceConfig();
    getInterfaceOptions();
  }, [selectedDeviceData]);

  useEffect(() => {
    if (fetchedDeviceConfig && !isConfigFetched) {
      const deepCopyFetchedDeviceConfig = deepCopy(fetchedDeviceConfig);
      setEditedDeviceConfig(deepCopyFetchedDeviceConfig);
      setIsConfigFetched(true);
    }
  }, [fetchedDeviceConfig]);

  useEffect(() => {
    console.log('interfaceOptions: ', interfaceOptions);
  }, [interfaceOptions]);


  const handleInterfaceSelection = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === 'Select An Interface') {
      setSelectedInterface('');
    } else {
      setSelectedInterface(selectedValue);
    }
  };

  // once the user has selected an interface, we need to get the data associated with that interface
  // if the user has already gotten the interface data before, we don't want to get it again
  useEffect(() => {
    console.log('selectedInterface: ', selectedInterface);
    if (selectedInterface) {
      const getFetchedInterfaceData = async () => {
        try {
          for (let i = 0; i < selectedDeviceData.connection.length; i++) {
            if (selectedDeviceData.connection[i].device_type === selectedInterface) {
              setFetchedInterfaceData(selectedDeviceData.connection[i]);
              break;
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      getFetchedInterfaceData();
    } 
  }, [selectedInterface]);

  // once we get the data associated with the interface, we need to get the config file associated with that interface
  useEffect(() => {
    console.log('fetchedInterfaceData: ', fetchedInterfaceData);
    if (fetchedInterfaceData) {
      const getConnectionSpecificConfig = async () => {
        try {
          const fetchedConnectionSpecificConfigString = await fetchedInterfaceData.configjson;
          const jsonObject = JSON.parse(fetchedConnectionSpecificConfigString);
          setFetchedConnectionSpecificConfig(jsonObject);
        } catch (error) {
          console.error('Error fetching data:', error);
        }

      }
      getConnectionSpecificConfig();
    }
  }, [fetchedInterfaceData]);

  // once we get the config file associated with the interface, we need to get the operation mode associated with that interface
  useEffect(() => {
    console.log('fetchedConnectionSpecificConfig: ', fetchedConnectionSpecificConfig);
    if (fetchedConnectionSpecificConfig) {
      const getActiveOperationMode = async () => {
        try {
          setActiveOperationMode(fetchedConnectionSpecificConfig.operation_mode.value);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }

      const getEditedConnectionSpecificConfig = async () => {
        try {
          const deepCopyFetchedConnectionSpecificConfig = deepCopy(fetchedConnectionSpecificConfig);
          setEditedConnectionSpecificConfig(deepCopyFetchedConnectionSpecificConfig);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      getActiveOperationMode();

      getEditedConnectionSpecificConfig();
    }
  }, [fetchedConnectionSpecificConfig]);

  /*
  useEffect(() => {
    if (fetchedConnectionSpecificConfig && !isConnectionConfigFetched) {
      const deepCopyFetchedConnectionSpecificConfig = deepCopy(fetchedConnectionSpecificConfig);
      setEditedConnectionSpecificConfig(deepCopyFetchedConnectionSpecificConfig);
      setIsConnectionConfigFetched(true);
    }
  }, [fetchedConnectionSpecificConfig, isConnectionConfigFetched]);
  */
  // at this point, we have the device config sections and the connection config sections


  const handleConnectionConfigChange = (keyList) => (value) => {
    console.log('keyList: ', keyList);
    console.log('value: ', value);
    const deepConnectionConfigCopy = deepCopy(editedConnectionSpecificConfig);
    let currentConfig = deepConnectionConfigCopy;
    for (let i = 0; i < keyList.length - 1; i++) {
      currentConfig = currentConfig[keyList[i]];
    }
    currentConfig[keyList[keyList.length - 1]] = value;
    console.log('currentConfig: ', deepConnectionConfigCopy);
    setEditedConnectionSpecificConfig(deepConnectionConfigCopy);
  };

  const paragraphStyle = {
    marginBottom: '40px',
    textAlign: 'left'
  };
  const containerStyle = {
    position: 'relative',
    paddingBottom: '70px' // Add padding to accommodate the Save button
  };

  const saveButtonStyle = {
    position: 'absolute',
    right: '20px',
    bottom: '20px',
    padding: '10px 20px',
    backgroundColor: '#B49837',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  };

  // Modified button style function
  const getButtonStyle = (setting) => ({
    padding: '10px 20px',
    fontSize: '16px',
    border: '2px solid #B49837',
    cursor: 'pointer',
    borderRadius: '5px',
    //backgroundColor: selectedSetting === setting ? '#B49837' : 'transparent', // highlight
    //color: selectedSetting === setting ? 'white' : 'black' // change color text
  });

  const getOpStyle = (setting) => ({
    padding: '10px 20px',
    fontSize: '16px',
    border: '2px solid #B49837',
    cursor: 'pointer',
    borderRadius: '5px',
    backgroundColor: opMode === setting ? '#B49837' : 'transparent', // highlight
    color: opMode === setting ? 'white' : 'black' // change color text
  });

  const getAwaitStyle = (setting) => ({
    padding: '10px 20px',
    fontSize: '16px',
    border: '2px solid #B49837',
    cursor: 'pointer',
    borderRadius: '5px',
    backgroundColor: awaitSet === setting ? '#B49837' : 'transparent', // highlight
    color: awaitSet === setting ? 'white' : 'black' // change color text
  });

  const getThreshStyle = (setting) => ({
    padding: '10px 20px',
    fontSize: '16px',
    border: '2px solid #B49837',
    cursor: 'pointer',
    borderRadius: '5px',
    backgroundColor: threshold === setting ? '#B49837' : 'transparent', // highlight
    color: threshold === setting ? 'white' : 'black' // change color text
  });

  const settingsBoxStyle = {
    display: 'flex',
    flexDirection: 'column', // Changed to column layout
    alignItems: 'center',
    width: '80%',
    margin: '20px auto',
    borderRadius: '15px',
    backgroundColor: '#f5f5f5',
    fontSize: '24px',
  };

  const ConnectionSpecificSettings = () => {
    let operationModeLabel;
    if (activeOperationMode === 'gesture_mouse') {
      operationModeLabel = 'Gesture Mouse';
    } else if (activeOperationMode === 'clicker') {
      operationModeLabel = 'Clicker';
    } else if (activeOperationMode === 'tv_remote') {
      operationModeLabel = 'TV Remote';
    } else if (activeOperationMode === 'pointer') {
      operationModeLabel = 'Pointer';
    }
    return (
      <div style={{ maxWidth: '600px', margin: 'auto' }}>
        <h1 style={titleStyle}>Interface Settings</h1>
        <div style={sliderContainerStyle}>
          <div style={{ marginBottom:'20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '16px', marginRight: '10px' }}>Operation Mode</h2>
            {selectedDeviceData != null && <input value={operationModeLabel} style={{ borderColor: 'black', borderWidth: 1 }} type="text" placeholder="Operation Mode" readOnly={true} />}
          </div>
          <InputSlider
            sliderLabel={'screenSizeHeight'}
            value={editedConnectionSpecificConfig.screen_size.value.height.value}
            onChange={(e) => handleConnectionConfigChange(['screen_size', 'value', 'height', 'value'])(e.target.value)}
            min={600}
            max={4320}
            sliderTitle={"Screen Size - Height"}
            sliderDescription={"height of interface screen"}
          />

          <InputSlider
            sliderLabel={'screenSizeWidth'}
            value={editedConnectionSpecificConfig.screen_size.value.width.value}
            onChange={(e) => handleConnectionConfigChange(['screen_size', 'value', 'width', 'value'])(e.target.value)}
            min={800}
            max={8192}
            sliderTitle={"Screen Size - Width"}
            sliderDescription={"width of interface screen"}
          />
        </div>
      </div>
    )
  };


  const MouseOptions = () => {
    return (
      <div style={{ maxWidth: '600px', margin: 'auto' }}>
        <h1 style={titleStyle}>Mouse Settings</h1>
        <div style={sliderContainerStyle}>
          <p style={descriptionStyle}>Adjust your mouse settings below:</p>
          <InputSlider
            sliderLabel={'mouseIdleThreshold'}
            value={editedConnectionSpecificConfig.mouse.value.idle_threshold.value}
            onChange={(e) => handleConnectionConfigChange(['mouse', 'value', 'idle_threshold', 'value'])(parseInt(e.target.value))}
            min={5}
            max={12}
            sliderTitle="Mouse Idle Threshold"
            sliderDescription="Value of move speed below which is considered idle. Causes mouse exit; High value: easier to idle out; Low value: mouse stays active."
          />
          <InputSlider
            sliderLabel={'minMouseRuntime'}
            value={editedConnectionSpecificConfig.mouse.value.min_run_cycles.value}
            onChange={(e) => handleConnectionConfigChange(['mouse', 'value', 'min_run_cycles', 'value'])(parseInt(e.target.value))}
            min={0}
            max={100}
            sliderTitle="Minimum Mouse Runtime"
            sliderDescription="Minimum time (in .01 second increments) that mouse will always run before checking idle conditions for exit"
          />
          <InputSlider
            sliderLabel={'mouseIdleDuration'}
            value={editedConnectionSpecificConfig.mouse.value.idle_duration.value}
            onChange={(e) => handleConnectionConfigChange(['mouse', 'value', 'idle_duration', 'value'])(parseInt(e.target.value))}
            min={30}
            max={150}
            sliderTitle="Idle Timeout Cycles"
            sliderDescription="Amount of idle time (in .01 second increments) required to trigger mouse exit"
          />
          <InputSlider
            sliderLabel={'mouseDwellDuration'}
            value={editedConnectionSpecificConfig.mouse.value.dwell_duration.value}
            onChange={(e) => handleConnectionConfigChange(['mouse', 'value', 'dwell_duration'])(parseInt(e.target.value))}
            min={20}
            max={100}
            sliderTitle="Dwell Trigger Cycles"
            sliderDescription="Amount of idle time (in .01 second increments) needed to trigger action in dwell_click"
          />
          <Dropdown
            value={editedConnectionSpecificConfig.mouse.value.dwell_repeat.value}
            onChange={(e) => handleConnectionConfigChange(['mouse', 'value', 'dwell_repeat', 'value'])(parseBool(e.target.value))}
            title="Dwell Repeat Clicks"
            description="Continued idle causes multiple clicks"
            options={[true, false]}
          />
          <InputSlider
            sliderLabel={'mouseScaleX'}
            value={editedConnectionSpecificConfig.mouse.value.scale_x.value}
            onChange={(e) => handleConnectionConfigChange(['mouse', 'value', 'scale_x', 'value'])(e.target.value)}
            min={0.1}
            max={4.0}
            sliderTitle="Horizontal Movement Scale Factor"
            sliderDescription="Mouse sensitivity to horizontal movement"
          />
          <InputSlider
            sliderLabel={'mouseScaleY'}
            value={editedConnectionSpecificConfig.mouse.value.scale_y.value}
            onChange={(e) => handleConnectionConfigChange(['mouse', 'value', 'scale_y', 'value'])(e.target.value)}
            min={0.1}
            max={4.0}
            sliderTitle="Vertical Movement Scale Factor"
            sliderDescription="Mouse sensitivity to vertical movement"
          />
          <InputSlider
            sliderLabel={'mouseShakeSize'}
            value={editedConnectionSpecificConfig.mouse.value.shake_size.value}
            onChange={(e) => handleConnectionConfigChange(['mouse', 'value', 'scale_y', 'value'])(e.target.value)}
            min={0}
            max={20}
            sliderTitle="Shake Size"
            sliderDescription="size of cursor movement for gesturer indicator"
          />
          <InputSlider
            sliderLabel={'mouseNumberShakes'}
            value={editedConnectionSpecificConfig.mouse.value.num_shake.value}
            onChange={(e) => handleConnectionConfigChange(['mouse', 'value', 'num_shake', 'value'])(e.target.value)}
            min={1}
            max={4}
            sliderTitle="Number of Shakes"
            sliderDescription="Number of times to repeat gesture ready indicator"
          />
        </div>
      </div>
    )
  };

  const ClickerOptions = () => {
    return (
      <div style={{ maxWidth: '600px', margin: 'auto' }}>
        <h1 style={titleStyle}>Clicker Settings</h1>
        <div style={sliderContainerStyle}>
          <p style={descriptionStyle}>Adjust your clicker settings below:</p>
          <InputSlider
            value={editedConnectionSpecificConfig.clicker.value.max_click_spacing.value}
            onChange={(e) => handleConnectionConfigChange(['clicker', 'value', 'max_click_spacing', 'value'])(parseFloat(e.target.value))}
            min={0.1}
            max={1.0}
            sliderTitle={"Max Click Spacing"}
            sliderDescription={"Time (seconds) to await next tap before dispatching counted result"}
            sliderLabel={"clickerMaxClickSpacing"}
          />
          <InputSlider
            value={editedConnectionSpecificConfig.clicker.value.tap_ths.value}
            onChange={(e) => handleConnectionConfigChange(['clicker', 'value', 'tap_ths', 'value'])(parseFloat(e.target.value))}
            min={0}
            max={31}
            sliderTitle={"Tap Threshold"}
            sliderDescription={"Level of impact needed to trigger a click. Lower -> more Sensitive to impact"}
            sliderLabel={"clickerTapThreshold"}
          />
          <InputSlider
            value={editedConnectionSpecificConfig.clicker.value.quiet.value}
            onChange={(e) => handleConnectionConfigChange(['clicker', 'value', 'quiet', 'value'])(parseInt(e.target.value))}
            min={0}
            max={3}
            sliderTitle={"Quiet"}
            sliderDescription={"Amount of quiet required after a click"}
            sliderLabel={"clickerQuiet"}
          />
          <InputSlider
            value={editedConnectionSpecificConfig.clicker.value.shock.value}
            onChange={(e) => handleConnectionConfigChange(['clicker', 'value', 'shock', 'value'])(parseInt(e.target.value))}
            min={0}
            max={3}
            sliderTitle={"Shock"}
            sliderDescription={"Max duration of over threshold event"}
            sliderLabel={"clickerShock"}
          />
        </div>
      </div>
    );
  };

  const TVRemoteOptions = () => {
    return (
      // give a title for the TV Remote Options
      <div style={{ maxWidth: '600px', margin: 'auto' }}>
        <h1 style={titleStyle}> TV Remote Options </h1>
        <div style={sliderContainerStyle}>
          <Dropdown
            value={editedConnectionSpecificConfig.tv_remote.value.await_actions.value}
            onChange={(e) => handleConnectionConfigChange(['tv_remote', 'value', 'await_actions', 'value'])(parseBool(e.target.value))}
            title="Await Actions"
            description="wait for previous action to end before reading a new gesture"
            options={[true, false]}
          />
        </div>
      </div>

    );
  };

  const handleNameChange = (value) => {
    console.log(value);
    setDeviceName(value);
    const deepCopyEditedDeviceConfig = deepCopy(editedDeviceConfig);
    deepCopyEditedDeviceConfig.name.value = value;
    setEditedDeviceConfig(deepCopyEditedDeviceConfig);
  }

  const handleSave = async () => {
    console.log('Saving...');
    console.log("activeOperationMode: ", activeOperationMode);
    console.log("selectedInterface: ", selectedInterface);
    console.log('editedConnectionSpecificConfig: ', editedConnectionSpecificConfig);

    // only want to save if editedDeviceConfig is different from fetchedDeviceConfig
    const checkIfEditedDeviceConfigIsDifferent = () => {
      const editedDeviceConfigString = JSON.stringify(editedDeviceConfig);
      const fetchedDeviceConfigString = JSON.stringify(fetchedDeviceConfig);
      if (editedDeviceConfigString === fetchedDeviceConfigString) {
        return false;
      } else {
        return true;
      }
    };

    const checkIfEditedConnectionSpecificConfigIsDifferent = () => {
      const editedConnectionSpecificConfigString = JSON.stringify(editedConnectionSpecificConfig);
      const fetchedConnectionSpecificConfigString = JSON.stringify(fetchedConnectionSpecificConfig);
      if (editedConnectionSpecificConfigString === fetchedConnectionSpecificConfigString) {
        return false;
      } else {
        return true;
      }
    };

    let deviceConfigDifferent = checkIfEditedDeviceConfigIsDifferent();
    let connectionConfigDifferent = checkIfEditedConnectionSpecificConfigIsDifferent();
    let eitherDifferent = deviceConfigDifferent || connectionConfigDifferent;

    try {
      const currentUserId = getCurrentUserId();
      console.log("currentUserId: ", currentUserId);
      console.log("selectedDocumentId: ", selectedDocumentId);
      const getConnections = async () => {
        const colRef = collection(db, 'users');
        console.log("colRef: ", colRef);
        const userRef = collection(colRef, currentUserId, "userCatos");
        console.log("userRef: ", userRef);
        const docRef = doc(userRef, selectedDocumentId);
        
        console.log("docRef: ", docRef);
        console.log("selectedDocumentId: ", selectedDocumentId);
        const globalConfig = JSON.stringify(editedDeviceConfig);
        
        let copySelectedDeviceData = null;
        if (eitherDifferent) {
          copySelectedDeviceData = deepCopy(selectedDeviceData);
        }

        //just update the fields within selectedDeviceData
        if (deviceConfigDifferent) {
          copySelectedDeviceData.device_info.global_config = globalConfig;
          copySelectedDeviceData.device_info.device_nickname = deviceName;
        }

        if (connectionConfigDifferent) {
          for (let i = 0; i < copySelectedDeviceData.connection.length; i++) {
            if (copySelectedDeviceData.connection[i].device_type === selectedInterface) {
              copySelectedDeviceData.connection[i].configjson = JSON.stringify(editedConnectionSpecificConfig);
              break;
            }
          }
        }
        
        if (copySelectedDeviceData != null) {
          console.log("copySelectedDeviceData: ", copySelectedDeviceData);
          await updateDoc(docRef, copySelectedDeviceData);
        }
      }

      //now we want to download the combined config file
      const getCombinedConfig = async () => {
        let combinedConfig = {};
        
        // we want to add every field from the editedDeviceConfig to the combinedConfig
        for (const [key, value] of Object.entries(editedDeviceConfig)) {
          combinedConfig[key] = value;
        }

        // we want to add every field from the editedConnectionSpecificConfig to the combinedConfig
        for (const [key, value] of Object.entries(editedConnectionSpecificConfig)) {
          combinedConfig[key] = value;
        }

        console.log("combinedConfig: ", combinedConfig);

        // we want to download the combinedConfig as a JSON file
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(combinedConfig)], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "config.json";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        // remove the element
        document.body.removeChild(element);
      }
      await getConnections();
      await getCombinedConfig();
      window.location.reload();
    } catch {
      console.error('Error saving data');
    }
  }

  return (
    <div style={containerStyle}>
      <div>
        {/* Header */}
        <header className="flex justify-between bg-transparent border-b border-gray-200">
          <div className="flex h-16 max-w-7xl justify-between items-center">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight py-1">Devices</h2>
          </div>
        </header>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={paragraphStyle}>This is the Devices page where you can manage and view connected devices.</p>

          <h2 style={{ fontSize: '30px' }}>Select Device</h2>

          <div>
            <select
              value={selectedDevice}
              onChange={handleDeviceSelection}
              style={{
                padding: '10px',
                borderRadius: '5px',
                outline: 'none',
                cursor: 'pointer',
                marginBottom: '20px',
                border: '2px solid #B49837'
              }}>
              <option> Select A Device Here </option>
              {userCatosList.length > 0 && userCatosList.map((userCato, index) => (
                <option key={index} value={userCato}>
                  {userCato}
                </option>
              ))}

            </select>
          </div>

          <DashedLine />
          <br></br>


          <h2 style={{ fontSize: '20px' }}> Edit Nickname </h2>
          <form>
            <label>
              Name:
              {selectedDeviceData != null && editedDeviceConfig != null && (
                <input
                  value={editedDeviceConfig.name.value}
                  style={{ borderColor: 'black', borderWidth: 1, marginLeft: '15px', marginRight: '15px' }}
                  type="text"
                  onChange={(event) => handleNameChange(event.target.value)}
                />
              )}
            </label>
            <br></br>
          </form>

          <br></br>


          <h2 style={{ fontSize: '20px' }}> Hardware UID </h2>
          {/* value to be read in from config  */}
          {selectedDeviceData != null && <input value={selectedDeviceData.device_info.HW_UID}
            style={{ borderColor: 'black', borderWidth: 1, paddingLeft: '15px', marginLeft: '15px', marginRight: '15px' }} className="e-input" type="text" placeholder="UID Here" readOnly={true} />}
          <br></br>
          <br></br>

          <h2 style={{ fontSize: '20px' }}> Device Interface </h2>
          <select
            value={selectedInterface}
            onChange={handleInterfaceSelection}
            style={{
              padding: '10px',
              borderRadius: '5px',
              outline: 'none',
              cursor: 'pointer',
              marginBottom: '20px',
              border: '2px solid #B49837'
            }}
          >

            <option> Select An Interface </option>
            {interfaceOptions != null &&
              interfaceOptions.map((chosenInterface, index) => (
                <option key={index} value={chosenInterface}>
                  {chosenInterface}
                </option>
              ))}
          </select>

          <DashedLine />

          {editedConnectionSpecificConfig && ConnectionSpecificSettings()}
          <DashedLine />

          {activeOperationMode === 'gesture_mouse' && editedConnectionSpecificConfig && MouseOptions()}
          {activeOperationMode === 'clicker' && editedConnectionSpecificConfig && ClickerOptions()}
          {activeOperationMode === 'tv_remote' && editedConnectionSpecificConfig && TVRemoteOptions()}
          {activeOperationMode === 'pointer' && editedConnectionSpecificConfig && MouseOptions()}


        </div>
      </div>
      {editedConnectionSpecificConfig && (
        <button style={saveButtonStyle} onClick={handleSave}>Save</button>
      )}
    </div>

  );
};

export default Devices;