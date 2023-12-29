// USBDeviceList.js
import React, { useState } from 'react';

const USBDeviceList = () => {
  const [devices, setDevices] = useState([]);

  const getUSBDevices = async () => {
    try {
      // Request USB device access
      const device = await navigator.usb.requestDevice({ filters: [] });

      // Get a list of connected devices
      const usbDevices = await navigator.usb.getDevices();

      setDevices(usbDevices);
    } catch (error) {
      console.error('Error accessing USB devices:', error);
    }
  };

  // Export the USB devices array
  return [devices, getUSBDevices];
};

export default USBDeviceList;