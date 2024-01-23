import React, { useState, useRef, useContext, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { overwriteConfigFile } from '../NavBar/ReplaceConfig';
import { get, set } from 'idb-keyval';
import { styled } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import debounce from 'lodash.debounce';
import { db, auth } from '../../firebase';
import { doc, updateDoc } from "firebase/firestore";
import { use } from 'marked';



function parseBool(value) {
    if (typeof value === 'string') {
        value = value.toLowerCase().trim();
        if (value === 'true') {
            return true;
        } else if (value === 'false') {
            return false;
        }
    }
    return Boolean(value);
}


const deepCopy = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

const sliderContainerStyle = {
    margin: '1rem',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
    padding: '1rem',
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

const sectionHeadingStyle = {
    fontSize: '20px',
    marginBottom: '10px',
    fontWeight: 'bold',
    backgroundColor: '#fcdc6d',
    borderRadius: '10px',
    padding: '5px 15px',
    display: 'inline-block',
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
};

const hoverstyle = {
    position: 'absolute',
    backgroundColor: '#333',
    color: 'white',
    padding: '5px',
    borderRadius: '4px',
    fontSize: '12px',
    top: '-25px',
    right: '100%',
    transform: 'translateX(100%)',
    whiteSpace: 'nowrap',
    zIndex: 2
};

const styles = {
    dropdownContainer: {
        marginBottom: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    labelStyle: {
        fontSize: '18px',
        fontWeight: 'bold',
        display: 'block',
        marginBottom: '10px',
    },
    selectStyle: {
        padding: '10px 15px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        marginBottom: '10px',
    },
    descriptionStyle: {
        fontSize: '14px',
        color: '#666',
    },
};

const DarkYellowSlider = styled(Slider)(({ theme }) => ({
    color: '#B8860B',
    '& .MuiSlider-thumb': {
        '&:hover, &.Mui-focusVisible': {
            boxShadow: `0px 0px 0px 8px ${theme.palette.mode === 'dark' ? 'rgb(218 165 32 / 16%)' : 'rgb(218 165 32 / 16%)'}`,
        },
        '&.Mui-active': {
            boxShadow: `0px 0px 0px 14px ${theme.palette.mode === 'dark' ? 'rgb(218 165 32 / 16%)' : 'rgb(218 165 32 / 16%)'}`,
        },
    },
    '& .MuiSlider-rail': {
        opacity: 0.28,
    },
}));

const InputSlider = ({ value, onChange, min, max, step, sliderTitle, unit, sliderDescription, sliderLabel }) => {
    const [sliderValue, setSliderValue] = useState(value || 0);
    const [isLabelHovered, setIsLabelHovered] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    const handleInputChange = (event) => {
        const newValue = event.target.value === '' ? '' : Number(event.target.value);
        setInputValue(newValue);
    };

    const handleInputCommit = (event) => {
        let newValue = event.target.value === '' ? min : Number(event.target.value);
        console.log("newValue", newValue);
        newValue = newValue < min ? min : newValue > max ? max : newValue;
        setInputValue(newValue);
        setSliderValue(newValue);
        onChange({ target: { value: newValue } });
    };

    useEffect(() => {
        setSliderValue(value || 0);
    }, [value]);

    const handleSliderChange = (event, newValue) => {
        setSliderValue(newValue);
        setInputValue(newValue);
    };

    const handleSliderChangeCommitted = (event, newValue) => {
        if (onChange) {
            onChange({ target: { value: newValue } });
        }
    };

    return (
        <div style={{ marginBottom: '0 px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label
                    htmlFor={sliderLabel}
                    style={{ position: 'relative', display: 'block', cursor: 'pointer' }}
                    onMouseEnter={() => setIsLabelHovered(true)}
                    onMouseLeave={() => setIsLabelHovered(false)}
                >
                    {`${sliderTitle} (${sliderValue} ${unit})`}
                    {isLabelHovered && (
                        <div className="tooltip" style={hoverstyle}>
                            {sliderDescription}
                        </div>
                    )}
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '40%' }}>

                    {/* <div style={{ width: '30%' }}>  */}
                    <DarkYellowSlider
                        id={sliderLabel}
                        value={sliderValue}
                        onChange={handleSliderChange}
                        onChangeCommitted={handleSliderChangeCommitted}
                        aria-labelledby={sliderLabel}
                        valueLabelDisplay="auto"
                        step={step}
                        min={min}
                        max={max}
                    />
                    <input
                        type="number"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputCommit}
                        style={{ width: '60px', marginLeft: '20px' }}
                        min={min}
                        max={max}
                        step={step}
                    />
                </div>
            </div>
        </div>
    );
};

const Dropdown = ({ value, onChange, title, description, options }) => {
    const formattedOptions = options.map((option) =>
        typeof option === 'object' ? option : { value: option, label: option.toString() }
    );

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };


    return (
        <div style={{ marginBottom: '0px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                {title && (
                    <label onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} htmlFor="dropdown" style={{ fontSize: '16px', marginRight: '10px' }}>
                        {title}
                    </label>
                )}

                <select id="dropdown" value={value} onChange={onChange} style={styles.selectStyle}>
                    {formattedOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {isHovered &&
                    <div className="tooltip"
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            backgroundColor: '#333',
                            color: '#fff',
                            padding: '5px',
                            borderRadius: '4px',
                            fontSize: '14px',
                        }}
                    >
                        {description}
                    </div>
                }
            </div>
        </div>
    );
};

