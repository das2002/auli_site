import React, { useEffect, useState } from 'react';
//import Slider from 'react-slider';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import { db } from "../../firebase";
import { collection, getDocs, query } from 'firebase/firestore';
import USBDeviceList from './USBDeviceList.jsx';
import { auth } from "../../firebase"

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

const TickedSlider = ({ value, onChange, min, max, ticks, sliderTitle, sliderDescription }) => {
  const tickLabels = Array.from({ length: ticks }, (_, index) => {
    const tickValue = min + ((max - min) / (ticks - 1)) * index;
    return tickValue.toFixed(2);
  });

  return (
    <div>
      <h2
        style={{fontSize: '20px'}}
        title={sliderDescription}
      >
        {sliderTitle}
      </h2>
      <div style={{ marginTop: '20px' }}>
        <Slider>
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={(max - min) / (ticks - 1)}
          labels={tickLabels}
        </Slider>
      </div>
    </div>
  );
};

const Dropdown = ({ value, onChange, title, description, options }) => {
  return (
    <div>
      <label htmlFor="dropdown" style={{ fontSize: '20px' }}>
        {title}
      </label>
      <select id="dropdown" value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <p>{description}</p>
    </div>
  );
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

  /*
  const checkForAuliCatoDevices = async () => {
    try {
      console.log("checking for aulicato devices");
      const devices = await navigator.usb.getDevices();
      console.log('Connected USB devices:', devices);
      const auliCatoDevices = devices.filter(device => device.productName === 'AULI_CATO');
      if (auliCatoDevices.length > 0) {
        setUsbDevices(auliCatoDevices);
      } else {
        setUsbDevices([]);
        console.log('No AuliCato devices connected');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  */

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

  // once the user has selected a device, we need to get the data associated with that device
  useEffect(() => {
    console.log('selectedDevice: ', selectedDevice);

    const getSelectedDeviceData = async () => {
      try {
        for (let i = 0; i < userDeviceData.length; i++) {
          if (userDeviceData[i].device_info.device_nickname === selectedDevice) {
            setSelectedDeviceData(userDeviceData[i]);
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
  }, [fetchedDeviceConfig, isConfigFetched]);

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
          setActiveOperationMode(fetchedConnectionSpecificConfig.operation_mode);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      getActiveOperationMode();
    }
  }, [fetchedConnectionSpecificConfig]);

  useEffect(() => {
    if (fetchedConnectionSpecificConfig && !isConnectionConfigFetched) {
      const deepCopyFetchedConnectionSpecificConfig = deepCopy(fetchedConnectionSpecificConfig);
      setEditedConnectionSpecificConfig(deepCopyFetchedConnectionSpecificConfig);
      setIsConnectionConfigFetched(true);
    }
  }, [fetchedConnectionSpecificConfig, isConnectionConfigFetched]);

  // at this point, we have the device config sections and the connection config sections


  const handleConnectionConfigChange = ([keyList]) => (value) => {
    console.log('keyList: ', keyList);
    console.log('value: ', value);
    const deepConnectionConfigCopy = deepCopy(editedConnectionSpecificConfig);
    let currentConfig = deepConnectionConfigCopy;
    for (let i = 0; i < keyList.length - 1; i++) {
      currentConfig = currentConfig[keyList[i]];
    }
    currentConfig[keyList[keyList.length - 1]] = value;
    setEditedDeviceConfig(deepConnectionConfigCopy);
  };


  const handleScaleXChange = (value) => {
    setscaleXSlider(value);
  };

  const handleScaleYChange = (value) => {
    setscaleYSlider(value);
  };

  const handleScreenSizeSliderChange = (value) => {
    setscreenSizeSlider(value);
  };

  const handleSleepSliderChange = (value) => {
    setSleepSlider(value);
  };

  const handleMaxClickChange = (value) => {
    setmaxClick(value);
  }

  const handleTapThresholdChange = (value) => {
    settapThreshold(value);
  }

  const handleQuietChange = (value) => {
    setQuietValue(value);
  }

  const handleDeviceChange = (event) => {
    setSelectedDevice(event.target.value);
    setSelectedSetting(''); // Reset setting selection when device changes
  };

  const connectionsData = [];

  const handleNewDevice = (event) => {
    console.log(event.target.value);
    //setDeviceName(event.target.value);
    setSelectedSetting('');

    deviceName = event.target.value;
    // console.log(deviceName);


    if (event.target.value === 'Select A Device Here' || event.target.value == '') {
      console.log('default');
      setIsSelected(false);
    }
    else {
      setIsSelected(true);
      userCatosList.forEach((doc) => {
        console.log("line 190");
        console.log(doc);
        if (doc.device_info.device_nickname == event.target.value) {
          setGivenDevice(doc);
        }
      });
    }

    console.log(isSelected);
    if (isSelected) {
      givenDevice.connections.forEach((doc) => {
        const data = doc.data();
        console.log('connection interface ', data);
        connectionsData.push(data);
      });
    }
  }

  const handleSettingClick = (setting) => {
    setSelectedSetting(setting);
  };

  const handleAwaitChange = (setting) => {
    setAwaitSet(setting);
  }

  const handleHeightChange = (event) => {
    setDeviceHeight(event.target.value);
  }

  const handleWidthChange = (event) => {
    setDeviceWidth(event.target.value);
  }

  const handleOpChange = (setting) => {
    setOpMode(setting);
  }

  const handleThreshChange = (setting) => {
    setThreshold(setting);
  }

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


  const MouseOptions = () => {
    //const currentOperationMode = editedConnectionSpecificConfig.operation_mode;
    const [currentMouseConfig, setCurrentMouseConfig] = useState(editedConnectionSpecificConfig.mouse);

    useEffect(() => {
      setCurrentMouseConfig(editedConnectionSpecificConfig.mouse);
    }, [editedConnectionSpecificConfig]);

    return (
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <TickedSlider 
          value={currentMouseConfig.value.idle_threshold.value} 
          onChange={(value) => handleConnectionConfigChange(['mouse', 'value', 'idle_threshold', 'value'])(value)}
          min= {5}
          max= {12} 
          ticks={4}
          sliderTitle="Mouse Idle Threshold"
          sliderDescription="Value of move speed below which is considered idle. Causes mouse exit; High value: easier to idle out; Low value: mouse stays active." 
        />
        <TickedSlider 
          value={currentMouseConfig.value.min_run_cycles.value} 
          onChange={(value) => handleConnectionConfigChange(['mouse', 'value', 'min_run_cycles', 'value'])(value)}
          min= {0}
          max= {100} 
          ticks={10}
          sliderTitle="Minimum Mouse Runtime"
          sliderDescription="Minimum time (in .01 second increments) that mouse will always run before checking idle conditions for exit" 
        />
        <TickedSlider 
          value={currentMouseConfig.value.idle_duration.value} 
          onChange={(value) => handleConnectionConfigChange(['mouse', 'value', 'idle_duration', 'value'])(value)}
          min= {30}
          max= {150} 
          ticks={12}
          sliderTitle="Idle Timeout Cycles"
          sliderDescription="Amount of idle time (in .01 second increments) required to trigger mouse exit" 
        />
        <TickedSlider
          value={currentMouseConfig.value.dwell_duration.value}
          onChange={(value) => handleConnectionConfigChange(['mouse', 'value','dwell_duration'])(value)}
          min= {20}
          max= {100}
          ticks={8}
          sliderTitle="Dwell Trigger Cycles"
          sliderDescription="Amount of idle time (in .01 second increments) needed to trigger action in dwell_click"
        />
        <Dropdown
          value={currentMouseConfig.value.dwell_repeat.value}
          onChange={(value) => handleConnectionConfigChange(['mouse', 'value', 'dwell_repeat', 'value'])(value)}
          title="Dwell Repeat Clicks"
          description="Continued idle causes multiple clicks"
          options={[true, false]}
        />
        <TickedSlider
          value = {currentMouseConfig.value.scale_x.value}
          onChange={(value) => handleConnectionConfigChange(['mouse', 'value', 'scale_x', 'value'])(value)}
          min={0.1}
          max={4.0}
          ticks={10}
          sliderTitle="Horizontal Movement Scale Factor"
          sliderDescription="Mouse sensitivity to horizontal movement"
        />
        <TickedSlider
          value = {currentMouseConfig.value.scale_y.value}
          onChange={(value) => handleConnectionConfigChange(['mouse', 'value', 'scale_y', 'value'])(value)}
          min={0.1}
          max={4.0}
          ticks={10}
          sliderTitle= "Vertical Movement Scale Factor"
          sliderDescription= "Flat multiplier for all mouse movements"
        />
        <TickedSlider
          value = {currentMouseConfig.value.shake_size.value}
          onChange={(value) => handleConnectionConfigChange(['mouse', 'value', 'scale_y', 'value'])(value)}
          min={0}
          max={20}
          ticks={10}
          sliderTitle= "Shake Size"
          sliderDescription= "size of cursor movement for gesturer indicator"
        />
        <TickedSlider
          value = {currentMouseConfig.value.num_shake.value}
          onChange={(value) => handleConnectionConfigChange(['mouse', 'value', 'num_shake', 'value'])(value)}
          min={1}
          max={4}
          ticks={4}
          sliderTitle= "Number of Shakes"
          sliderDescription= "Number of times to repeat gesture ready indicator"
        />
      </div>
    )
  };

  const ClickerOptions = () => {
    return (
      <div>
        <h2 style={{ fontSize: '20px' }}> Max Click Spacing</h2>
        <TickedSlider value={maxClick} onChange={handleMaxClickChange} ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]} />
        <h2 style={{ fontSize: '20px' }}> Tap Threshold </h2>
        <TickedSlider value={tapThreshold} onChange={handleTapThresholdChange} ticks={[0, 2, 4, 8, 16, 31]} />
        <h2 style={{ fontSize: '20px' }}> Quiet </h2>
        <TickedSlider value={quietValue} onChange={handleQuietChange} ticks={[0, 1, 2, 3]} />
      </div>
    );
  };

  const TVRemoteOptions = () => {
    return (
      <div>

        <h2 style={{ fontSize: '20px' }}> Await Actions </h2>
        <button style={getAwaitStyle('True')} onClick={() => handleAwaitChange('True')}>True</button>
        <button style={getAwaitStyle('False')} onClick={() => handleAwaitChange('False')}>False</button>

      </div>
    );
  };


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
          <form >
            <label>
              Name:
              {selectedDeviceData != null && <input value={selectedDeviceData.device_info.device_nickname}
                style={{ borderColor: 'black', borderWidth: 1, marginLeft: '15px', marginRight: '15px' }} type="text" />}
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


          {selectedDevice && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
              <button style={getButtonStyle('TV')} onClick={() => handleSettingClick('TV')}>TV</button>
              <button style={getButtonStyle('Mac')} onClick={() => handleSettingClick('Mac')}>Mac</button>
              <button style={getButtonStyle('Wheelchair')} onClick={() => handleSettingClick('Wheelchair')}>Wheelchair</button>
              <button style={getButtonStyle('iPad')} onClick={() => handleSettingClick('iPad')}>iPad</button>
            </div>
          )}

          {selectedSetting && (
            <div style={settingsBoxStyle}>
              <p>Settings for {selectedSetting}</p>
              <h2 style={{ fontSize: '20px' }}> Screen Size </h2>
              <br></br>
              <p style={{ fontSize: '15px' }}>Height</p>
              {/* height  */}
              <select
                value={deviceHeight}
                onChange={handleHeightChange}
                style={{
                  padding: '10px',
                  borderRadius: '5px',
                  outline: 'none',
                  cursor: 'pointer',
                  marginBottom: '20px',
                  border: '2px solid #B49837'
                }}
              >
                <option value="">Choose Your Interface Height!</option>
                {/* need to get these values from the config file, hardcode for now? */}
                <option value="height1">height 1</option>
                <option value="height2">height 2</option>
                <option value="height3">height 3</option>

              </select>

              <p style={{ fontSize: '15px' }}>Width</p>
              {/* height  */}
              <select
                value={deviceWidth}
                onChange={handleWidthChange}
                style={{
                  padding: '10px',
                  borderRadius: '5px',
                  outline: 'none',
                  cursor: 'pointer',
                  marginBottom: '20px',
                  border: '2px solid #B49837'
                }}
              >
                <option value="">Choose Your Interface Width!</option>
                {/* need to get these values from the config file, hardcode for now? */}
                <option value="width1">width 1</option>
                <option value="width2">width 2</option>
                <option value="width3">width 3</option>

              </select>

              <h2 style={{ fontSize: '20px' }}> Operation Mode </h2>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <button style={getOpStyle('Gesture Mouse')} onClick={() => handleOpChange('Gesture Mouse')}>Gesture Mouse</button>
                <button style={getOpStyle('Pointer')} onClick={() => handleOpChange('Pointer')}>Pointer</button>
                <button style={getOpStyle('Clicker')} onClick={() => handleOpChange('Clicker')}>Clicker</button>
                <button style={getOpStyle('TV Remote')} onClick={() => handleOpChange('TV Remote')}>TV Remote</button>
                <button style={getOpStyle('Practice')} onClick={() => handleOpChange('Practice')}>Practice</button>

              </div>
              {opMode == 'Gesture Mouse' && <MouseOptions />}
              {/* {opMode == 'Pointer'} idk what to do here */}
              {opMode == 'Clicker' && <ClickerOptions />}
              {opMode == 'TV Remote' && <TVRemoteOptions />}




            </div>
          )}
        </div>
      </div>
      {selectedSetting && (
        <button style={saveButtonStyle}>Save</button>
      )}
    </div>

  );
};

export default Devices;