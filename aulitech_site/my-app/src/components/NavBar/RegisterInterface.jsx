import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, setDoc, getDocs, setDocs, Firestore, FieldValue, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import * as clickerDefault from './cato_schemas/clicker.json';
import * as mouseDefault from './cato_schemas/mouse.json';
import * as gestureDefault from './cato_schemas/gesture.json';
import * as tvRemoteDefault from './cato_schemas/tv_remote.json';
import * as bindingsDefault from './cato_schemas/bindings.json';
import * as practiceDefault from './cato_schemas/practice.json';
import * as connectionSpecificDefault from './cato_schemas/connection_specific.json';
import * as operationDefault from './cato_schemas/operation.json';

const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

const RegisterInterface = ({ user, devices }) => {
  const { deviceName } = useParams();
  const navigate = useNavigate();
  console.log('user', user);

  const thisDevice = devices.find(device => device.data.device_info.device_nickname === deviceName);
  console.log('thisDevice', thisDevice);

  const [interfaceName, setInterfaceName] = useState("");
  const [bluetoothId, setBluetoothId] = useState("");
  const [isInterfaceFocused, setIsInterfaceFocused] = useState(false);
  const [isBluetoothFocused, setIsBluetoothFocused] = useState(false);
  const [isOpModeFocused, setIsOpModeFocused] = useState(false);
  const [operationMode, setOperationMode] = useState("");
  const [userCatosList, setUserCatosList] = useState([]); // this is the list of all the nicknames of userCatos
  const [userDeviceData, setUserDeviceData] = useState(null); //this is the result of pulling everything under userCatos
  //const [selectedDevice, setSelectedDevice] = useState(''); // this is the device that is selected from the Select Device dropdown
  //const [selectedDeviceData, setSelectedDeviceData] = useState(null); // this is the data associated with the device that is selected


  if (!user) {
    console.log("No user available");
  }

  const userId = user.uid;

  if (!userId) {
    console.log("No user ID available");
  }



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

  const getDeviceData = async (userId) => {
    try {
      const releasesRef = collection(db, 'users', userId, 'userCatos');
      const querySnapshot = await getDocs(releasesRef);
      // console.log('qd', querySnapshot.docs);
      const data = querySnapshot.docs.map((doc) => doc.data());
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  useEffect(() => {
    console.log('userId: ', userId);
    const fetchData = async () => {
      try {
        const userDeviceDataValue = await getDeviceData(userId);
        const test = await getDocID(userId, 0);
        console.log('helo', test);
        setUserDeviceData(userDeviceDataValue);
      } catch (error) {
        console.error('error fetching data:', error);
      }
    };
    fetchData();
  }, [userId]);


  useEffect(() => {
    console.log('userDeviceData: ', userDeviceData);
    if (userDeviceData) {
      for (let i = 0; i < userDeviceData.length; i++) {
        setUserCatosList(userCatosList => [...userCatosList, userDeviceData[i]]);
      }
    }
  }, [userDeviceData]);


  const focusStyle = {
    borderColor: '#AA9358',
    boxShadow: '0 0 0 2px #AA9358',
  };

  const handleSave = async () => {
    console.log("Save button clicked"); //debug

    console.log('selected device', thisDevice.data.device_info.device_nickname);

    try {

      const getConnections = async () => {
        //parse thru and check if int name already exists TODO 
        // get the list of the current connection names for thisDevice
        let currentConnections = [];
        for (let i = 0; i < thisDevice.data.connections.length; i++) {
          currentConnections.push(thisDevice.data.connections[i].name);
        }
        if (currentConnections.includes(interfaceName)) {
          alert("Interface name already exists for this device");
          return;
        }

        const colRef = collection(db, "users");
        console.log('colRef', colRef);
        const userRef = collection(colRef, userId, "userCatos");
        console.log('userRef', userRef);

        
        const docRef = doc(userRef, thisDevice.id);
        console.log('docRef', docRef);

        // console.log('temp old', tempdata);
        let connectionData = {}
        let clickerData = {}
        let pointerData = {}
        let tvRemoteData = {}
        let gestureMouseData = {}
        let practiceData = {}


        //iterate through connectionSpecificDefault and add the fields to combinedData
        for (const [key, value] of Object.entries(connectionSpecificDefault)) {
          connectionData[key] = value;
        }

        console.log('connectionData', connectionData);

        delete connectionData.default;

        let clickerOperation = deepCopy(operationDefault);
        clickerOperation.operation_mode.value = 'clicker';
        clickerData = {
          // ...connectionData,
          ...clickerOperation,
          ...clickerDefault,
          ...bindingsDefault,
        };
        if (clickerData.default) {
          delete clickerData.default;
        }

        let gestureMouseOperation = deepCopy(operationDefault);
        gestureMouseOperation.operation_mode.value = 'gesture_mouse';
        gestureMouseData = {
          ...gestureMouseOperation,
          ...mouseDefault,
          ...gestureDefault,
          ...bindingsDefault
        };
        if (gestureMouseData.default) {
          delete gestureMouseData.default;
        }
        let tvRemoteOperation = deepCopy(operationDefault);
        tvRemoteOperation.operation_mode.value = 'tv_remote';
        tvRemoteData = {
          // ...connectionData,
          ...tvRemoteOperation,
          ...tvRemoteDefault,
          ...gestureDefault,
          ...bindingsDefault,
        };
        if (tvRemoteData.default) {
          delete tvRemoteData.default;
        }
        let pointerOperation = deepCopy(operationDefault);
        pointerOperation.operation_mode.value = 'pointer';
        pointerData = {
          ...pointerOperation,
          ...mouseDefault,
          ...bindingsDefault,
        };
        if (pointerData.default) {
          delete pointerData.default;
        }

        let practiceOperation = deepCopy(operationDefault);
        practiceOperation.operation_mode.value = 'practice';
        practiceData = {
          ...practiceOperation,
          ...gestureDefault,
          ...bindingsDefault,
          ...practiceDefault,
        }
        if (practiceData.default) {
          delete practiceData.default;
        }

        let mode = {};

        mode["clicker"] = JSON.stringify(clickerData);
        mode["pointer"] = JSON.stringify(pointerData);
        mode["gesture_mouse"] = JSON.stringify(gestureMouseData);
        mode["tv_remote"] = JSON.stringify(tvRemoteData);
        mode["practice"] = JSON.stringify(practiceData);

        const firebaseMap = {
          name: interfaceName,
          bt_id: bluetoothId,
          connection_config: JSON.stringify(connectionData),
          mode
        }
        console.log('firebaseMap: ', firebaseMap);

        await Promise.all([
          updateDoc(docRef, {
            connections: arrayUnion(firebaseMap)
          }),
        ]);

        console.log("Interface registered successfully");


      };
      await getConnections();
      window.location.reload();
    } catch (error) {
      console.log("add interface doc to usersCato connections error: ", error);
    }
  };

  if (!thisDevice) {
    return <div>Device not found</div>;
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="shrink-0 bg-transparent">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight py-1">
            Register new interface for {deviceName}
          </h2>
        </div>
      </header>

      <div className="border-b border-gray-200 pb-5">
        <p className="max-w-4xl text-lg text-gray-900">
          To associate a new interface with {deviceName}, connect {deviceName} to your computer via cable.
        </p>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-5 mt-10">
          <div className="px-4 py-5 sm:p-6 lg:px-8">
            <h3 className="text-xl font-semibold leading-6 text-gray-900">
              Name your Interface
            </h3>
            <div className="mt-5">
              <label htmlFor="interface-name" className="block text-lg text-gray-900">
                Enter a name for your interface below:
              </label>
              <input
                type="text"
                id="interface-name"
                value={interfaceName}
                onChange={(e) => setInterfaceName(e.target.value)}
                onFocus={() => setIsInterfaceFocused(true)}
                onBlur={() => setIsInterfaceFocused(false)}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-customColor focus:ring-customColor`}
                placeholder="sample-nickname"
                style={isInterfaceFocused ? focusStyle : null}
              />
            </div>

            <div className="mt-5">
              <label htmlFor="bluetooth-id" className="block text-lg text-gray-900">
                Enter the Bluetooth ID for your device:
              </label>
              <input
                type="text"
                id="bluetooth-id"
                value={bluetoothId}
                onChange={(e) => setBluetoothId(e.target.value)}
                onFocus={() => setIsBluetoothFocused(true)}
                onBlur={() => setIsBluetoothFocused(false)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                placeholder="sample-bluetooth-id"
                style={isBluetoothFocused ? focusStyle : null}
              />
            </div>
            <div className="mt-5">
              <label htmlFor="op-mode" className="block text-lg text-gray-900">
                Select your operation mode below:
              </label>
              <select
                id="op-mode"
                value={operationMode}
                onChange={(e) => setOperationMode(e.target.value)}
                onFocus={() => setIsOpModeFocused(true)}
                onBlur={() => setIsOpModeFocused(false)}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-customColor focus:ring-customColor`}
                style={isOpModeFocused ? focusStyle : null}
              >
                <option value="">Select an operation mode</option>
                <option value="pointer">Pointer</option>
                <option value="clicker">Clicker</option>
                <option value="gesture_mouse">Gesture Mouse</option>
                <option value="tv_remote">TV Remote</option>
              </select>
            </div>


            <p className="mt-5 text-lg text-gray-900">
              When you click <strong>Save</strong>, your browser will ask if you want to allow access to the device. Allow access in order to register the interface.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterInterface;