const CheckboxOption = ({ checked, onChange, title, description }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <label
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ fontSize: '16px' }}
            >
                {title}
                {isHovered && (
                    <div style={hoverstyle}>
                        {description}
                    </div>
                )}
            </label>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                style={{
                    transform: 'scale(1.5)',
                    cursor: 'pointer',
                    accentColor: 'black'
                }}
            />
        </div>
    );
};

const Practice = ({ user, devices }) => {
    const { deviceName } = useParams();
    const thisDevice = devices.find(device => device.data.device_info.device_nickname === deviceName);
    const [originalJson, setOriginalJson] = useState({}); // original device config with standard operation mode 
    console.log("thisDevice", thisDevice);
    const navigate = useNavigate();

    const [practiceText, setPracticeText] = useState('');
    const [practiceJSON, setPracticeJSON] = useState({}); // practice mode config
    const [editedConfig, setEditedConfig] = useState({}); // practice mode config
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
                setPracticeJSON(deepCopy(practiceConfig['connections'][0])); // practice mode config
                setEditedConfig(deepCopy(practiceConfig)); // practice mode config
            }
        }
    };

    const handleSave = async () => {
        console.log("practiceJSON", practiceJSON);
        const userCatoDocId = thisDevice.id;
        const userCatoDocRef = doc(db, "users", user.uid, "userCatos", userCatoDocId);

        try {
            await updateDoc(userCatoDocRef, {
                "device_info.practice_config": JSON.stringify(practiceJSON),
            });
            console.log("Practice config updated successfully on Firebase");
        } catch (error) {
            console.error("Error updating practice config:", error);
        }

        // edit editedConfig
        editedConfig['connections'][0] = deepCopy(practiceJSON);

        // overwrite config.json 
        const success = await overwriteConfigFile(editedConfig);
        if (success) {
            console.log("Practice mode config written successfully");
        }
    }

    const PracticeOptions = (config) => {
        console.log("config", config);
        return (
            <div style={sliderContainerStyle}>
                <div style={{ maxWidth: '600px', margin: '0' }}>
                    <h2 style={sectionHeadingStyle}>Practice Options</h2>
                    {/* <h1 style={titleStyle}> TV Remote Options </h1> */}
                    <CheckboxOption
                        checked={config["practice"]["value"]["dense"]["value"]}
                        onChange={(e) => handlePracticeConfigChange(['practice', 'value', 'dense', 'value'])(e.target.checked)}
                        title="Format Condensed"
                        description="True: outputs in a single line. False: type outputs as a table"
                    />
                    <InputSlider
                        value={config["practice"]["value"]["num_infers"]["value"]}
                        onChange={(e) => handlePracticeConfigChange(['practice', 'value', 'num_infers', 'value'])(e.target.value)}
                        min={config["practice"]["value"]["num_infers"]["range"]["min"]}
                        max={config["practice"]["value"]["num_infers"]["range"]["max"]}
                        step={1}
                        sliderTitle="Number of Displayed Inferences"
                        unit="inferences"
                        sliderDescription="Number of relevant inferences displayed per gesture"
                        sliderLabel="num_infers"
                    >

                    </InputSlider>
                    <InputSlider
                        value={config["practice"]["value"]["cutoff"]["value"]}
                        onChange={(e) => handlePracticeConfigChange(['practice', 'value', 'cutoff', 'value'])(parseFloat(e.target.value))}
                        min={config["practice"]["value"]["cutoff"]["range"]["min"]}
                        max={config["practice"]["value"]["cutoff"]["range"]["max"]}
                        step={0.1}
                        sliderTitle="Certainty Cutoff"
                        unit=""
                        sliderDescription="Level of certainty below which gesture will not be displayed"
                        sliderLabel="certainity_cutoff"
                    ></InputSlider>


                    <button onClick={handleSave}
                        style={{
                            backgroundColor: '#B8860B', //B8860B
                            color: 'white',
                            padding: '10px 20px',
                            fontSize: '16px',
                            borderRadius: '5px',
                            border: 'none',
                            cursor: 'pointer',
                            marginLeft: '10px',
                            marginTop: '20px'
                        }}>
                        Save
                    </button>
                </div>
            </div>



        )
    }

    useEffect(() => {
        console.log("practiceJSON", practiceJSON);

    }, [practiceJSON]);

    const handlePracticeConfigChange = (keylist) => {
        return debounce((value) => {
            const newPracticeJSON = deepCopy(practiceJSON);
            let pointer = newPracticeJSON;
            for (let i = 0; i < keylist.length - 1; i++) {
                pointer = pointer[keylist[i]];
            }
            pointer[keylist[keylist.length - 1]] = value;
            setPracticeJSON(newPracticeJSON);
        }, 100);
    }

    const styles = {
        container: {
            backgroundColor: '#f7f7f7', // Light grey background
            border: '1px solid #ddd',   // Light border
            borderRadius: '8px',        // Rounded corners
            padding: '20px',            // Padding around the content
            maxWidth: '600px',          // Maximum width of the container
            margin: '20px auto',        // Center the container
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'  // Subtle shadow
        },
        heading: {
            color: '#333',              // Dark grey color for the heading
            marginBottom: '10px',       // Space below the heading
        },

        button: {
            backgroundColor: '#0056b3', // Blue background color
            color: 'white',             // White text
            padding: '10px 15px',       // Padding inside the button
            border: 'none',             // No border
            borderRadius: '5px',        // Rounded corners
            cursor: 'pointer',          // Pointer cursor on hover
            marginTop: '15px',          // Space above the button
            fontSize: '16px'            // Larger font size
        },

        list: {
            lineHeight: '1.6',            // Space between lines
            color: '#555',                // Dark grey color for the text
            paddingLeft: '20px',          // Add padding to the left of the list for the numbers
            listStyleType: 'decimal',     // Ensure decimal numbers are used
            listStylePosition: 'inside'   // Position the numbers inside the list item content
        },
    };



    const handleTextChange = (event) => {
        setPracticeText(event.target.value);
    };
    const headerStyle = {
        marginBottom: '5 px', // Adjust this value as needed
        // Other styles...
    };

    return (


        <div>

            <div className="ml-90" style={headerStyle}>
                <header className="shrink-0 bg-transparent border-b border-gray-200">
                    <div className="ml-0 flex h-16 max-w-7xl items-center justify-between ">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            Practice Mode
                        </h2>
                    </div>
                </header>
            </div>
            <div style={styles.container}>
                <h2 style={styles.heading}>Instructions to Put Device in Practice Mode:</h2>
                <ol style={styles.list}>
                    <li>Connect your Cato to the computer via USB.</li>
                    <li>Click on the <strong>Start Practice</strong> and allow permission to access your Cato device.</li>
                    <li>Cato device should start outputting to text box below to begin practicing.</li>
                    <li>Once you are done practicing, click on <strong>Finish Practice</strong> to save your practice session.</li>
                </ol>
            </div>
            { /*
            <div className="ml-90">
                <header className="shrink-0 bg-transparent border-b border-gray-200">
                    <div className="ml-0 flex h-16 max-w-7xl items-center justify-between ">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            Practice Settings
                        </h2>
                    </div>
                </header>
    </div> */}




            {/* <div className="flex flex-start h-screen items-start p-5 bg-[#f0f0f0] gap-2.5 overflow-auto"> */}
            <div className="flex items-center justify-center p-5 bg-[#f0f0f0] gap-2.5 overflow-auto">
                <button
                    onClick={togglePractice}
                    className="text-lg font-bold bg-[rgb(252,220,109)] rounded-lg px-4 py-2 shadow-md text-black cursor-pointer"
                >
                    {isPracticing ? 'Finish Practice' : 'Start Practice'}
                </button>
                <textarea
                    ref={textareaRef}
                    value={practiceText}
                    onChange={handleTextChange}
                    placeholder="Start typing..."
                    className="flex-1 h-[300px] bg-black text-white border border-gray-300 rounded p-2.5 text-base resize-none"
                />
            </div>

            {isPracticing && practiceJSON && PracticeOptions(practiceJSON)}

        </div>
    );

}

export default Practice;