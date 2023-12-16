import React, { useState } from 'react';

const Devices = () => {
    const [selectedDevice, setSelectedDevice] = useState('');
    const [selectedSetting, setSelectedSetting] = useState('');
  
    const handleDeviceChange = (event) => {
      setSelectedDevice(event.target.value);
      setSelectedSetting(''); // Reset setting selection when device changes
    };
  
    const handleSettingClick = (setting) => {
      setSelectedSetting(setting);
    };
  
    const paragraphStyle = {
      marginBottom: '40px',
      textAlign: 'left'
    };
  
    // Modified button style function
    const getButtonStyle = (setting) => ({
      padding: '10px 20px',
      fontSize: '16px',
      border: '2px solid darkblue',
      cursor: 'pointer',
      borderRadius: '5px',
      backgroundColor: selectedSetting === setting ? 'darkblue' : 'transparent', // highlight
      color: selectedSetting === setting ? 'white' : 'black' // change color text
    });
  
    const settingsBoxStyle = {
      width: '80%',
      height: '150px',
      margin: '20px auto',
      borderRadius: '15px',
      backgroundColor: '#f5f5f5', // Lighter shade of gray
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '24px'
    };

  return (
    <div>
      {/* Header */}
      <header className="flex justify-between bg-transparent border-b border-gray-200">
        <div className="flex h-16 max-w-7xl justify-between items-center">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight py-1">Devices</h2>
        </div>
      </header>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={paragraphStyle}>This is the Devices page where you can manage and view connected devices.</p>
        
      <select 
        value={selectedDevice} 
        onChange={handleDeviceChange}
        style={{
          padding: '10px',
          borderRadius: '5px',
          outline: 'none',
          cursor: 'pointer',
          marginBottom: '20px',
          border: '2px solid darkblue'
        }}
      >
        <option value="">Select a device</option>
        <option value="device1">Device 1</option>
        <option value="device2">Device 2</option>
        <option value="device3">Device 3</option>
      </select>

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
          Settings for {selectedSetting}
        </div>
      )}
    </div>
    </div>

  );
};

export default Devices;
