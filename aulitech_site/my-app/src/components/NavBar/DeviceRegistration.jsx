import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { InputSlider } from './Devices'
import Dropdown from './Devices';

const CommonSettingsSection = ({ commonSettings, setCommonSettings, onSave, isButtonClicked, saveButtonStyle }) => {
    const handleChange = (keyPath, value) => {
        setCommonSettings(prevSettings => {
            let updatedSettings = { ...prevSettings };
            let current = updatedSettings;
            keyPath.slice(0, -1).forEach(k => {
                current[k] = { ...current[k] };
                current = current[k];
            });
            current[keyPath[keyPath.length - 1]] = value;
            return updatedSettings;
        });
    };

    const renderSetting = (keyPath, setting) => {
        if (setting.value && typeof setting.value === 'object' && !Array.isArray(setting.value)) {
            return (
                <>
                    <label>{setting.label}: </label>
                    {Object.entries(setting.value).map(([key, nestedSetting]) =>
                        renderSetting([...keyPath, key], nestedSetting)
                    )}
                    
                </>
                
            );
        } else if (setting.range) {
            return (
                
                <InputSlider
                    value={setting.value}
                    onChange={(e) => handleChange(keyPath, parseFloat(e.target.value))}
                    min={setting.range.min}
                    max={setting.range.max}
                    step={setting.step || 1}
                    sliderTitle={setting.label || keyPath.slice(-1)[0]}
                    unit={""}
                    sliderDescription={setting.description}
                    sliderLabel={keyPath.join('_')}
                />
                
            );
        } else if (setting.options) {
            return (
                <Dropdown
                    value={setting.value}
                    onChange={(e) => handleChange(keyPath, e.target.value)}
                    title={setting.label}
                    description={setting.description}
                    options={setting.options}
                />
            );
        } else {
            return (
                <div>
                    <label>{setting.label || keyPath.slice(-1)[0]}: </label>
                    <input 
                        type="text" 
                        value={setting.value} 
                        onChange={(e) => handleChange(keyPath, e.target.value)}
                    />
                </div>
            );
        }
    };

    return (
        <div className="flex items-start gap-x-4 mb-4">
            <button className="text-xl font-bold py-4 px-8 rounded bg-blue-700 hover:bg-blue-900 text-white">
                Common Settings
            </button>
            <div>
                {Object.entries(commonSettings).map(([key, setting]) => (
                    <div key={key}>
                        {renderSetting([key], setting)}
                    </div>
                ))}
                <button onClick={onSave} style={saveButtonStyle}>
                    Save Common Settings
                </button>
            </div>
        </div>
    );
};

