import React, { useState } from "react";
import { collection, doc, getDoc, setDoc, getDocs, setDocs } from "firebase/firestore"; 
import { db } from "../../firebase"; 
import * as clickerDefault from './cato_schemas/clicker.json';
import * as mouseDefault from './cato_schemas/mouse.json';
import * as gestureDefault from './cato_schemas/gesture.json';
import * as tvRemoteDefault from './cato_schemas/tv_remote.json';
import * as bindingsDefault from './cato_schemas/bindings.json';



const RegisterInterface = ({ user }) => {
  const [interfaceName, setInterfaceName] = useState("");
  const [bluetoothId, setBluetoothId] = useState("");
  const [isInterfaceFocused, setIsInterfaceFocused] = useState(false);
  const [isBluetoothFocused, setIsBluetoothFocused] = useState(false);
  const [isOpModeFocused, setIsOpModeFocused] = useState(false);
  const [operationMode, setOperationMode] = useState("");

  const focusStyle = {
    borderColor: '#AA9358',
    boxShadow: '0 0 0 2px #AA9358', 
  };

  const handleSave = () => {
    console.log("Save button clicked"); //debug

    if (!user) {
      console.log("No user available");
      return;
    }

    const userId = user.uid;

    if (!userId) {
      console.log("No user ID available");
      return;
    }

    try {
      const getConnections = async () => {
        //parse thru and check if int name already exists TODO 


        const colRef = collection(db, "users");
        const userRef = collection(colRef, userId, "userCatos");
        // console.log('my user ref', userRef);
    
        const querySnapshot =  await getDocs(userRef);
    
        // console.log('my query snapshot', querySnapshot.docs);
        const data = querySnapshot.docs.map((doc) => doc.data());

        console.log('data', data);
        // if (data.device_info.device_nickname == )
        const tempdata = data[0];

        // console.log('temp old', tempdata);

        let combinedData = {}

        if (operationMode == 'clicker') {
          //bindings and clicker
          //lowkey will hardcode picking out which atoms its easier
          combinedData = {
            ...clickerDefault,
            ...bindingsDefault,
          };

        }
        else if (operationMode == 'gesture mouse') {
          combinedData = {
            ...mouseDefault, 
            ...gestureDefault, 
            ...bindingsDefault,
          };
        }

        else if (operationMode == 'tv remote') {
          combinedData = {
            ...tvRemoteDefault, 
            ...gestureDefault, 
            ...bindingsDefault,
          };
        }

        else if (operationMode == 'pointer') {
          combinedData = {
            ...mouseDefault,
            ...bindingsDefault,
          };
        }
        else {
          combinedData = null;
        }

        // console.log(combinedData);

        const stringCombinedData = JSON.stringify(combinedData);

        const firebaseMap = {
          bt_id: bluetoothId,
          configjson: stringCombinedData,
          device_type: interfaceName,
          // Add other fields as needed
        };
            // Add the new connection to the existing connections array
          tempdata.connections = tempdata.connections || [];
          tempdata.connections.push(firebaseMap);

          // Update the document in Firebase
          await setDoc(doc(userRef, "efPwkVh1zjzMVxgfGqLa"), tempdata);
          console.log("Interface registered successfully");

      }
      getConnections();
    }
    catch (error) {
      console.log("add interface doc to usersCato connections error: ", error);
    }




    // getDoc(userRef)
    //   .then(docSnap => {
    //     if (docSnap.exists()) {
    //       const data = docSnap.data();
    //       if (data[interfaceName] || Object.values(data).includes(bluetoothId)) {
    //         console.log("Interface or Bluetooth ID already associated with this device.");
    //         return;
    //       }
    //       return setDoc(userRef, { [interfaceName]: bluetoothId }, { merge: true });
    //     } else {
    //       return setDoc(userRef, { [interfaceName]: bluetoothId });
    //     }
    //   })
    //   .then(() => console.log("Interface registered successfully"))
    //   .catch(error => console.error("Error registering interface: ", error));
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
                Enter your operation mode below (i will change this to a dropdown later):
                </label>
                <input
                type="text"
                id="op-mode"
                value={operationMode}
                onChange={(e) => setOperationMode(e.target.value)}
                onFocus={() => setIsOpModeFocused(true)}
                onBlur={() => setIsOpModeFocused(false)}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-customColor focus:ring-customColor`}
                placeholder="sample-nickname"
                style={isOpModeFocused ? focusStyle : null}
                />
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
