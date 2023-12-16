import React, { useState } from 'react';

const Devices = () => {
  const [selectedDevice, setSelectedDevice] = useState('');

  const handleDeviceChange = (event) => {
    setSelectedDevice(event.target.value);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Devices</h1>
      <p>This is the Devices page where you can manage and view connected devices.</p>
      
      <select 
        value={selectedDevice} 
        onChange={handleDeviceChange}
        style={{
          padding: '10px',
          borderRadius: '5px',
          outline: 'none',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        <option value="">Select a device</option>
        <option value="device1">Device 1</option>
        <option value="device2">Device 2</option>
        <option value="device3">Device 3</option>
      </select>

      {selectedDevice && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
          <button style={{ padding: '10px 20px', fontSize: '16px' }}>TV</button>
          <button style={{ padding: '10px 20px', fontSize: '16px' }}>Mac</button>
          <button style={{ padding: '10px 20px', fontSize: '16px' }}>Wheelchair</button>
          <button style={{ padding: '10px 20px', fontSize: '16px' }}>iPad</button>
        </div>
      )}
    </div>
  );
};

export default Devices;