const DeviceRegistration = () => {
    const [deviceName, setDeviceName] = useState('Loading...');
    const [docSnap, setDocSnap] = useState(null);
    const [commonSettings, setCommonSettings] = useState({});
    const [connections, setConnections] = useState([]);

    const docId = "VscD0ZIA3b5uqdK1Kxdl"; //hardcoded!!
    const [setOrientationInfo] = useState({});

    const [autoSamples, setAutoSamples] = useState(0); 
    const [autoThreshold, setAutoThreshold] = useState(0); 

    const [sleepMin, setSleepMin] = useState(null);
    const [sleepMax, setSleepMax] = useState(null);

    const sleepMinRef = useRef(null);
    const sleepMaxRef = useRef(null);

    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [operationModeOptions, setOperationModeOptions] = useState([]);

    const [activeOperationMode, setActiveOperationMode] = useState('');

    useEffect(() => {
        const fetchOperationModes = async () => {
            try {
                const docRef = doc(db, "your_collection_path", "your_document_id");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const operationModes = docSnap.data().operation_mode.options;
                    setOperationModeOptions(operationModes);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching operation modes: ", error);
            }
        };

        fetchOperationModes();
    }, []);


    const handleSaveCommonSettings = async () => {
        setIsButtonClicked(true);
        try {
            await updateDoc(doc(db, "users/NX4mlsPNKKTBjcVtHRKDuctB7xT2/userCatos", docId), {
                commonSettings: commonSettings
            });
            console.log("Common settings updated");
        } catch (error) {
            console.error("Error updating common settings: ", error);
        }
        setTimeout(() => setIsButtonClicked(false), 500);
    };
    

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
            
            const docRef = doc(db, "users/NX4mlsPNKKTBjcVtHRKDuctB7xT2/userCatos", docId); //hardcoded
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

                    sleepMinRef.current = sleepInfo?.value?.timeout?.range?.min;
                    sleepMaxRef.current = sleepInfo?.value?.timeout?.range?.max;

                    const connections = snapshot.data().connections || [];
                    const extractedCommonSettings = connections.map(conn => JSON.parse(conn.connection_config || '{}'));
                    setCommonSettings(extractedCommonSettings.length > 0 ? extractedCommonSettings[0] : {});

                    const fetchedConnections = snapshot.data().connections.map(conn => {
                        const config = JSON.parse(conn.connection_config);
                        return {
                            id: conn.bt_id, // or other unique identifiers
                            config: config,
                        };
                    });
                    setConnections(fetchedConnections);

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
    

    const handleConnectionChange = (id, key, value) => {
        setConnections(connections.map(conn => {
            if (conn.id === id) {
                return {
                    ...conn,
                    config: {
                        ...conn.config,
                        [key]: {
                            ...conn.config[key],
                            value: value
                        }
                    }
                };
            }
            return conn;
        }));
    };

    const handleSaveConnections = async () => {
        const updatedConnections = connections.map(conn => ({
            ...conn,
            connection_config: JSON.stringify(conn.config)
        }));

        try {
            await updateDoc(doc(db, "users/NX4mlsPNKKTBjcVtHRKDuctB7xT2/userCatos", docId), {
                connections: updatedConnections
            });
            console.log("Connections updated");
        } catch (error) {
            console.error("Error updating connections: ", error);
        }
    };

    const handleDeviceNameChange = (e) => {
        setDeviceName(e.target.value);
    };

    const handleDelete = async () => {
        const docRef = doc(db, "users/NX4mlsPNKKTBjcVtHRKDuctB7xT2/userCatos", docId); //hardcoded
        try {
            await deleteDoc(docRef);
            console.log("Document successfully deleted!");
        } catch (error) {
            console.error("Error removing document: ", error);
        }
    }; 

    const ConnectionAccordion = ({ connections, activeOperationMode, setActiveOperationMode }) => {
        const operationModeOptions = ["gesture_mouse", "tv_remote", "pointer", "clicker", "practice"]; //hardcoded
    
        const handleOperationModeChange = (e) => {
            setActiveOperationMode(e.target.value);
        };
    
        return (
            <div className="flex items-start gap-x-4 mb-4">
                <button className="text-xl font-bold py-4 px-8 rounded bg-blue-700 hover:bg-blue-900 text-white">
                    Connections
                </button>
                <div>
                    {connections.map((connection) => (
                        <p key={connection.id}>{connection.current_mode}</p>
                    ))}
                </div>
                {/* active operation mode dropdown */}
                <div>
                    <label htmlFor="operationModeDropdown">Active Operation Mode: </label>
                    <select 
                        id="operationModeDropdown" 
                        value={activeOperationMode} 
                        onChange={handleOperationModeChange}
                    >
                        <option value="">Select Mode</option>
                        {operationModeOptions.map((mode, index) => (
                            <option key={index} value={mode}>{mode}</option>
                        ))}
                    </select>
                </div>
            </div>
        );
    };
    

    const GlobalInfoSection = ({ snapshot }) => {
        if (!snapshot) return null;

        const deviceInfo = snapshot.data().device_info;
        let globalConfig = JSON.parse(deviceInfo["global_config"])["global_info"];

        const orientationInfo = globalConfig["orientation"]["value"];
        const sleepInfo = globalConfig["sleep"]

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

                {/* auto samples */}
                <InputSlider
                    value={autoSamples}
                    onChange={(e) => setAutoSamples(parseFloat(e.target.value))}
                    min={0} 
                    max={200} 
                    step={1} 
                    sliderTitle="Auto Samples"
                    unit="" 
                    sliderDescription="Number of samples for auto calibration"
                    sliderLabel="autoSamplesSlider"
                />

                {/* auto threshold */}
                <InputSlider
                    value={autoThreshold}
                    onChange={(e) => setAutoThreshold(parseFloat(e.target.value))}
                    min={0} 
                    max={5} 
                    step={0.1}
                    sliderTitle="Auto Threshold"
                    unit=""
                    sliderDescription="Threshold value for auto calibration"
                    sliderLabel="autoThresholdSlider"
                />

                {/* <p>auto_samples:</p>
                <input type="number" value={autoSamples} onChange={(e) => setAutoSamples(e.target.value)} />
                <p>auto_threshold:</p>
                <input type="number" value={autoThreshold} onChange={(e) => setAutoThreshold(e.target.value)} /> */}
                
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

            {/* connections! */}
            {connections && (
                <ConnectionAccordion 
                    connections={connections} 
                    activeOperationMode={activeOperationMode} 
                    setActiveOperationMode={setActiveOperationMode} 
                />
            )}

            <div className="border-t border-line border-gray-400 my-4" />
            <CommonSettingsSection 
                commonSettings={commonSettings} 
                setCommonSettings={setCommonSettings} 
                onSave={handleSaveCommonSettings}
                isButtonClicked={isButtonClicked}
                saveButtonStyle={saveButtonStyle}
            />


        </div>
    );
};

export default DeviceRegistration;
