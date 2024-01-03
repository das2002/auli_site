import React, { useState, useEffect } from "react";
import { collection, doc, getDoc, setDoc, getDocs, setDocs, Firestore, FieldValue, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import * as clickerDefault from './cato_schemas/clicker.json';
import * as mouseDefault from './cato_schemas/mouse.json';
import * as gestureDefault from './cato_schemas/gesture.json';
import * as tvRemoteDefault from './cato_schemas/tv_remote.json';
import * as bindingsDefault from './cato_schemas/bindings.json';
import * as connectionSpecificDefault from './cato_schemas/connection_specific.json';



const RegisterInterface = ({ user }) => {
  const [interfaceName, setInterfaceName] = useState("");
  const [bluetoothId, setBluetoothId] = useState("");
  const [isInterfaceFocused, setIsInterfaceFocused] = useState(false);
  const [isBluetoothFocused, setIsBluetoothFocused] = useState(false);
  const [isOpModeFocused, setIsOpModeFocused] = useState(false);
  const [operationMode, setOperationMode] = useState("");
  const [userCatosList, setUserCatosList] = useState([]); // this is the list of all the nicknames of userCatos
  const [userDeviceData, setUserDeviceData] = useState(null); //this is the result of pulling everything under userCatos
  const [selectedDevice, setSelectedDevice] = useState(''); // this is the device that is selected from the Select Device dropdown
  const [selectedDeviceData, setSelectedDeviceData] = useState(null); // this is the data associated with the device that is selected


  if (!user) {
    console.log("No user available");
  }

  const userId = user.uid;

  if (!userId) {
    console.log("No user ID available");
  }


  const handleDeviceSelection = async (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === 'Select A Device Here') {
      setSelectedDevice('');
      setSelectedDeviceData(null);
    } else {
      setSelectedDevice(selectedValue);
      for (let i = 0; i < userCatosList.length; i++) {
        if (userCatosList[i].device_info.device_nickname == event.target.value) {
          const docID = await getDocID(userId, i);
          console.log('testing', docID);
          setSelectedDeviceData(docID);
          break;
        }
      }
    }
  };



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

    console.log('selected device', selectedDevice);

    if (selectedDevice == 'Select A Device Here' || selectedDevice == '') {
      console.log('Please choose a device');
      return;
    }

    try {

      const getConnections = async () => {
        //parse thru and check if int name already exists TODO 
        console.log('list of catos', userCatosList);

        const colRef = collection(db, "users");
        const userRef = collection(colRef, userId, "userCatos");
        const docRef = doc(userRef, selectedDeviceData);

        // console.log('my user ref', userRef);

        //const querySnapshot =  await getDocs(userRef);

        // console.log('my query snapshot', querySnapshot.docs);
        // const data = querySnapshot.docs.map((doc) => doc.data());


        let tempdata = null;

        //iterate through userCatosList and find the one that matches the selected device
        for (let i = 0; i < userCatosList.length; i++) {
          if (userCatosList[i].device_info.device_nickname == selectedDevice) {
            tempdata = userCatosList[i];
            break;
          }
        }
        // console.log('temp old', tempdata);
        let combinedData = {}

        console.log('tempdata', tempdata);

        //iterate through connectionSpecificDefault and add the fields to combinedData
        for (const [key, value] of Object.entries(connectionSpecificDefault)) {
          combinedData[key] = value;
        }

        console.log('combinedData', combinedData);

        if (operationMode == 'clicker') {
          //bindings and clicker
          //lowkey will hardcode picking out which atoms its easier
          combinedData = {
            ...combinedData,
            ...clickerDefault,
            ...bindingsDefault,
          };
          combinedData.operation_mode.value = 'clicker'

        }
        else if (operationMode == 'gesture_mouse') {
          combinedData = {
            ...combinedData,
            ...mouseDefault,
            ...gestureDefault,
            ...bindingsDefault,
          };
          combinedData.operation_mode.value = 'gesture_mouse'

        }

        else if (operationMode == 'tv_remote') {
          combinedData = {
            ...combinedData,
            ...tvRemoteDefault,
            ...gestureDefault,
            ...bindingsDefault,
          };
          combinedData.operation_mode.value = 'tv_remote'
        }

        else if (operationMode == 'pointer') {
          combinedData = {
            ...combinedData,
            ...mouseDefault,
            ...bindingsDefault,
          };
          combinedData.operation_mode.value = 'pointer'
        }
        else {
          combinedData = null;
        }

        console.log(combinedData);

        const stringCombinedData = JSON.stringify(combinedData);

        const firebaseMap = {
          bt_id: bluetoothId,
          configjson: stringCombinedData,
          device_type: interfaceName,
          operation_mode: operationMode,
          // Add other fields as needed
        };
        // Add the new connection to the existing connections array
        //tempdata.connection = tempdata.connection || [];
        //tempdata.connection.push(firebaseMap);

        // Update the document in Firebase
        //await setDoc(doc(userRef, selectedDeviceData, 'connection'), tempdata);

        console.log('firebaseMap: ', firebaseMap);
        
        await Promise.all([
          updateDoc(docRef, {
            connection: arrayUnion(firebaseMap)
          }),
        ])

        /*
                docRef.update({
          connection: FieldValue.arrayUnion(firebaseMap),
        })
          .then(() => {
            console.log("Document successfully updated!");
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
        */

        console.log("Interface registered successfully");

        //setUserCatosList([]);

      }
      await getConnections();

      window.location.reload();

    }
    catch (error) {
      console.log("add interface doc to usersCato connections error: ", error);
    }
  };

  return (
    <div className="flex min-h-full flex-col">
      <header className="shrink-0 bg-transparent">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight py-1">
            Register new interface
          </h2>
        </div>
      </header>

      <div className="border-b border-gray-200 pb-5">
        <p className="max-w-4xl text-lg text-gray-900">
          To associate a new interface with a Cato device, connect your Cato device to your computer via cable.
        </p>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-5 mt-10">
          <div className="px-4 py-5 sm:p-6 lg:px-8">

            <h3> Choose Device </h3>
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
                <option key={index} value={userCato.device_info.device_nickname}>
                  {userCato.device_info.device_nickname}
                </option>
              ))}
            </select>

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
