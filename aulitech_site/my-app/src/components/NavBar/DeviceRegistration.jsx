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

    const ConnectionAccordion = ({ connections }) => {
        const [selectedModes, setSelectedModes] = useState({}); 
        const [connectionSettings, setConnectionSettings] = useState({}); //each connection settings
    
        const handleModeChange = (connectionId, mode) => {
            setSelectedModes(prev => ({ ...prev, [connectionId]: mode }));
        };
    
        const handleCommonSettingsChange = (connectionId, settings) => {
            // Update logic for common settings
        };
    
        const handleModeSpecificSettingsChange = (connectionId, mode, settings) => {
            // Update logic for mode-specific settings
        };
    
        const handleSave = (connectionId) => {
            console.log("Saving settings for Connection:", connectionId, connectionSettings[connectionId]);
        };
    
        useEffect(() => {
            const initialSettings = connections.reduce((acc, connection) => {
                acc[connection.id] = {
                    common: connection.common_settings,
                    modeSpecific: connection.mode_specific_settings[connection.current_mode]
                };
                return acc;
            }, {});
            setConnectionSettings(initialSettings);
        }, [connections]);
    
        return (
            <>
                {connections.map((connection, index) => (
                    <div key={connection.id} className="connection">
                        <h3>Connection {index + 1}</h3>
                        {/* Common settings section */}
                        <div>
                            {/* Render common settings here */}
                            {/* Example: <input type="text" value={connectionSettings[connection.id].common.someSetting} onChange={...} /> */}
                        </div>
    
                        {/* Dropdown to select the Active Operation Mode */}
                        <select value={selectedModes[connection.id] || connection.current_mode} onChange={(e) => handleModeChange(connection.id, e.target.value)}>
                            {connection.modes.map(mode => (
                                <option key={mode} value={mode}>{mode}</option>
                            ))}
                        </select>
    
                        {/* Settings associated with the active operation mode */}
                        <div>
                            {/* Render mode-specific settings here */}
                            {/* Example: <input type="text" value={connectionSettings[connection.id].modeSpecific.someSetting} onChange={...} /> */}
                        </div>

                        <button onClick={() => handleSave(connection.id)}>Save</button>
                    </div>
                ))}
            </>
        );
    };    

    const ConnectionsSection = ({ snapshot }) => {
        if (!snapshot) return <p>Loading connections...</p>;
    
        const connectionData = snapshot.data();
        if (!connectionData || !connectionData.connections) {
            return <p>No connections data available</p>;
        }
    
        const connectionInfo = connectionData.connections;
    
        return connectionInfo.length > 0 ? (
            <div>
                {connectionInfo.map((connection, index) => (
                    <p key={index}>Connection: {connection.current_mode}</p>
                ))}
            </div>
        ) : (
            <p>No connections available</p>
        );
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

        const handleSave = async () => {
            const updatedGlobalConfig = { ...JSON.parse(snapshot.data().device_info.global_config) };
            updatedGlobalConfig.global_info.sleep.value.timeout.range.min = sleepMin;
            updatedGlobalConfig.global_info.sleep.value.timeout.range.max = sleepMax;
    
            try {
                await updateDoc(doc(db, "users/NX4mlsPNKKTBjcVtHRKDuctB7xT2/userCatos", docId), {
                    "device_info.global_config": JSON.stringify(updatedGlobalConfig)
                });
                console.log("Global config updated");
            } catch (error) {
                console.error("Error updating global config: ", error);
            }
        };    
    
        // const toggleSleepDropdown = () => {
        //     setShowSleepDropdown(!showSleepDropdown);
        // };

        return (
            <div>
                {/* HW_UID ----------------- */}
                <p>hw_uid: {globalConfig?.HW_UID.value}</p>
                <div className="border-t border-dotted border-gray-400 my-2" />

                {/* sleep ----------------- */}
                <p>sleep: {sleepInfo?.value?.timeout.value}</p>
                
                <p>sleepMin: </p>
                <input type="number" value={sleepMin} onChange={handleSleepMinChange} />
                <p>sleepMax: </p>
                <input type="number" value={sleepMax} onChange={handleSleepMaxChange} />

                <button onClick={handleSave}>Save</button>

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
