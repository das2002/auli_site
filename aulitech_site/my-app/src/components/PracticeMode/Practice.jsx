import React, { useState, useRef, useContext } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { overwriteConfigFile } from '../NavBar/ReplaceConfig';

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
                        if (parsedJson['global_info']['name']['value'] !== currentDevice){
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

const Practice = () => {
    const { deviceName } = useParams();

    const [originalJson, setOriginalJson] = useState({}); // original device config with standard operation mode 

    const navigate = useNavigate();

    const [practiceText, setPracticeText] = useState('');
    const [originalMode, setOriginalMode] = useState('');
    const [isPracticing, setIsPracticing] = useState(false);
    const textareaRef = useRef(null);

    const togglePractice = async () => {
        if (isPracticing) { // turning off current practice
            textareaRef.current.blur();
            // download the original config.json file
            overwriteConfigFile(originalJson);
            // setIsPracticeMode(false);
            navigate("/")
        } else { // turning on current practice 
            const success = await getConfigFromCato(setOriginalJson, deviceName);
            if (success) { // file picked 
                textareaRef.current.focus();
                // setSavedConfig(originalJson)
                // setIsPracticeMode(true); // general practice mode state from Navigation.jsx 
            }
        }
        setIsPracticing(true)
    };
    

    const handleTextChange = (event) => {
        setPracticeText(event.target.value);
    };

    return (
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
    );
    
}

export default Practice;