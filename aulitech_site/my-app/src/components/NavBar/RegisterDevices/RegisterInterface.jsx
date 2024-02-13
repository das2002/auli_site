import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, setDoc, getDocs, setDocs, Firestore, FieldValue, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import * as clickerDefault from '../cato_schemas/clicker.json';
import * as mouseDefault from '../cato_schemas/mouse.json';
import * as gestureDefault from '../cato_schemas/gesture.json';
import * as tvRemoteDefault from '../cato_schemas/tv_remote.json';
import * as clickerBindings from '../cato_schemas/bindings/clicker_bindings.json';
import * as tvRemoteBindings from '../cato_schemas/bindings/tv_remote_bindings.json';
import * as gestureMouseBindings from '../cato_schemas/bindings/gesture_mouse_bindings.json';

import * as practiceDefault from '../cato_schemas/practice.json';
import * as connectionSpecificDefault from '../cato_schemas/connection_specific.json';
import * as operationDefault from '../cato_schemas/operation.json';

const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

const RegisterInterface = ({ user, devices }) => {
  const { deviceName } = useParams();
  const navigate = useNavigate();
  console.log('user', user);

  const handleCancel = () => {
    navigate(`/devices/${deviceName}`);
  };

  const thisDevice = devices.find(device => device.data.device_info.device_nickname === deviceName);
  console.log('thisDevice', thisDevice);

  const [interfaceName, setInterfaceName] = useState("");
  const [isInterfaceFocused, setIsInterfaceFocused] = useState(false);
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
    console.log("Save button clicked"); 

    if (interfaceName.trim() === "" || operationMode.trim() === "") {
      alert("Please fill out all fields before saving.");
      return;
    }

    console.log('selected device', thisDevice.data.device_info.device_nickname);

    try {

      const getConnections = async () => {
        // parse thru and check if int name already exists TODO 
        // get the list of the current connection names for thisDevice
        let currentConnections = [];
        for (let i = 0; i < thisDevice.data.connections.length; i++) {
          currentConnections.push(thisDevice.data.connections[i].name);
        }
        if (currentConnections.includes(interfaceName)) {
          alert("Connection name already exists for this device");
          return;
        }

        if (operationMode === "") {
          alert("Please select an operation mode");
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
          ...clickerOperation,
          ...clickerDefault,
          ...clickerBindings,
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
          ...gestureMouseBindings,
        };
        if (gestureMouseData.default) {
          delete gestureMouseData.default;
        }
        let tvRemoteOperation = deepCopy(operationDefault);
        tvRemoteOperation.operation_mode.value = 'tv_remote';
        tvRemoteData = {
          ...tvRemoteOperation,
          ...tvRemoteDefault,
          ...gestureDefault,
          ...tvRemoteBindings,
        };
        if (tvRemoteData.default) {
          delete tvRemoteData.default;
        }
        let pointerOperation = deepCopy(operationDefault);
        pointerOperation.operation_mode.value = 'pointer';
        pointerData = {
          ...pointerOperation,
          ...mouseDefault,
        };
        if (pointerData.default) {
          delete pointerData.default;
        }

        let practiceOperation = deepCopy(operationDefault);
        practiceOperation.operation_mode.value = 'practice';
        practiceData = {
          ...practiceOperation,
          ...gestureDefault,
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
          connection_config: JSON.stringify(connectionData),
          current_mode: operationMode,
          mode
        }
        console.log('firebaseMap: ', firebaseMap);

        await Promise.all([
          updateDoc(docRef, {
            connections: arrayUnion(firebaseMap),
            'device_info.calibrated': false,
          }),
        ]);

        console.log("Connection registered successfully");
      };
      await getConnections();
      navigate(`/devices/${deviceName}`);
      window.location.reload();

    } catch (error) {
      console.log("add connection doc to usersCato connections error: ", error);
    }
  };

  if (!thisDevice) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="shrink-0 bg-transparent">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight py-1">
            Register new connection for {deviceName}
          </h2>
        </div>
      </header>

      <div className="border-b border-gray-200 pb-5">
        <p className="max-w-4xl text-lg text-gray-900">
          To associate a new connection with {deviceName}, connect {deviceName} to your computer via cable.
        </p>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-5 mt-10">
          <div className="px-4 py-5 sm:p-6 lg:px-8">
            <h3 className="text-xl font-semibold leading-6 text-gray-900">
              Name your Connection
            </h3>
            <div className="mt-5">
              <label htmlFor="interface-name" className="block text-lg text-gray-900">
                Enter a name for your connection below:
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
              When you click <strong>Save</strong>, your browser will ask if you want to allow access to the device. Allow access in order to register the connection.
            </p>
            <div className="mt-6 flex justify-end">
              {/* cancel button */}
              <button
                type="button"
                onClick={handleCancel}
                className="mr-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              {/* save button */}
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
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
