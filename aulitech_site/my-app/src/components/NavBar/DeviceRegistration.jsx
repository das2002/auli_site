import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { InputSlider } from './Devices'
import Dropdown from './Devices';

const DeviceRegistration = () => {
    const [deviceName, setDeviceName] = useState('Loading...');
    const [docSnap, setDocSnap] = useState(null);
    const docId = "VscD0ZIA3b5uqdK1Kxdl"; //hardcoded!!
    const [setOrientationInfo] = useState({});

    const [autoSamples, setAutoSamples] = useState(null);
    const [autoThreshold, setAutoThreshold] = useState(null);

    const [sleepMin, setSleepMin] = useState(null);
    const [sleepMax, setSleepMax] = useState(null);

    const [isButtonClicked, setIsButtonClicked] = useState(false);

    const saveButtonStyle = {
        backgroundColor: isButtonClicked ? '#B8860B' : '#DAA520',
        color: 'white',
        padding: '5px 10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        margin: '10px 0'
    };

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
    
                    const globalConfig = JSON.parse(snapshot.data().device_info.global_config).global_info;
                    setAutoSamples(globalConfig.calibration.value.auto_samples.value);
                    setAutoThreshold(globalConfig.calibration.value.auto_threshold.value);
    
                    const sleepInfo = globalConfig.sleep;
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
            //common settings
        };
    
        const handleModeSpecificSettingsChange = (connectionId, mode, settings) => {
            //mode-specific settings
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
                        {/* common settings section */}
                        <div>
                            {/* render common settings here */}
                            {/* <input type="text" value={connectionSettings[connection.id].common.someSetting} onChange={...} /> */}
                        </div>
    
                        {/* dropdown for operation mode */}
                        <select value={selectedModes[connection.id] || connection.current_mode} onChange={(e) => handleModeChange(connection.id, e.target.value)}>
                            {connection.modes.map(mode => (
                                <option key={mode} value={mode}>{mode}</option>
                            ))}
                        </select>
    
                        {/* settings with active operation mode */}
                        <div>
                            {/* render mode-specific settings here */}
                            {/* <input type="text" value={connectionSettings[connection.id].modeSpecific.someSetting} onChange={...} /> */}
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
        let globalConfig = JSON.parse(deviceInfo["global_config"])["global_info"];

        const orientationInfo = globalConfig["orientation"]["value"];
        const sleepInfo = globalConfig["sleep"]

        // const [autoSamples, setAutoSamples] = useState(globalConfig["calibration"].value.auto_samples.value);
        // const [autoThreshold, setAutoThreshold] = useState(globalConfig["calibration"].value.auto_threshold.value);

        const handleSave = async () => {
            setIsButtonClicked(true);

            globalConfig.sleep.value.timeout.range.min = sleepMin;
            globalConfig.sleep.value.timeout.range.max = sleepMax;
            globalConfig.calibration.value.auto_samples.value = autoSamples;
            globalConfig.calibration.value.auto_threshold.value = autoThreshold;
    
            try {
                await updateDoc(doc(db, "users/NX4mlsPNKKTBjcVtHRKDuctB7xT2/userCatos", docId), {
                    "device_info.global_config": JSON.stringify({ "global_info": globalConfig })
                });
                console.log("Global config updated");
            } catch (error) {
                console.error("Error updating global config: ", error);
            }
            setTimeout(() => setIsButtonClicked(false), 500);

        };

        return (
            <div>
                {/* HW_UID ----------------- */}
                <p>hw_uid: {globalConfig?.HW_UID.value}</p>
                <div className="border-t border-dotted border-gray-400 my-2" />

                {/* sleep ----------------- */}
                <p>Sleep: {sleepInfo?.value?.timeout.value}</p>

                <InputSlider
                    value={sleepMin}
                    onChange={(e) => setSleepMin(e.target.value)}
                    min={0}
                    max={2000}
                    step={1}
                    sliderTitle="Sleep Min"
                    unit="units"
                    sliderDescription="Minimum sleep value"
                    sliderLabel="sleepMinSlider"
                />
                
                {/* <p>sleepMin: </p>
                <input type="number" value={sleepMin} onChange={(e) => setSleepMin(e.target.value)} /> */}

                <InputSlider
                    value={sleepMax}
                    onChange={(e) => setSleepMax(e.target.value)}
                    min={0} 
                    max={2000} 
                    step={1}
                    sliderTitle="Sleep Max"
                    unit="units" 
                    sliderDescription="Maximum sleep value"
                    sliderLabel="sleepMaxSlider"
                />
                
                {/* <p>sleepMax: </p>
                <input type="number" value={sleepMax} onChange={(e) => setSleepMax(e.target.value)} /> */}

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

                

                {/* Calibration */}
                <p>auto_samples:</p>
                <input type="number" value={autoSamples} onChange={(e) => setAutoSamples(e.target.value)} />
                <p>auto_threshold:</p>
                <input type="number" value={autoThreshold} onChange={(e) => setAutoThreshold(e.target.value)} />

                {/* Save button */}
                <p></p>
                <button onClick={handleSave} style={saveButtonStyle}>
                    Save Global Info
                </button>
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
