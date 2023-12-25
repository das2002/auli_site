import React, { useState, useEffect, useRef } from 'react';

const CompatibilityCheck = ({isCompatible}) => {
    if (isCompatible) {
        return null;
    }
    return <p>Your browser does not support Bluetooth. Please use a compatible browser.</p>;
};

const ConnectionInstructions = ({ onNext }) => {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Instructions to Put Device in Practice Mode:</h2>
        <ol style={styles.list}>
          <li>Connect your Cato to the computer via USB.</li>
          <li>Access the file system and find the device under your USB devices.</li>
          <li>Find <strong>config.json</strong>.</li>
          <li>Open up <strong>config.json</strong> and change the <strong>label</strong> field in operation mode to 'practice'.</li>
          <li>Save the file.</li>
          <li>Properly eject the device from USB connection.</li>
          <li>Connect to the device via Bluetooth.</li>
        </ol>
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
    const [isPracticing, setIsPracticing] = useState(false);
    const [practiceText, setPracticeText] = useState('');
    const textareaRef = useRef(null);
    const togglePractice = () => {
        if (isPracticing) {
            textareaRef.current.blur();
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