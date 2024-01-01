import React, { useState, useEffect } from "react";
import { TrashIcon } from '@heroicons/react/20/solid';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  deleteDoc
} from "firebase/firestore";
import { db } from "../../firebase";
import StoreGestData from "../CloudFirestore/StoreGestData";

const SelectGesture = ({ user }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedGesture, setSelectedGesture] = useState(null);
  const [recordingStart, setRecordingStart] = useState(null);
  const [selectedTimestamps, setSelectedTimestamps] = useState({});

  const [gestures, setGestures] = useState([
    { id: 1, name: "Nod up", count: 0, recordings: [] },
    { id: 2, name: "Nod down", count: 0, recordings: [] },
    { id: 3, name: "Nod right", count: 0, recordings: [] },
    { id: 4, name: "Nod left", count: 0, recordings: [] },
    { id: 5, name: "Tilt right", count: 0, recordings: [] },
    { id: 6, name: "Tilt left", count: 0, recordings: [] },
    { id: 7, name: "Shake vertical", count: 0, recordings: [] },
    { id: 8, name: "Shake horizontal", count: 0, recordings: [] },
    { id: 9, name: "Circle clockwise", count: 0, recordings: [] },
    { id: 10, name: "Circle counterclockwise", count: 0, recordings: [] },
    ]);

  useEffect(() => {
    getGestStats();
  }, []);

  async function writeFileToDevice(fileName, content) {
      try {
          console.log(`Writing file ${fileName} to device...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log(`File ${fileName} written to device.`);
          return true;
      } catch (error) {
          console.error(`Failed to write file ${fileName} to device:`, error);
          return false;
      }
  }

  async function connectToDevice() {
      try {
          // device connection logic here
          console.log("Connecting to device...");
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log("Device connected.");
          return true; // true if successfully connected
      } catch (error) {
          console.error("Failed to connect to device:", error);
          return false;
      }
  }


  async function readFileFromDevice(fileName) {
      try {
          console.log(`Reading file ${fileName} from device...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          const fileContent = "Sample content from device"; //placeholder
          console.log(`File ${fileName} read from device.`);
          return fileContent;
      } catch (error) {
          console.error(`Failed to read file ${fileName} from device:`, error);
          return null;
      }
  }


  const initiateRecording = async () => {
    try {
      const device = await connectToDevice(); // connect to device
      await writeFileToDevice(device, 'gesture.cato', ''); // empty file for reboot
      console.log('Device reboot initiated for gesture collection.');

    } catch (error) {
      console.error('Error initiating recording:', error);
    }
  };

  const fetchGestureData = async () => {
    try {
      const device = await connectToDevice(); // reconnect to device if needed
      const logData = await readFileFromDevice(device, 'log.txt');
      // processAndUploadData(logData); // process + upload data to Firebase
    } catch (error) {
      console.error('Error fetching gesture data:', error);
    }
  };

  const selectTimestamp = (gestureName, timestamp) => {
    setSelectedTimestamps(prev => ({ ...prev, [gestureName]: timestamp }));
  };

  const deleteRecording = async (gestureName) => {
    const selectedRecording = selectedTimestamps[gestureName];
    if (!selectedRecording) return;

    // delete the recording from FB
    const recordingDocRef = doc(db, "gesture-data", selectedRecording.docId);
    await deleteDoc(recordingDocRef);

    // update the local state & remove recordings
    setGestures(currentGestures => {
      return currentGestures.map(gesture => {
        if (gesture.name === gestureName) {
          return {
            ...gesture,
            recordings: gesture.recordings.filter(recording => recording.timestamp !== selectedRecording.timestamp)
          };
        }
        return gesture;
      });
    });
    setSelectedTimestamps(prev => ({ ...prev, [gestureName]: null }));
  };

  let gestureEvents = [];

  const startRecording = (gesture) => {
    setSelectedGesture(gesture);
    setRecordingStart(new Date());
    setShowPopup(true);
    gestureEvents = []; // clear the gesture events
  };

  const logGestureEvent = (gestureType) => {
    const startTime = new Date();
    // const endTime = ...
    // const duration = endTime - startTime;

    gestureEvents.push({
      gesture: gestureType,
      startTime: startTime.toISOString(),
      // endTime: endTime.toISOString(), //when the gesture ends
      // duration: duration,
    });
  };
  
  const stopRecording = async () => {
    const duration = new Date() - recordingStart;
    const timestamp = new Date();
    setShowPopup(false);
  
    if (selectedGesture) {
      try {
        const recordingEnd = new Date();
        const gestureDataRef = collection(db, "gesture-data");
        const csvData = gestureEvents.map(event => {
          const endTime = new Date(); // gesture's end time
          const duration = endTime - new Date(event.startTime);
          return `${event.gesture},${event.startTime},${endTime.toISOString()},${duration},${user.uid}`;
        }).join('\n');
        const csvContent = `Gesture,StartTime,EndTime,Duration,User\n${csvData}`;

        // const recordingData = { 
        //   csvData: csvData,
        //   useruid: user.uid, 
        //   gesture: selectedGesture.name, 
        //   timestamp, 
        //   duration 
        // };
        
        const formattedData = `Gesture: ${selectedGesture.name}, Duration: ${duration}, Timestamp: ${timestamp}`;
        StoreGestData(selectedGesture.name, user, formattedData);
        setGestures(currentGestures => {
          return currentGestures.map(gesture => {
            if (gesture.name === selectedGesture.name) {
              const newRecording = {
                timestamp: timestamp.toLocaleString(),
                // docId: docRef.id // use document ID from Firestore
              };
              return {
                ...gesture,
                recordings: [...gesture.recordings, newRecording]
              };
            }
            return gesture;
          });
        });
  
        console.log("Recording saved for gesture:", selectedGesture.name);
        gestureEvents = [];
      } catch (error) {
        console.error("Error saving recording data:", error);
      }
    }
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
          docId: doc.id  // store FB document id
        };
        if (!updatedGestures[gestureIndex].recordings.find(r => r.timestamp === timestampString)) {
          updatedGestures[gestureIndex].recordings.push(recording);
        }
      }
    });
    setGestures(updatedGestures);
  };

  const GestureGrid = () => {
    return (
      <div className="mt-4 mx-auto max-w-2xl">
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          {gestures.map((gesture) => (
            <div
              key={gesture.id}
              className="relative flex flex-col items-center rounded-lg border border-gray-200 bg-gray-200 p-4 shadow-sm focus:outline-none"
            >
              <span className="block text-lg font-medium text-gray-900">
                {gesture.name}
              </span>
              <div className="mt-4 w-full flex items-center justify-between px-2">
                <button
                  className="rounded-md p-1 cursor-pointer transition-colors duration-150 ease-in-out"
                  style={{ backgroundColor: 'rgba(219, 71, 71, 0.5)' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(201, 67, 67, 0.7)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(219, 71, 71, 0.5)'}
                  onClick={() => startRecording(gesture)}
                >
                  <svg className="h-8 w-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" fill="#F00B0B" />
                  </svg>
                </button>
                <div className="flex-grow bg-white p-4 mx-2 rounded shadow flex flex-col items-center h-24 overflow-auto">
                  {gesture.recordings.length > 0 ? (
                    gesture.recordings.map((recording, index) => (
                      <div
                        key={index}
                        className={`text-sm cursor-pointer ${selectedTimestamps[gesture.name]?.timestamp === recording.timestamp ? 'bg-gray-200' : ''}`}
                        onClick={() => selectTimestamp(gesture.name, recording)}
                      >
                        {recording.timestamp}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">No recordings</div>
                  )}
                </div>
                <button
                  className="rounded-md bg-gray-300 p-2 text-gray-700 hover:bg-gray-500 cursor-pointer"
                  onClick={() => deleteRecording(gesture.name)}
                >
                  <TrashIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };  
  
  return (
    <div className="">
      <div className="border-b border-gray-200 pb-10">
        <GestureGrid />
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center justify-between" style={{ width: '50%', height: '50%' }}>
            <p className="text-lg font-medium text-center">
              <strong>Instructions:</strong> When the prompt for you to gesture shows up, perform the gesture as you would.
            </p>
            <p className="text-lg font-medium">Recording...</p>
            <button 
              className="rounded-md bg-red-500 p-3 text-white hover:bg-red-700" 
              onClick={stopRecording}
            >
              Stop Recording
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectGesture;
