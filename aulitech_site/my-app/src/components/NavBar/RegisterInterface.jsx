import React, { useState } from "react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore"; 
import { db } from "../../firebase"; 

const RegisterInterface = ({ userId }) => {
  const [interfaceName, setInterfaceName] = useState("");
  const [bluetoothId, setBluetoothId] = useState("");
  const [isInterfaceFocused, setIsInterfaceFocused] = useState(false);
  const [isBluetoothFocused, setIsBluetoothFocused] = useState(false);

  const focusStyle = {
    borderColor: '#AA9358',
    boxShadow: '0 0 0 2px #AA9358', 
  };

  const handleSave = () => {
    console.log("Save button clicked"); //debug

    if (!userId) {
      console.log("No user ID available");
      return;
    }

    const userRef = doc(db, "users", userId, "userCatos", "connections");
    getDoc(userRef)
      .then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data[interfaceName] || Object.values(data).includes(bluetoothId)) {
            console.log("Interface or Bluetooth ID already associated with this device.");
            return;
          }
          return setDoc(userRef, { [interfaceName]: bluetoothId }, { merge: true });
        } else {
          return setDoc(userRef, { [interfaceName]: bluetoothId });
        }
      })
      .then(() => console.log("Interface registered successfully"))
      .catch(error => console.error("Error registering interface: ", error));
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
