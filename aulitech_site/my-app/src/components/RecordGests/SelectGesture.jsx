import React, { useState, useEffect } from "react";
import { TrashIcon } from '@heroicons/react/20/solid';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { writeBatch } from "firebase/firestore";
import { initGestureFile, checkForFlagFile } from './initGestureFile';
import { uploadLogToFirebase } from './initGestureFile';
import { get, set } from 'idb-keyval';
import { checkDeviceConnection } from '../NavBar/ReplaceConfig';

import { getStorage, ref, uploadBytes } from "firebase/storage";


const GestureGrid = ({ activeGestureId, gestures, handleGestureSelect, startRecording, deleteSelectedRecordings }) => {
  const activeGesture = gestures.find(g => g.id === activeGestureId);
  const [selectedRecordings, setSelectedRecordings] = useState([]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAll = () => {
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
  };

  const toggleRecordingSelection = (recordingId) => {
    setSelectedRecordings(prevSelected => {
      if (prevSelected.includes(recordingId)) {
        return prevSelected.filter(id => id !== recordingId);
      } else {
        return [...prevSelected, recordingId];
      }
    });
  };

  const handleDeleteSelected = () => {
    deleteSelectedRecordings(selectedRecordings);
    setSelectedRecordings([]);
  };

  const handleDeleteAllRecordings = () => {
    const allRecordingIds = activeGesture.recordings.map(recording => recording.docId);
    deleteSelectedRecordings(allRecordingIds);
    closeDeleteConfirm();
  };

  return (
    <div className="flex">
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center">
            <p className="text-lg font-medium text-center mb-4">
              Are you sure you want to delete all recordings?
            </p>
            <div className="flex space-x-4">
              <button className="rounded-md bg-red-500 p-3 text-white hover:bg-red-700"
                onClick={handleDeleteAllRecordings}
              >
                Yes
              </button>
              <button
                className="rounded-md bg-gray-300 p-3 hover:bg-gray-400"
                onClick={closeDeleteConfirm}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* <div className="border border-gray-200 p-4 rounded-md shadow-md"> */}
      {/* <div className="w-1/4 p-4 space-y-4 bg-gray-200 rounded"> */}
      {/* <div className="w-1/4 p-4 space-y-4 border border-bg-gray-200 rounded-md shadow-md"> */}

      <div className="w-1/4 p-4 space-y-4 border border-bg-gray-200 rounded-md shadow-lg">
        {gestures.map((gesture) => (
          <div key={gesture.id} className="flex justify-between items-center">
            <button
              className={`flex-1 text-left p-2 rounded-md transition-colors duration-150 ease-in-out ${activeGestureId === gesture.id ? 'bg-yellow-300 text-black border border-yellow-600' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
              onClick={() => handleGestureSelect(gesture.id)}
            >
              {gesture.name}
            </button>
          </div>
        ))}
        <button
          className="w-full text-left p-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          onClick={() => handleGestureSelect(null)}
        >
          +
        </button>
      </div>
      <div className="w-3/4 p-4 rounded-lg">
        {activeGesture ? (
          <>
            <div className="border border-gray-200 p-4 rounded-md shadow-md">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <span className="text-lg font-medium text-gray-900 mr-4">
                    {activeGesture.name}
                  </span>
                  <span className="bg-blue-200 text-blue-800 font-bold py-1 px-3 rounded-full">
                    Count: {activeGesture.recordings.length}
                  </span>
                </div>
                <button
                  className="rounded-full bg-red-500 p-3 shadow-lg text-white hover:bg-red-600 focus:outline-none focus:ring"
                  onClick={() => startRecording(gestures.find(g => g.id === activeGestureId))}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <div className="h-48 overflow-auto bg-white p-4 rounded shadow-md">
                {activeGesture.recordings.length > 0 ? (
                  <div>
                    {activeGesture.recordings.map((recording, index) => (
                      <div
                        key={index}
                        className={`flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer ${selectedRecordings.includes(recording.docId) ? 'bg-blue-100' : ''}`}
                        onClick={() => toggleRecordingSelection(recording.docId)}
                      >
                        {recording.timestamp}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500">No recordings</div>
                )}
              </div>

              {activeGesture.recordings.length > 0 && (
                <div className="flex justify-between mt-2">
                  {/* delete all button */}
                  <button
                    className="rounded-md bg-gray-300 p-2 hover:bg-gray-400 disabled:opacity-50"
                    onClick={handleDeleteAll}
                  >
                    Delete All
                  </button>

                  <div className="flex-grow"></div>

                  {/* trashcan icon */}
                  <button
                    className="rounded-md bg-gray-300 p-2 hover:bg-gray-400 disabled:opacity-50"
                    onClick={handleDeleteSelected}
                    disabled={selectedRecordings.length === 0}
                  >
                    <TrashIcon className="h-6 w-6 text-black" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">Please select a gesture to start recording.</div>
        )}
      </div>
    </div>
  );
};

let directoryHandle = null;

const SelectGesture = ({ user }) => {
  //for gesture.cato file:
  const [timestamp, setTimestamp] = useState('');
  const [gestureName, setGestureName] = useState('');
  const [numRecordings, setNumRecordings] = useState();
  const [timeBetween, setTimeBetween] = useState();
  const [timeToSituate, setTimeToSituate] = useState();
  const [timeForUnplugging, setTimeForUnplugging] = useState();

  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled out
    if (!timestamp || !gestureName || !numRecordings || !timeBetween) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    // clear existing errors
    setErrorMessage('');

    try {
      await initGestureFile();
  
      // Provide default values for optional fields
      const defaultTimeToSituate = timeToSituate || '0';
      const defaultTimeForUnplugging = timeForUnplugging || '0';
  
      const gestureCatoContent = [
        `${timestamp}`,
        `${gestureName}`,
        `${numRecordings}`,
        `${timeBetween}`,
        `${defaultTimeToSituate}`,
        `${defaultTimeForUnplugging}`,
      ].join('\n');  

      console.log("Content to be written:", gestureCatoContent);

      const fileHandle = await directoryHandle.getFileHandle('gesture.cato', { create: true });
      const writable = await fileHandle.createWritable();

      await writable.write(gestureCatoContent);
      await writable.close();

      const file = await fileHandle.getFile();
      const text = await file.text();
      console.log("File content after write:", text);

    } catch (error) {
      if (error instanceof DOMException) {
        alert("ERROR: Please plug in a valid device.");
      } else {
        console.error("Error in form submission:", error);
        setErrorMessage("An unexpected error occurred.");
      }
    }

    readAndUploadFiles(timestamp, gestureName, numRecordings);

    setShowPopup(false);
    stopRecording();

  };

  const waitForFile = async (fileName, retries = 5000, interval = 5000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const fileHandle = await directoryHandle.getFileHandle(fileName, { create: false });
        return fileHandle;
      } catch (error) {
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, interval)); 
        } else {
          throw error; 
        }
      }
    }
  };
  
  const readAndUploadFiles = async (timestamp, gestureName, numRecordings, docId) => {
    try {
      const fileNames = Array.from({ length: numRecordings }, (_, index) => `${timestamp}_${gestureName}_${index + 1}.txt`);
  
      for (const fileName of fileNames) {
        try {
          const fileHandle = await waitForFile(fileName);
          const file = await fileHandle.getFile();
          const fileContent = await file.text();
          // Pass the docId to the upload function
          console.log("File:", file);
          console.log("File content:", await file.text());
          console.log("File name:", fileName);
          await uploadFileToFirebase(fileContent, fileName);
        } catch (error) {
          console.error(`Error accessing file ${fileName}:`, error);
        }
      }
    } catch (error) {
      console.error("Error in reading and uploading files:", error);
    }
  };

// const uploadFileToFirebase = async (file, fileName) => {
//   try {
//       const storage = getStorage();
//       const storageRef = ref(storage, `gestures/${fileName}`);

//       await uploadBytes(storageRef, file);
//       console.log(`File ${fileName} uploaded successfully`);
//   } catch (error) {
//       console.error(`Error uploading file ${fileName} to Firebase:`, error);
//   }
// };
const uploadFileToFirebase = async (file, fileName) => {

  const duration = new Date() - recordingStart;
  const timestamp = new Date();

  console.log("uploadFileToFirebase");
  console.log("file:", file);
  console.log(`Attempting to upload file: ${fileName}`);
  try {
    //const storage = getStorage();
    // Use the docId in the storage path to organize files under their respective document in Firestore
    //const storageRef = ref(storage, `gesture-data/${docId}/${fileName}`);
    //const result = await uploadBytes(storageRef, file);
    const gestureRef = collection(db, "gesture-data");
    const result = await addDoc(gestureRef, {
      useruid: user.uid,
      gesture: selectedGesture.name,
      timestamp,
      duration,
      fileName: fileName, 
      log: file
    });
    console.log(`File ${fileName} uploaded successfully`, result);
  } catch (error) {
    console.error(`Error uploading file ${fileName} to Firebase:`, error);
  }
};




  //rest: -----------------------------------------------------------------------
  const [directoryHandle, setDirectoryHandle] = useState(null);

  //hereeeeeeee
  const stopRecording = async () => {
    if (!selectedGesture) {
      console.error("No gesture selected.");
      return;
    }

    if (!directoryHandle) {
      console.error("Directory handle is not initialized.");
      return;
    }

    const duration = new Date() - recordingStart;
    const timestamp = new Date();
    setShowPopup(false);

    try {
      const baseFileName = `${timestamp}_${selectedGesture.name}_${numRecordings}.txt`;

      let fileHandle = null;
      let logText = "";
      let retries = 0;
      const maxRetries = 5000; 
      const retryDelay = 5000

      while (!fileHandle && retries < maxRetries) {
        try {
          fileHandle = await directoryHandle.getFileHandle(baseFileName, { create: false });

          // fileHandle = await directoryHandle.getFileHandle('log.txt', { create: false });
          const file = await fileHandle.getFile();
          logText = await file.text();

          if (logText.trim()) {
            // firestore
            await uploadLogToFirebase(selectedGesture.id, logText);
            console.log("Log uploaded successfully to Firestore for gesture ID:", selectedGesture.id);
            break; 
          }
        } catch (error) {
          if (retries === maxRetries - 1) {
            throw new Error('file not found after maximum retries.');
          }
          // wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          retries++;
        }
      }

      

      if (!logText) {
        throw new Error('file not found or is empty after retries.');
      }

      //const csvPath = `gestures/${selectedGesture.id}/${timestamp.toISOString()}.csv`;

      const gestureDataRef = collection(db, "gesture-data");
      const recordingData = {
        useruid: user.uid,
        gesture: selectedGesture.name,
        timestamp,
        duration,
        gestureData,
        log: logText,
        //csvPath
      };
      const docRef = await addDoc(gestureDataRef, recordingData);

      const newRecording = {
        timestamp: timestamp.toLocaleString(),
        docId: docRef.id,
      };
      setGestures(currentGestures => currentGestures.map(g => {
        if (g.id === selectedGesture.id) {
          return {
            ...g,
            recordings: [...g.recordings, newRecording]
          };
        }
        return g;
      }));

      console.log("Recording saved for gesture:", selectedGesture.name);
      console.log(`File ${baseFileName} found and read successfully.`);

    } catch (error) {
      console.error("Error during recording stop process:", error);
    }

    setIsRecording(false);
    setCountdown(10);
  };

  const [showPopup, setShowPopup] = useState(false);
  const [selectedGesture, setSelectedGesture] = useState(null);
  const [recordingStart, setRecordingStart] = useState(null);

  const [flagFileFound, setFlagFileFound] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const [activeGestureId, setActiveGestureId] = useState(null);
  const [gestureData, setGestureData] = useState([]);

  const [gestures, setGestures] = useState([
    { id: 1, name: "Nod up", count: 0, recordings: [] },
    { id: 2, name: "Nod down", count: 0, recordings: [] },
    { id: 3, name: "Nod right", count: 0, recordings: [] },
    { id: 4, name: "Nod left", count: 0, recordings: [] },
    // { id: 5, name: "Tilt right", count: 0, recordings: [] },
    // { id: 6, name: "Tilt left", count: 0, recordings: [] },
    // { id: 7, name: "Shake vertical", count: 0, recordings: [] },
    // { id: 8, name: "Shake horizontal", count: 0, recordings: [] },
    // { id: 9, name: "Circle clockwise", count: 0, recordings: [] },
    // { id: 10, name: "Circle counterclockwise", count: 0, recordings: [] },
  ]);

  useEffect(() => {
    const initDirectoryHandle = async () => {
      try {
        let dirHandle = await get('directoryHandle');
        if (!dirHandle) {
          dirHandle = await window.showDirectoryPicker();
          await set('directoryHandle', dirHandle);
        }
        setDirectoryHandle(dirHandle);
      } catch (error) {
        console.error('Error initializing gesture file:', error);
      }
    };

    initDirectoryHandle();
    getGestStats();
  }, []);


  const handleGestureSelect = async (gestureId) => {
    const gesture = gestures.find(g => g.id === gestureId);
    if (gesture) {
      setSelectedGesture(gesture);
      setActiveGestureId(gestureId);
    }
  };

  const deleteSelectedRecordings = async (selectedIds) => {
    const batch = writeBatch(db);

    selectedIds.forEach((id) => {
      const ref = doc(db, "gesture-data", id);
      batch.delete(ref);
    });
    await batch.commit();

    setGestures(currentGestures => {
      return currentGestures.map(gesture => {
        if (gesture.id === activeGestureId) {
          return {
            ...gesture,
            recordings: gesture.recordings.filter(recording => !selectedIds.includes(recording.docId)),
          };
        }
        return gesture;
      });
    });
  };

  const addGestureData = (newData) => {
    setGestureData(prevData => [...prevData, newData]);
  };

  const startRecording = async (gesture) => {

    setShowPopup(true);

    // Reset form fields to empty when opening the form
    setTimestamp('');
    setGestureName('');
    setNumRecordings('');
    setTimeBetween('');
    setTimeToSituate('');
    setTimeForUnplugging('');


  };


  const getGestStats = async () => {
    const dataRef = collection(db, "gesture-data");
    const userDataQuery = query(dataRef, where("useruid", "==", user.uid));
    const snapshot = await getDocs(userDataQuery);
    const updatedGestures = gestures.map(gesture => ({
      ...gesture,
      recordings: []
    }));

    snapshot.forEach((doc) => {
      const gestureName = doc.data().gesture;
      const gestureIndex = updatedGestures.findIndex(g => g.name === gestureName);
      if (gestureIndex !== -1) {
        const timestampString = doc.data().timestamp.toDate().toLocaleString();
        const recording = {
          timestamp: timestampString,
          docId: doc.id
        };
        if (!updatedGestures[gestureIndex].recordings.find(r => r.timestamp === timestampString)) {
          updatedGestures[gestureIndex].recordings.push(recording);
        }
      }
    });

    //sort recordings
    updatedGestures.forEach(gesture => {
      gesture.recordings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    });

    setGestures(updatedGestures);
  };

  const closeModal = () => {
    setShowPopup(false);
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };


  return (
    <div className="">
      <div className="border-b border-gray-200 pb-10">
        <GestureGrid
          activeGestureId={activeGestureId}
          gestures={gestures}
          handleGestureSelect={handleGestureSelect}
          startRecording={startRecording}
          deleteSelectedRecordings={deleteSelectedRecordings}
        />
      </div>

      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center justify-between" style={{ width: '50%', maxHeight: '70%', overflowY: 'auto' }}>

            <button
              className="absolute top-0 right-0 m-2 text-gray-600 hover:text-gray-900 bg-transparent border-none cursor-pointer"
              onClick={() => setShowPopup(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {errorMessage && (
              <div className="text-center text-red-500 font-bold text-lg mb-2 w-full">
                {errorMessage}
              </div>
            )}

            <p className="text-lg font-medium text-center mb-2">
              <strong>Instructions:</strong> Fill in the details to start recording.
            </p>
            <hr className="w-full mb-4" />
            <form onSubmit={handleFormSubmit} className="w-full">
              <div className="flex mb-2 justify-center items-center">
                <label className="w-1/3 text-right mr-2 text-gray-600">Timestamp:</label>
                <input className="w-1/6 p-2 border border-gray-300 rounded" type="text" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} />
              </div>

              <div className="flex mb-2 justify-center items-center">
                <label className="w-1/3 text-right mr-2 text-gray-600">Gesture Name:</label>
                <input className="w-1/6 p-2 border border-gray-300 rounded" type="text" value={gestureName} onChange={(e) => setGestureName(e.target.value)} />
              </div>

              <div className="flex mb-2 justify-center items-center">
                <label className="w-1/3 text-right mr-2 text-gray-600">Number of recordings:</label>
                <input className="w-1/6 p-2 border border-gray-300 rounded" type="text" value={numRecordings} onChange={(e) => setNumRecordings(e.target.value)} />
              </div>

              <div className="flex mb-2 justify-center items-center">
                <label className="w-1/3 text-right mr-2 text-gray-600">Time between recordings:</label>
                <input className="w-1/6 p-2 border border-gray-300 rounded" type="text" value={timeBetween} onChange={(e) => setTimeBetween(e.target.value)} />
              </div>

              <div className="flex mb-2 justify-center items-center">
                <label className="w-1/3 text-right mr-2 text-gray-600">Time to Situate Device (optional):</label>
                <input className="w-1/6 p-2 border border-gray-300 rounded" type="text" value={timeToSituate} onChange={(e) => setTimeToSituate(e.target.value)} />
              </div>

              <div className="flex mb-2 justify-center items-center">
                <label className="w-1/3 text-right mr-2 text-gray-600">Time for Unplugging (optional):</label>
                <input className="w-1/6 p-2 border border-gray-300 rounded" type="text" value={timeForUnplugging} onChange={(e) => setTimeForUnplugging(e.target.value)} />
              </div>

              <div className="flex justify-end items-center mt-4"> {/* This will align the button to the right */}
                <button type="submit" className="bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 focus:outline-none focus:shadow-outline">
                  Submit
                </button>
              </div>
            </form>
            {/* <p className="text-lg font-medium">
                    {flagFileFound ? "Start recording NOW" : (isRecording ? `Recording ends in: ${countdown} seconds` : "Recording...")}
                </p> */}
            {/* <button className="rounded-md bg-red-500 p-3 text-white hover:bg-red-700" 
                    onClick={stopRecording}
                >
                    Stop Recording
                </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectGesture;
