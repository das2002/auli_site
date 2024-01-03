import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

const CompatibilityCheck = ({isCompatible}) => {
    if (isCompatible) {
        return null;
    }
    return <p>Your browser does not support Bluetooth. Please use a compatible browser.</p>;
};

let originalMode = '';
let originalJson = null;
    
const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};


const ConnectionInstructions = ({ onNext }) => {
    //const [currentMode, setCurrentMode] = useState(''); // [currentMode, setCurrentMode
    const [parsedJson, setParsedJson] = useState({}); // [parsedJson, setParsedJson
    const [previousMode, setPreviousMode] = useState('');

    useEffect(() => {
      originalMode = deepCopy(previousMode);
    }, [previousMode]);

    useEffect(() => {
      originalJson = deepCopy(parsedJson);
      console.log('originalJson', originalJson);
    }, [parsedJson]);
    const getJsonData = async () => {
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
                            // found the file, read it
                            const file = await entry.getFile();
                            const jsonDataText = await file.text();
                            let parsedJson = JSON.parse(jsonDataText);
                            let globalConfig = deepCopy(parsedJson);
                            setParsedJson(parsedJson);
                            console.log(parsedJson);
                            setPreviousMode(parsedJson['operation_mode']['value']);
                            globalConfig['operation_mode']['value'] = 'practice';


                            // create a practice mode file
                            const fileName = "config.json";
                            const fileData = JSON.stringify(globalConfig, null, 2);
                            const newFileHandle = await dirHandle.getFileHandle(fileName, { create: true });
                            const writable = await newFileHandle.createWritable();
                            await writable.write(fileData);
                            await writable.close();

                            const blob = new Blob([fileData], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = fileName;

                            // this is a hack to fix the issue with downloading the file
                            link.click();

                            link.remove();

                            return;
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                console.log("window.showDirectoryPicker is not supported");
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Instructions to Put Device in Practice Mode:</h2>
        <ol style={styles.list}>
          <li>Connect your Cato to the computer via USB.</li>
          <li>Click on the <strong>Activate Practice Mode</strong> and allow permission to access your Cato device.</li>
          <li>Replace the existing <strong>config.json</strong> with the downloaded file.</li>
          <li>Properly eject the device from USB connection.</li>
          <li>Connect to the device via Bluetooth.</li>
          <li>Click on the 'Ready' button to start practice mode.</li>
        </ol>
        <button onClick={getJsonData} style={styles.button}>Activate Practice Mode</button>
        <div style={{ margin: '10px' }}></div>
        <button onClick={onNext} style={styles.button}>Ready</button>
      </div>
    );
  };
  
  // Define styles for the component
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

const BluetoothCheck = ({onCheck}) => {
    return (
        <div>
            <p>Checking Bluetooth connection...</p>
            <button onClick={onCheck}>Check Bluetooth</button>
        </div>
    )
};

const PracticeMode = () => {
    const Navigate = useNavigate();
    const [isPracticing, setIsPracticing] = useState(false);
    const [practiceText, setPracticeText] = useState('');
    const [originalMode, setOriginalMode] = useState('');
    const textareaRef = useRef(null);
    const togglePractice = () => {
        if (isPracticing) {
            textareaRef.current.blur();
            // download the original config.json file
            const fileName = "config.json";
            const fileData = JSON.stringify(originalJson, null, 2);
            const blob = new Blob([fileData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();
            link.remove();
            Navigate("/")
        } else {
            textareaRef.current.focus();
        }
        setIsPracticing(!isPracticing);
    }

    const handleTextChange = (event) => {
        setPracticeText(event.target.value);
    };

    return (
        <div style={practiceModeStyles.container}>
          <button onClick={togglePractice} style={practiceModeStyles.button}>
            {isPracticing ? 'Finish Practice' : 'Start Practice'}          
            </button>
          <textarea
            ref={textareaRef}
            value={practiceText}
            onChange={handleTextChange} 
            placeholder="Start typing..."
            style={practiceModeStyles.textarea}
          />
        </div>
      );
};

const practiceModeStyles = {
    container: {
      display: 'flex',
      alignItems: 'center',  // Align items vertically in the center
      justifyContent: 'center',  // Center the items horizontally
      height: '100vh',  // Take full height of the viewport
      padding: '20px',
      backgroundColor: '#f0f0f0',  // Light background color
    },
    button: {
      marginRight: '10px',
      padding: '10px 15px',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: '#007bff',  // A nice shade of blue
      color: 'white',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      outline: 'none',
    },
    textarea: {
      width: '70%',  // Making the textarea 70% of the container width
      height: '300px',
      backgroundColor: 'black',
      color: 'white',
      border: '1px solid #ccc',
      borderRadius: '5px',
      padding: '10px',
      fontSize: '16px',
      resize: 'none',  // Disable resizing of the textarea
    }
};

const App = () => {
    console.log("line 79");
    const [currentStep, setCurrentStep] = useState('initial');
    const [browserSupport, setBrowserSupport] = useState(false);

    //this is a check for if the browser is compatible with practice mode
    useEffect(() => {
        console.log("line 85");
        if (!navigator.bluetooth) {
            console.log("line 87");
            setBrowserSupport(false);
        } else {
            console.log("line 90");
            setBrowserSupport(true);
            setCurrentStep('instructions');
        }
    }, [browserSupport]);
    
    //this is basically just the instructions for users to put the device in practice mode
    const handleInstructionsComplete = () => {
        console.log("line 98");
        setCurrentStep('practiceMode');
    }

    const handleBluetoothCheck = () => {
        let auliDevices = []
        navigator.bluetooth.getDevices()
        .then(devices => {
            devices.forEach(device => {
                if (device.name.includes("Cato")) {
                    auliDevices.push(device);
                }
            })
        })
        .then(() => {
            if (auliDevices.length > 0) {
                //setBluetoothDevice(auliDevices[0]);
                //setConnectionStatus(true);
                setCurrentStep('practiceMode');
            } else {
                //setPracticeModeStatus(false);
                //setConnectionStatus(false);
                setCurrentStep('practiceMode');
            }
        })
        .catch(error => {
            console.error('Connection failed', error);
        });
    }

    return (
    <div>
      {currentStep === 'initial' && <CompatibilityCheck isCompatible={browserSupport} />}

      {currentStep === 'instructions' && <ConnectionInstructions onNext={handleInstructionsComplete} />}

      {currentStep === 'bluetoothCheck' && <BluetoothCheck onCheck={handleBluetoothCheck} />}

      {currentStep === 'practiceMode' && <PracticeMode />}
    </div>
    )
}

export default App;