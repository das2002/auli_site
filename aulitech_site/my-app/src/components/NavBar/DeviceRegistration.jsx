import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';

const DeviceRegistration = () => {
    const [deviceName, setDeviceName] = useState('Loading...');
    const [docSnap, setDocSnap] = useState(null);
    const docId = "VscD0ZIA3b5uqdK1Kxdl"; //hardcoded!!
    const [orientationInfo, setOrientationInfo] = useState({});

    const [showSleepDropdown, setShowSleepDropdown] = useState(false);
    const [sleepMin, setSleepMin] = useState(null);
    const [sleepMax, setSleepMax] = useState(null);

    const handleOrientationChange = (key, newValue) => {
        setOrientationInfo(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                value: newValue
            }
        }));
    };
    
    useEffect(() => {
        const fetchDeviceInfo = async () => {
            const docRef = doc(db, "users/NX4mlsPNKKTBjcVtHRKDuctB7xT2/userCatos", docId);
            try {
                const snapshot = await getDoc(docRef);
                if (snapshot.exists()) {
                    setDocSnap(snapshot);
                    setDeviceName(snapshot.data().device_info.device_nickname);

                    const sleepInfo = JSON.parse(snapshot.data().device_info.global_config).global_info.sleep;
                    setSleepMin(sleepInfo?.value?.timeout?.range?.min);
                    setSleepMax(sleepInfo?.value?.timeout?.range?.max);
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
        const connectionInfo = snapshot.data().connections;
    
        if (connectionInfo && connectionInfo.length > 0) {
            return (
                <div>
                    {connectionInfo.map((connection, index) => (
                        <p key={index}>Connection: {connection.current_mode}</p>
                    ))}
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
        const globalConfig = JSON.parse(deviceInfo["global_config"])["global_info"];

        const orientationInfo = globalConfig["orientation"]["value"];
        const calibrationInfo = globalConfig["calibration"];
        const sleepInfo = globalConfig["sleep"]

        const handleSleepMinChange = (e) => {
            setSleepMin(e.target.value);
            //firebase logic
        };
    
        const handleSleepMaxChange = (e) => {
            setSleepMax(e.target.value);
            //firebase logic
        };
    
        const toggleSleepDropdown = () => {
            setShowSleepDropdown(!showSleepDropdown);
        };

        return (
            <div>
                {/* HW_UID ----------------- */}
                <p>hw_uid: {globalConfig?.HW_UID.value}</p>
                <div className="border-t border-dotted border-gray-400 my-2" />

                {/* sleep ----------------- */}
                <p>sleep: {sleepInfo?.value?.timeout.value}</p>
                <p>sleepMin: {sleepInfo?.value?.timeout.range.min}</p>
                <p>sleepMax: {sleepInfo?.value?.timeout.range.max}</p>
                <div className="border-t border-dotted border-gray-400 my-2" />

                {/* orientation ----------------- */}
                <p>orientation: </p>
                {orientationInfo && (
                    <ul>
                        {Object.entries(orientationInfo || {}).map(([key, info]) => (
                            <li key={key}>
                                <span>{info.label}: </span>
                                <select
                                    id={key}
                                    value={info.value}
                                    onChange={(e) => handleOrientationChange(key, e.target.value)}
                                >
                                    {info.options?.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="border-t border-dotted border-gray-400 my-2" />

                {/* calibration ----------------- */}
                <p>calibration:</p>
                {calibrationInfo && (
                    <ul>
                        <li>
                            auto_samples: {calibrationInfo.value.auto_samples.value}
                        </li>
                        <li>
                            auto_threshold: {calibrationInfo.value.auto_threshold.value}
                        </li>
                    </ul>
                )}
            </div>
        );
    };

    //button UI:
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
