import React, { useState, useEffect} from 'react';
import {KeyOptions, getKeyOption} from './KeyOptions';

const deepCopy = (obj) => {
    return JSON.parse(JSON.stringify(obj));
}
const sectionHeadingStyle = {
    fontSize: '20px',
    marginBottom: '10px',
    fontWeight: 'bold', // Add the fontWeight property
  };

// TODO: load from user defaults
const getInitialBindingsForMode = (config) => {
    console.log(config);
    const defaultConfig = [
        { gesture: 'None', command: 'noop', setting1: '', setting2: '' , setting3: ''},
        { gesture: 'Nod Up', command: 'noop', setting1: '', setting2: '' , setting3: ''},
        { gesture: 'Nod Down', command: 'noop', setting1: '', setting2: '' , setting3: ''},
        { gesture: 'Nod Right', command: 'noop', setting1: '', setting2: '' , setting3: ''},
        { gesture: 'Nod Left', command: 'noop', setting1: '', setting2: '' , setting3: ''},
        { gesture: 'Tilt Right', command: 'noop', setting1: '', setting2: '' , setting3: ''},
        { gesture: 'Tilt Left', command: 'noop', setting1: '', setting2: '' , setting3: ''},
    ];
    if (config.bindings.value) {
        return config.bindings.value;
    }
    return defaultConfig;
};

function generateDescription(binding) {
    switch (binding.command) {
        case "noop":
            return "Does nothing.";
        case "quick_sleep":
            return "Puts Cato in sleep mode with tap to wake.";
        case "pointer_sleep":
            return "Puts Cato in pointer sleep, wake with a gesture.";
        case "quick_calibrate":
            return "Runs quick calibration for drift removal.";
        case "dwell_click":
            if (binding.setting1 && binding.setting2) {
                return `Moves cursor and taps ${buttonMapping(binding.setting1)} on dwell, tilts at speed ${binding.setting2} to cancel.`;
            }
            return "Moves cursor and taps on dwell, tilt to cancel.";
        case "_scroll":
            return "Freezes cursor, look up/down to scroll, look left/right to cancel.";
        case "_scroll_lr":
            return "Freezes cursor, look up/down to scroll horizontally, look left/right to cancel.";
        case "button_action":
            if (binding.setting1 && binding.setting2 && binding.setting3) {
                return `Button Action: ${actorMapping(binding.setting1)} ${actionMapping(binding.setting2)} on ${buttonMapping(binding.setting3)}.`;
            }
            return "Performs a specified action.";
        default:
            return "Unknown command.";
    }
}

function actorMapping(actor) {
    return actor === "0" ? "Mouse" : "Keyboard";
}

function actionMapping(action) {
    const actionMappings = {
        "tap": "taps",
        "double_tap": "double taps",
        "press": "presses and holds",
        "release": "releases",
        "toggle": "toggles press/release",
        "hold_until_idle": "holds until idle",
        "hold_until_sig_motion": "holds until significant motion detected"
    };
    return actionMappings[action] || "Unknown action";
}

function buttonMapping(button) {
    if (button === "1") return "Left Click";
    if (button === "2") return "Right Click";
    else {
        return getKeyOption(button);
    }
}



