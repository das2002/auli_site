import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';

const DeviceRegistration = () => {
    const [deviceName, setDeviceName] = useState('Loading...');
    const [docSnap, setDocSnap] = useState(null);
    const docId = "VscD0ZIA3b5uqdK1Kxdl"; //change this so it adjusts to users later

    useEffect(() => {
        const fetchDeviceInfo = async () => {
            const docRef = doc(db, "users/NX4mlsPNKKTBjcVtHRKDuctB7xT2/userCatos", docId);
            try {
                const snapshot = await getDoc(docRef);
                if (snapshot.exists()) {
                    setDocSnap(snapshot);
                    setDeviceName(snapshot.data().device_info.device_nickname);
                } else {
                    console.log("No such document!");
                    setDeviceName(''); 
                }
            } catch (error) {
                console.error("Error fetching document: ", error);
                setDeviceName(''); 
            }
        };

        fetchDeviceInfo();
    }, [docId]);

    const handleDeviceNameChange = (e) => {
        setDeviceName(e.target.value);
    };

    const handleDelete = async () => {
        const docRef = doc(db, "users/NX4mlsPNKKTBjcVtHRKDuctB7xT2/userCatos", docId);
        try {
            await deleteDoc(docRef);
            console.log("Document successfully deleted!");
        } catch (error) {
            console.error("Error removing document: ", error);
        }
    };

    const ConnectionsSection = ({ snapshot }) => {
        if (!snapshot) return null;
    
        const deviceInfo = snapshot.data().device_info;
        const connectionInfo = snapshot.data().connections;
        if (connectionInfo && connectionInfo.length > 0) { // check if there's at least one connection
            const currentMode = connectionInfo[0].current_mode;
            return (
                <div>
                    <p>Connection: {currentMode}</p>
                </div>
            );
        } else {
            return (
                <div>
                    <p>No connections available</p>
                </div>
            );
        }
    };

    const GlobalInfoSection = ({ snapshot }) => {
        if (!snapshot) return null;
        
        const deviceInfo = snapshot.data().device_info;
        const orientationInfo = deviceInfo?.orientation;
        //snapshot.data().device_info.device_nickname
        return (
            <div>
                <p>hw_uid: {deviceInfo?.hw_uid}</p>
                <p>sleep: {deviceInfo?.sleep}</p>
                <p>orientation: </p>
                {orientationInfo && (
                    <ul>
                        {Object.entries(orientationInfo).map(([key, orientation]) => (
                            <li key={key}>
                                {key}: {orientation.value}
                                <ul>
                                    {orientation.options.map((option, index) => (
                                        <li key={index}>{option}</li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                )}
                <p>calibration: {JSON.stringify(deviceInfo?.calibration)}</p>
            </div>
        );
    };

    return (
        <div className="device-registration">
            <h1 className="text-3xl font-bold mb-6">Device Registration</h1>
            <div className="flex items-center mb-6 gap-x-4">
                <input
                    type="text"
                    value={deviceName}
                    onChange={handleDeviceNameChange}
                    className="text-xl font-semibold p-2 rounded border-2 border-gray-300 w-1/3"
                />
                <button 
                    onClick={handleDelete} 
                    className="text-xl font-bold py-2 px-4 rounded bg-red-500 hover:bg-red-700 text-white"
                >
                    Delete
                </button>
            </div>
            <div className="border-t border-line border-gray-400 my-4" />
            <div className="flex items-start gap-x-4 mb-4"> 
                <button className="text-xl font-bold py-4 px-8 rounded bg-blue-700 hover:bg-blue-900 text-white">
                    Global Info
                </button>
                {docSnap && <GlobalInfoSection snapshot={docSnap} />}
            </div>
            <div className="border-t border-line border-gray-400 my-4" />
            <div>
                <button className="text-xl font-bold py-4 px-8 rounded bg-blue-700 hover:bg-blue-900 text-white">
                    Connections
                </button>
                {docSnap && <ConnectionsSection snapshot={docSnap} />}
            </div>
            <div className="border-t border-line border-gray-400 my-4" />
        </div>
    );
};

export default DeviceRegistration;
