import React, { useState, useRef, useContext } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { overwriteConfigFile } from '../NavBar/ReplaceConfig';
import { get, set } from 'idb-keyval';


const deepCopy = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

const getConfigFromCato = async (setOriginalJson, currentDevice) => {
    try {
        if (window.showDirectoryPicker) {
            try {
                // request the user to pick a directory
                const dirHandle = await window.showDirectoryPicker({
                    id: "AULI_CATO",
                    mode: "readwrite",
                });
                // attempt to find the config.json file in the directory
                for await (const entry of dirHandle.values()) {
                    if (entry.kind === "file" && entry.name === "config.json") {
                        console.log('found file');
                        // found the file, read it
                        const file = await entry.getFile();
                        const jsonDataText = await file.text();
                        console.log(jsonDataText);
                        let parsedJson = JSON.parse(jsonDataText);
                        console.log("original json", parsedJson)
                        let globalConfig = deepCopy(parsedJson);
                        setOriginalJson(parsedJson); // without practice mode 

                        // check if current device is in json
                        if (parsedJson['global_info']['name']['value'] !== currentDevice) {
                            alert("Device must be connected to initiate practice mode")
                            console.log("Device must be connected to initiate practice mode!")
                            return;
                        }


                        globalConfig['connections'][0]['operation_mode']['value'] = 'practice';


                        // create a practice mode file and write 
                        const success = await overwriteConfigFile(globalConfig);
                        if (success) { // file written  
                            return 1;
                        }

                        return; // unsuccessful 
                    }
                }
            } catch (error) {
                console.log(error);
                return;
            }
        } else {
            console.log("window.showDirectoryPicker is not supported");
            return;
        }
    } catch (error) {
        console.log(error);
        return;
    }
}

