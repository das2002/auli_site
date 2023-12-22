import { error } from 'console';
import { on } from 'events';
import React, {useState, useEffect} from 'react';

const BluetoothDeviceCheck = ({onDeviceConnected}) => {
    const [device, setDevice] = useState(null);

    useEffect(() => {
        navigator.bluetooth.getDevices()
            .then(devices => {
                let deviceList = [];
                devices.forEach(device => {
                    if (device.name.contains("Cato")) {
                        deviceList.push(device);
                    }
                });
                if (deviceList.length > 0) {
                    setDevice(deviceList[0]);
                    onDeviceConnected(true);
                } else {
                    setDevice(null);
                    onDeviceConnected(false);
                }
            })
            .catch(error => {
                console.log(error);
                onDeviceConnected(false);
            });
    }, [device, onDeviceConnected]);

    if (device) {
        return (
            <div>
                <p>Device found: {device.name}</p>
            </div>
        );
    } else {
        return (
            <div>
                <p>No device found</p>
            </div>
        );
    }
    
};
 