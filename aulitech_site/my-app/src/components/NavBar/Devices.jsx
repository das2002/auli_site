import React, { useState } from 'react';
import Slider from 'react-slider';
import {db} from "../../firebase"
import {collection, getDocs} from "firebase/firestore"

// when you open this page, the dropdown should be populated with all of the devices that are registered with the user.
  // only the devices that are connected to the computer via USB should be clickable and highlighted
// when you click on the device
  // the fields to edit the nickname, the hardware id, and the interface selection should come up
  





const TickedSlider = ({ value, onChange, ticks }) => {
  return (
    <div style={{ marginTop: '20px' }}>
      <Slider
        value={value}
        onChange={onChange}
        withBars
        min={0}
        max={100}
        step={25}
        renderTrack={(props, state) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '15px',
              width: (1 - state.value) * 100 + '%',
              backgroundColor: state.index === 0 ? '#fff' : '#ccc',
            }}
          />
        )}
        renderThumb={(props, state) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '20px',
              width: '20px',
              borderRadius: '50%',
              backgroundColor: '#B49837',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
              outline: 'black',
            }}
          >
            {/* {state.valueNow} */}
          </div>
        )}
      />
      <br></br>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
        {ticks.map((tick) => (
          <div key={tick} style={{ textAlign: 'center', flex: '1' }}>
            {tick}
          </div>
        ))}
      </div>
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

const Devices = () => {
    const [selectedDevice, setSelectedDevice] = useState('');
    const [selectedSetting, setSelectedSetting] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const [deviceHeight, setDeviceHeight] = useState(500);
    const [deviceWidth, setDeviceWidth] = useState(500);
    const [opMode, setOpMode] = useState('');
    const [scaleXSlider, setscaleXSlider] = useState(0);
    const [scaleYSlider, setscaleYSlider] = useState(0);
    const [screenSizeSlider, setscreenSizeSlider] = useState(0);
    const [sleepSlider, setSleepSlider] = useState(0);
    const [maxClick, setmaxClick] = useState(0);
    const [tapThreshold, settapThreshold] = useState(0);
    const [quietValue, setQuietValue] = useState(0);
    const [awaitSet, setAwaitSet] = useState('');
    const [threshold, setThreshold] = useState('');

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

    const handleNewDevice = (event) => {
      setDeviceName(event.target.value);
      setSelectedSetting('');
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
      backgroundColor: selectedSetting === setting ? '#B49837' : 'transparent', // highlight
      color: selectedSetting === setting ? 'white' : 'black' // change color text
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
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div>
            <h2 style={{ fontSize: '20px' }}> Scale X </h2>
            <TickedSlider value={scaleXSlider} onChange={handleScaleXChange} ticks={[0, 25, 50, 75, 100]} />
          </div>
          <br></br>
          <div>
            <h2 style={{ fontSize: '20px' }}> Scale Y </h2>
            <TickedSlider value={scaleYSlider} onChange={handleScaleYChange} ticks={[0, 25, 50, 75, 100]} />
          </div>
          <br></br>
          <div>
            <h2 style={{ fontSize: '20px' }}> Screen Size </h2>
            <TickedSlider value={screenSizeSlider} onChange={handleScreenSizeSliderChange} ticks={[0, 25, 50, 75, 100]} />
          </div>
          <br></br>
    
          <h2 style={{ fontSize: '15px' }}> Edit Number of Shakes </h2>
          <form>
            {/* add onsubmit */}
            <label>
              <input style={{ borderColor: 'black', borderWidth: 1, marginLeft: '15px', marginRight: '15px' }} type="text" />
            </label>
            <br></br>
          </form>
          <br></br>
    
          <div>
            <h2 style={{ fontSize: '20px' }}> Sleep </h2>
            <TickedSlider value={sleepSlider} onChange={handleSleepSliderChange} ticks={[0, 25, 50, 75, 100]} />
          </div>
    
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
            <button style={getThreshStyle('Low')} onClick={() => handleThreshChange('Low')}>
              Low
            </button>
            <button style={getThreshStyle('Medium')} onClick={() => handleThreshChange('Medium')}>
              Medium
            </button>
            <button style={getThreshStyle('High')} onClick={() => handleThreshChange('High')}>
              High
            </button>
          </div>
        </div>
      );
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
        
      <h2 style={{fontSize: '30px'}}>Select Device</h2>
      <select 
        value={deviceName}
        onChange={handleNewDevice}
        style={{
          padding: '10px',
          borderRadius: '5px',
          outline: 'none',
          cursor: 'pointer',
          marginBottom: '20px',
          border: '2px solid #B49837'
        }}
        >
        <option value="">Choose your device here!</option>
        {/* need to get these values from the config file, hardcode for now? */}
        <option value="device1">My Device 1</option>
        <option value="device2">My Device 2</option>
        <option value="device3">My Device 3</option>

        </select>

        {/* <View style={{
            borderStyle: 'dotted',
            borderWidth: 1,
            borderRadius: 1,
          }}>
        </View> */}

        <DashedLine />
        <br></br>


      <h2 style={{fontSize: '20px'}}> Edit Nickname </h2>
      <form >
        <label>
          Name:  
          <input style={{borderColor: 'black', borderWidth: 1, marginLeft: '15px', marginRight: '15px'}} type="text" />
        </label>
        <br></br>
        </form>

        <br></br>


      <h2 style={{fontSize: '20px'}}> Hardware UID </h2>
      {/* value to be read in from config  */}
      <input style={{borderColor: 'black', borderWidth: 1, paddingLeft: '15px', marginLeft: '15px', marginRight: '15px'}} className="e-input" type="text" placeholder="UID Here" value="" readOnly={true}/>
      <br></br>
      <br></br>

      <h2 style={{fontSize: '20px'}}> Device Interface </h2>
      <select 
        value={selectedDevice} 
        onChange={handleDeviceChange}
        style={{
          padding: '10px',
          borderRadius: '5px',
          outline: 'none',
          cursor: 'pointer',
          marginBottom: '20px',
          border: '2px solid #B49837'
        }}
      >
        <option value="">Select an interface</option>
        <option value="inter1">Interface 1</option>
        <option value="inter2">Interface 2</option>
        <option value="inter3">Interface 3</option>
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
          <h2 style={{fontSize: '20px'}}> Screen Size </h2>
          <br></br>
          <p style={{fontSize: '15px'}}>Height</p>
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

            <p style={{fontSize: '15px'}}>Width</p>
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

            <h2 style={{fontSize: '20px'}}> Operation Mode </h2>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
            <button style={getOpStyle('Gesture Mouse')} onClick={() => handleOpChange('Gesture Mouse')}>Gesture Mouse</button>
            <button style={getOpStyle('Pointer')} onClick={() => handleOpChange('Pointer')}>Pointer</button>
            <button style={getOpStyle('Clicker')} onClick={() => handleOpChange('Clicker')}>Clicker</button>
            <button style={getOpStyle('TV Remote')} onClick={() => handleOpChange('TV Remote')}>TV Remote</button>
            <button style={getOpStyle('Practice')} onClick={() => handleOpChange ('Practice')}>Practice</button>

            </div>
            {opMode == 'Gesture Mouse' && <MouseOptions />}
            {/* {opMode == 'Pointer'} idk what to do here */}
            {opMode == 'Clicker' && <ClickerOptions/>}
            {opMode == 'TV Remote' && <TVRemoteOptions/>}

            
            
          
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