const Practice = ({user, devices}) => {
    const { deviceName } = useParams();
    const thisDevice = devices.find(device => device.data.device_info.device_nickname === deviceName);
    const [originalJson, setOriginalJson] = useState({}); // original device config with standard operation mode 
    console.log("thisDevice", thisDevice);
    const navigate = useNavigate();

    const [practiceText, setPracticeText] = useState('');
    const [originalMode, setOriginalMode] = useState('');
    const [isPracticing, setIsPracticing] = useState(false);
    const textareaRef = useRef(null);

    async function fetchAndCompareConfig() {
        async function checkIfHardwareUidMatches(deviceName, hwUidToCheck) {
            console.log("deviceName", deviceName);
            console.log("hwUidToCheck", hwUidToCheck);
            try {
                if (thisDevice['data']['device_info']['device_nickname'] == deviceName) {
                    if (thisDevice['data']['device_info']['hw_uid'] == hwUidToCheck) {
                        return true;
                    } else {
                        console.log("HW_UID does not match");
                    }
                } else {
                    console.log("Device name does not match");
                }
                return false;
            } catch (error) {
                console.log("Error checking if hardware uid matches", error);
                return false;
            }
        }

        try {
            // check existence directories
            let directoryHandle = await get('configDirectoryHandle');

            // request + store in indexedDB
            if (!directoryHandle) {
                directoryHandle = await window.showDirectoryPicker();
                await set('configDirectoryHandle', directoryHandle);
            }

            // get r/w access
            const permissionStatus = await directoryHandle.requestPermission({ mode: 'readwrite' });
            if (permissionStatus !== 'granted') {
                console.log("Permission to access directory not granted");
                return;
            }

            //check if config.json exists
            const fileHandle = await directoryHandle.getFileHandle('config.json');
            const file = await fileHandle.getFile();
            const text = await file.text();
            const config = JSON.parse(text);

            console.log("config", config);

            // check if there is a deviceHwUid
            if (!config || !config.global_info || !config.global_info.HW_UID || !config.global_info.HW_UID.value) {
                console.error("HW_UID is empty or not found in the JSON structure");
                return;
            }
            const deviceHwUid = config.global_info.HW_UID.value;
            const hwUidMatches = await checkIfHardwareUidMatches(deviceName, deviceHwUid);
            if (!hwUidMatches) {
                console.error("HW_UID does not match the device name");
                return;
            }
            return config;

        } catch (error) {
            console.log("Error fetching config.json", error);
            return;
        }
    }

    async function practiceModeConfigChange(config) {
        let practiceConfig = deepCopy(config);
        // if the first connection in the array is already in practice mode, return true
        if (practiceConfig['connections'][0]['operation_mode']['value'] === 'practice') {
            return practiceConfig;
        } else {
            // we have to push the practice mode config to the device
            let connectionObject = JSON.parse(thisDevice['data']['device_info']['practice_config']);
            //push the connectionObject to the front of the connections array
            practiceConfig['connections'].unshift(connectionObject);
            console.log("practiceConfig", practiceConfig);
            return practiceConfig;
        }
    }

    const togglePractice = async () => {
        console.log("isPracticing", isPracticing);
        if (isPracticing) { // turning off current practice
            textareaRef.current.blur();
            // download the original config.json file
            overwriteConfigFile(originalJson);
            // setIsPracticeMode(false);
            navigate(`/devices/${deviceName}`)
        } else { // turning on current practice 
            // fetch the config.json file from catos
            const config = await fetchAndCompareConfig();
            if (!config) {
                // make sure that the device is not in practice mode
                alert("Device must be connected to initiate practice mode")
                console.log("Device must be connected to initiate practice mode!")
                return;
            }
            // set the original config.json file
            //setOriginalJson(deepCopy(config));

            const practiceConfig = await practiceModeConfigChange(config);
            if (!practiceConfig) {
                console.log("Error creating practice mode config");
                return;
            }

            //console.log("practiceConfig", practiceConfig);
            // write the practice mode config to the device
            const success = await overwriteConfigFile(practiceConfig);
            console.log(success);
            if (success) { // file picked 
                textareaRef.current.focus();
                setOriginalJson(deepCopy(config));
                setIsPracticing(true); // general practice mode state from Navigation.jsx 
            }
        }
    };


    const handleTextChange = (event) => {
        setPracticeText(event.target.value);
    };
    const headerStyle = {
        marginBottom: '10px', // Adjust this value as needed
        // Other styles...
    };

    return (

        
        <div>
            {/* <div className="ml-90">
                <header className="shrink-0 bg-transparent border-b border-gray-200">
                    <div className="ml-0 flex h-16 max-w-7xl items-center justify-between ">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            Instructions
                        </h2>
                    </div>
                </header>
            </div>

            <div className="ml-90">
                <header className="shrink-0 bg-transparent border-b border-gray-200">
                    <div className="ml-0 flex h-16 max-w-7xl items-center justify-between ">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            Practice Settings
                        </h2>
                    </div>
                </header>
            </div> */}


            <div className="ml-90" style = {headerStyle}>
                <header className="shrink-0 bg-transparent border-b border-gray-200">
                    <div className="ml-0 flex h-16 max-w-7xl items-center justify-between ">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            Practice Mode
                        </h2>
                    </div>
                </header>
            </div>


            <div className="flex row items-center h-screen min-w-[70vw] p-5 bg-[#f0f0f0] gap-2.5 flex-wrap overflow-auto">
                <button
                    onClick={togglePractice}
                    className="text-lg mb-2.5 fixed ml- font-bold bg-[rgb(252,220,109)] rounded-lg px-4 py-2 shadow-md text-black cursor-pointer"
                >
                    {isPracticing ? 'Finish Practice' : 'Start Practice'}
                </button>
                <textarea
                    ref={textareaRef}
                    value={practiceText}
                    onChange={handleTextChange}
                    placeholder="Start typing..."
                    className="w-3/4 h-[300px] ml-60 bg-black text-white border border-gray-300 rounded p-2.5 text-base resize-none"
                />
            </div>
        </div>
    );

}

export default Practice;