const BindingsPanel = ({config}) => {

    const [fetchedBindings, setFetchedBindings] = useState(getInitialBindingsForMode(config));
    const [editedBindings, setEditedBindings] = useState(getInitialBindingsForMode(config));

    /*
    const saveBindings = () => {
        setSavedBindings(bindings);
        
        const formattedBindings = bindings.map(binding => {
            let args = [];
    
            if (binding.command === 'dwell_click') {
                // Include only the first two settings for dwell_click
                args = [binding.setting1, binding.setting2].map(arg => isNaN(arg) ? arg : Number(arg)).filter(arg => arg !== '');
            } else if (binding.command === 'button_action') {
                // Include all settings for button_action
                args = [binding.setting1, binding.setting2, binding.setting3].map(arg => isNaN(arg) ? arg : Number(arg)).filter(arg => arg !== '');
            }
    
            return {
                command: binding.command,
                args: args
            };
        });
    
    
        const bindingsToSave = {
            bindings: formattedBindings
        };
    
        setSavedJSON(bindingsToSave);
    
        // For demonstration, logging the formatted bindings
        console.log("Bindings saved:", JSON.stringify(bindingsToSave, null, 2));
        // Here you might send the bindings to a server or update some other state
    };
    */

    useEffect(() => {
        console.log("Edited bindings changed:", editedBindings);
        console.log(config);
        config.bindings.value = deepCopy(editedBindings);
    }, [editedBindings]);
    


    const handleCommandChange = (index, value) => {
        const updatedBindings = [...editedBindings];
        const currentBinding = updatedBindings[index];
    
        // Set default settings only when the command changes for the first time
        if (currentBinding.command !== value) {
            switch (value) {
                case 'dwell_click':
                    updatedBindings[index].setting1 = "1";
                    updatedBindings[index].setting2 = "2";
                    updatedBindings[index].setting3 = '';
                    break;
                case 'button_action':
                    updatedBindings[index].setting1 = "0";
                    updatedBindings[index].setting2 = 'tap';
                    updatedBindings[index].setting3 = "1";
                    break;
                default:
                    // Reset settings for other commands, if necessary
                    updatedBindings[index].setting1 = '';
                    updatedBindings[index].setting2 = '';
                    updatedBindings[index].setting3 = '';
                    break;
            }
        }
    
        updatedBindings[index].command = value;
        setEditedBindings(updatedBindings);
    };
    
    
    
  
    const handleSettingsChange = (index, settingNumber, value) => {
        const updatedBindings = [...editedBindings];
        const currentBinding = updatedBindings[index];
    
        if (currentBinding.command === 'button_action') {
            if (settingNumber === 1) {  // If the actor is being changed
                // Set defaults based on the new actor value
                currentBinding.setting2 = 'tap'; // Default action remains the same
                currentBinding.setting3 = (value === '0') ? '1' : '4'; // Default button based on actor
            }
        }
    
        // Update the setting that has been changed
        currentBinding[`setting${settingNumber}`] = value;
        setEditedBindings(updatedBindings);
    };
    
    const gesturesList = [
        'None',
        'Nod Up',
        'Nod Down',
        'Nod Right',
        'Nod Left',
        'Tilt Right',
        'Tilt Left'
    ]
    

    return (
        <div className='w-16/12 flex flex-col'>
          <h2 style= {sectionHeadingStyle}>Bindings Panel</h2>
          <table className='table-fixed'>
            <thead>
                <tr>
                    <th className="w-2/12 p-2 border border-gray-200">Gesture</th>
                    <th className="w-2/12 p-2 border border-gray-200">Command</th>
                    <th className="w-6/12 p-2 border border-gray-200">Settings</th>
                    <th className="w-6/12 p-2 border border-gray-200">Description</th>
                </tr>
            </thead>
            <tbody>
              {editedBindings.map((binding, index) => (
                
                <tr key={index} className="max-h-16 h-16">

                    {/* Gesture */}
                    <td className="bg-white px-3 py-4 border border-gray-200 text-gray-800 text-md">
                        {gesturesList[index]}
                    </td>

                    {/* Command */}
                    <td className="bg-white px-3 py-4 border border-gray-200 text-gray-800 text-md">
                        <select
                        value={binding.command}
                        onChange={(e) => handleCommandChange(index, e.target.value)}
                        >
                            <option value="noop">None (noop)</option>
                            <option value="quick_sleep">Quick Sleep</option>
                            <option value="pointer_sleep">Pointer Sleep</option>
                            <option value="quick_calibrate">Quick Calibrate</option>
                            <option value="dwell_click">Dwell Click</option>
                            <option value="_scroll">Vertical Scroll</option>
                            <option value="_scroll_lr">Horizontal Scroll</option>
                            <option value="button_action">Button Action</option>
                        </select>
                    </td>
                
                    {/* Settings */}
                    <td className={
                        'bg-grey-200 px-3 text-gray-800 text-md ' +
                        (binding.command === 'dwell_click' || binding.command === 'button_action' 
                            ? 'border border-gray-200' 
                            : 'border-x border-gray-200')
                    }>
                        {binding.command === 'dwell_click'? (
                            <div className="w-full h-full flex flex-row ">
                                {/* BUTTON */}
                                <div className='w-full flex-0 flex flex-col items-center'>
                                    <th className="w-full px-4 text-center text-sm">Button</th>
                                    <select className='w-full py-1 text-sm'
                                    value={binding.setting1}
                                    onChange={(e) => handleSettingsChange(index, 1, e.target.value)}
                                    >
                                        <option value={1}>Left Mouse Click</option>
                                        <option value={2}>Right Mouse Click</option>
                                    </select>
                                </div>
                            
                                {/* CANCEL_THS */}
                                <div className='w-full flex-0 flex flex-col items-center'>
                                    <th className="w-full px-4 text-center text-sm">Cancel Speed</th>
                                    <select className='w-5/6 py-1 text-sm'
                                    value={binding.setting2}
                                    onChange={(e) => handleSettingsChange(index, 2, e.target.value)}
                                    >
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                        <option value={5}>5</option>
                                        <option value={6}>6</option>
                                        <option value={7}>7</option>
                                        <option value={8}>8</option>
                                        <option value={9}>9</option>
                                        <option value={10}>10</option>
                                    </select>
                                </div>
                            </div>
                        ) : <div className="w-full h-full" />}
                        {binding.command === 'button_action'? (
                            <div className="w-full h-full flex flex-row">
                                {/* ACTOR */}
                                <div className='w-full px-3 flex-0 flex flex-col items-center'>
                                    <th className="w-full px-1 text-center text-sm">Actor</th>
                                    <select className='w-5/6 py-1 text-sm'
                                    value={binding.setting1}
                                    onChange={(e) => handleSettingsChange(index, 1, e.target.value)}
                                    >
                                        <option selected="selected" value={0}>Mouse</option>
                                        <option value={1}>Keyboard</option>
                                    </select>
                                </div>

                                {/* ACTION */}
                                <div className='w-full px-3 flex-0 flex flex-col items-center'>
                                    <th className="w-full px-1 text-center text-sm">Action</th>
                                    <select className='w-5/6 py-1 text-sm'
                                    value={binding.setting2}
                                    onChange={(e) => handleSettingsChange(index, 2, e.target.value)}
                                    >
                                        <option value={'tap'}>Tap</option>
                                        <option value={'double_tap'}>Double Tap</option>
                                        <option value={'press'}>Press and Hold</option>
                                        <option value={'release'}>Release</option>
                                        <option value={'toggle'}>Toggle</option>
                                        <option value={'hold_until_idle'}>Hold Until Idle</option>
                                        <option value={'hold_until_sig_motion'}>Hold Until Significant Motion</option>=
                                    </select>
                                </div>
                                {/* BUTTON */}
                                {binding.setting1 === "1" ? (
                                    <div className='px-3 w-full flex-0 flex flex-col items-center'>
                                        <th className="w-full px-1 text-center text-sm">Button</th>
                                        <select className='w-5/6 py-1 text-sm'
                                                value={binding.setting3}
                                                onChange={(e) => handleSettingsChange(index, 3, e.target.value)}>
                                            <KeyOptions />
                                        </select>
                                    </div>
                                ) : (
                                    <div className='px-3 w-full flex-0 flex flex-col items-center'>
                                        <th className="w-full px-1 text-center text-sm">Button</th>
                                        <select className='w-5/6 py-1 text-sm'
                                                value={binding.setting3}
                                                onChange={(e) => handleSettingsChange(index, 3, e.target.value)}>
                                            <option value={1}>Left Mouse Click</option>
                                            <option value={2}>Right Mouse Click</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        ) : <div className="w-full h-full" />}
                    </td>

                    {/* Description Cell */}
                    <td className="bg-white px-3 py-2 border border-gray-200 text-gray-800 text-sm overflow-hidden">
                        <div className="max-h-16">
                            {generateDescription(binding)}
                        </div>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Button Container */}
          
        </div>
      );
    };
    

export default BindingsPanel;
