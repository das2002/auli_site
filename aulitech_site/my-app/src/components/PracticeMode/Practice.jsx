import React, { useState, useEffect } from 'react';

const App = () => {
    const [bluetoothDevice, setBluetoothDevice] = useState[null];
    const [browserSupport, setBrowserSupport] = useState[false];
    const [connectionStatus, setConnectionStatus] = useState[false];
    const [practiceModeStatus, setPracticeModeStatus] = useState[false];

    //check if the browser allows for bluetooth
        //if yes
            //check the bluetooth connection
                // if there is a connection 
                    //edit the config file for the user and change into practice mode
                    //display the textbox for the user to be able to test out practice mode
                // if there is no connection 
                    //display a set of instructions for the user to be able to connect to bluetooth mode
        // if no
            // request that they switch to a browser that supports bluetooth
    useEffect(() => {
        if(!navigator.bluetooth) {
            setBrowserSupport(false);
        } else {
            setBrowserSupport(true);
            checkBluetoothSupport();
        }
    }, []);

    let auliDevices = []
    const checkBluetoothConnection = () => {
        navigator.bluetooth.getDevices()
        .then(devices => {
            devices.forEach(device => {
                if (device.name.includes("Cato")) {
                    auliDevices.push(device);
                }
            })
        })
        .then(() => {
            if (auliDevices.length > 0) {
                setBluetoothDevice(auliDevices[0]);
                setConnectionStatus(true);
                let modified = modifyDeviceFile(bluetoothDevice);
                if (modified) {
                    setPracticeModeStatus(true);
                } else {
                    setPracticeModeStatus(false);
                }
            } else {
                setConnectionStatus(false);
            }
        })
        .catch(error => {
            console.error('Connection failed', error);
        });
    }
    
    

}



const checkDeviceConnection = ({onConnected, onNotFound}) => {
    useEffect(() => {
        let auliDevices = [];
        let resolution = false;
        console.log("Checking for Cato Bluetooth device...")
        if (navigator.bluetooth) {
            navigator.bluetooth.getDevices()
            .then(devices => {
                devices.forEach(device => {
                    if (device.name.includes("Cato")) {
                        auliDevices.push(device);
                    }
                })
            })
            .then(() => {
                if (auliDevices.length > 0) {
                    resolution = true;
                    onConnected(auliDevices[0]); 
                } else {
                    onNotFound();
                } 
            })
            .catch(
                error => {
                    console.log(error);
                }
            )
            .finally(() => {
                if (!resolution) {
                    onNotFound();
                }
            });
        } else {
            return <div>Bluetooth not supported by browser.</div>;
        }
    }, [onConnected, onNotFound]);
    return <div className="loading">Loading...</div>;
}

const ConnectionInstructions = ({onRetry}) => {
    return (
        <div>
            <p>Cato not connected via Bluetooth. Please make sure to connect your Cato to this edvice in order to activate practice mode.</p>
            <button onClick={onRetry}> Refresh </button>
        </div>
    );
};

async function connectAndModifyDeviceFile(device) {
    try {
        // we have the name of the device
        // request the specific device and connect to it
        // access the files of that device
        // access the config.json file
        // extract the json from the config.json file
        // edit the specific field
        // write back to the confg.json file
        // save the file
        // close the file
        // return true
    } catch (exceptionVar) {
        //should close the connection and return false
    }
}

// Mock function to simulate file modification on the device
async function modifyDeviceFile(device) {
    try {
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService(serviceUuid)
    }
    
}