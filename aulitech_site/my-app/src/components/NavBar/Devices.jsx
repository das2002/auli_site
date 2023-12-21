import React, { useState } from 'react';
import Slider from 'react-slider';
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
              width: '100%',
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
            {state.valueNow}
          </div>
        )}
      />
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
    const [slider1Value, setSlider1Value] = useState(50);
    const [slider2Value, setSlider2Value] = useState(25);
    const [slider3Value, setSlider3Value] = useState(75);
    const [slider4Value, setSlider4Value] = useState(0);
    const [threshold, setThreshold] = useState('');

  const handleSlider1Change = (value) => {
    setSlider1Value(value);
  };

  const handleSlider2Change = (value) => {
    setSlider2Value(value);
  };

  const handleSlider3Change = (value) => {
    setSlider3Value(value);
  };

  const handleSlider4Change = (value) => {
    setSlider4Value(value);
  };
  
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

            <div style={{ textAlign: 'center', padding: '20px' }}>
              <h2 style={{fontSize: '20px'}}> Scale X </h2>
              <TickedSlider value={slider1Value} onChange={handleSlider1Change} ticks={[0, 25, 50, 75, 100]} />
              <br></br>
              <h2 style={{fontSize: '20px'}}> Scale Y </h2>
              <TickedSlider value={slider2Value} onChange={handleSlider2Change} ticks={[0, 25, 50, 75, 100]} />
              <br></br>
              <h2 style={{fontSize: '20px'}}> Screen Size </h2>
              <TickedSlider value={slider3Value} onChange={handleSlider3Change} ticks={[0, 25, 50, 75, 100]} />
              <br></br>
            </div>


            <h2 style={{fontSize: '15px'}}> Edit Number of Shakes </h2>
            <form >
              {/* add onsubmit */}
              <label>
                <input style={{borderColor: 'black', borderWidth: 1, marginLeft: '15px', marginRight: '15px'}} type="text" />
              </label>
              <br></br>
              </form>

            <br></br>

            <h2 style={{fontSize: '20px'}}> Sleep </h2>
            <TickedSlider value={slider4Value} onChange={handleSlider4Change} ticks={[0, 25, 50, 75, 100]} />


            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
            <button style={getThreshStyle('Low')} onClick={() => handleThreshChange('Low')}>Low</button>
            <button style={getThreshStyle('Medium')} onClick={() => handleThreshChange('Medium')}>Medium</button>
            <button style={getThreshStyle('High')} onClick={() => handleThreshChange('High')}>High</button>

            </div>
          
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
