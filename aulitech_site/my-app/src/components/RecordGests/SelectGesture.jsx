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

const GestureGrid = ({ activeGestureId, gestures, handleGestureSelect, startRecording, deleteRecording }) => {
  const activeGesture = gestures.find(g => g.id === activeGestureId);

  return (
    <div className="flex">
      <div className="w-1/4 p-4 space-y-4 bg-gray-700 rounded">
        {gestures.map((gesture) => (
          <div key={gesture.id} className="flex justify-between items-center">
            <button
              className={`flex-1 text-left p-2 rounded-md transition-colors duration-150 ease-in-out ${activeGestureId === gesture.id ? 'bg-blue-400 text-black' : 'bg-blue-200 hover:bg-blue-200'}`}
              onClick={() => handleGestureSelect(gesture.id)}
            >
              {gesture.name}
            </button>
          </div>
        ))}
        <button
          className="w-full text-left p-2 bg-blue-200 rounded-md hover:bg-blue-300" 
          onClick={() => handleGestureSelect(null)}
        >
          +
        </button>
      </div>
      <div className="w-3/4 p-4 rounded-lg">
        {activeGesture ? (
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
                {gestures.find(g => g.id === activeGestureId)?.recordings.length > 0 ? (
                  gestures.find(g => g.id === activeGestureId).recordings.map((recording, index) => (
                    <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-100">
                      {recording.timestamp}
                      <button
                        className="rounded-md bg-gray-300 p-2 text-gray-700 hover:bg-gray-400"
                        onClick={() => deleteRecording(recording.docId)}
                      >
                        <TrashIcon className="h-5 w-5" aria-hidden="true" />
                      </button>

                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500">No recordings</div>
                )}
              </div>
              </div>
              
        ) : (
          <div className="text-center text-gray-500">Please select a gesture to start recording.</div>
        )}
      </div>
    </div>
  );     
};  

const SelectGesture = ({ user }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedGesture, setSelectedGesture] = useState(null);
  const [recordingStart, setRecordingStart] = useState(null);
  const [selectedTimestamps, setSelectedTimestamps] = useState({});

  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const [activeGestureId, setActiveGestureId] = useState(null);


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
    getGestStats();
  }, []);

  const selectTimestamp = (gestureName, timestamp) => {
    setSelectedTimestamps(prev => ({ ...prev, [gestureName]: timestamp }));
  };

  const writeToFile = (fileName, data) => {
    console.log(`Writing to ${fileName}:`, data);
  };

  const handleGestureSelect = (gestureId) => {
    const gesture = gestures.find(g => g.id === gestureId);
    if (gesture) {
      setSelectedGesture(gesture);
      setActiveGestureId(gestureId);
    }
  };

  const GestureSelectionButtons = () => (
    <div className="flex flex-col space-y-2">
      {gestures.map((gesture) => (
        <button
          key={gesture.id}
          className={`p-2 text-left ${activeGestureId === gesture.id ? 'bg-blue-500 text-white' : 'bg-blue-200'}`}
          onClick={() => handleGestureSelect(gesture.id)}
        >
          {gesture.name}
        </button>
      ))}
      <button
        className="p-2 bg-green-200"
        onClick={() => handleGestureSelect(null)}
      >
        +
      </button>
    </div>
  );

  const deleteRecording = async (recordingId) => {
    if (!recordingId) return;
  
    const recordingDocRef = doc(db, "gesture-data", recordingId);
    await deleteDoc(recordingDocRef);
  
    setGestures((currentGestures) => {
      return currentGestures.map((gesture) => {
        if (gesture.id === activeGestureId) {
          return {
            ...gesture,
            recordings: gesture.recordings.filter((recording) => recording.docId !== recordingId),
          };
        }
        return gesture;
      });
    });
  };  


  const startRecording = (gesture) => {
    setSelectedGesture(gesture);
    setRecordingStart(new Date());
    setShowPopup(true);
    setIsRecording(true);

    // simulate writing to gesture.cato to start recording!
    writeToFile('gesture.cato', { gestureName: gesture.name, startTime: new Date() });

    //countdown
    const countdownInterval = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount === 1) {
          clearInterval(countdownInterval);
          stopRecording();
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  const stopRecording = async () => {
    const duration = new Date() - recordingStart;
    const timestamp = new Date();
    setShowPopup(false);
  
    if (selectedGesture) {
      try {
        const gestureDataRef = collection(db, "gesture-data");
        const recordingData = { useruid: user.uid, gesture: selectedGesture.name, timestamp, duration };
        const docRef = await addDoc(gestureDataRef, recordingData); 
  
        //update new recording
        setGestures(currentGestures => {
          return currentGestures.map(gesture => {
            if (gesture.name === selectedGesture.name) {
              const newRecording = {
                timestamp: timestamp.toLocaleString(),
                docId: docRef.id //firebase
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
      } catch (error) {
        console.error("Error saving recording data:", error);
      }
    }

    setIsRecording(false);
    setCountdown(10);

    writeToFile('log.txt', { gestureName: selectedGesture.name, duration, timestamp });

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
  
  return (
    <div className="">
      <div className="border-b border-gray-200 pb-10">
        <GestureGrid
          activeGestureId={activeGestureId}
          gestures={gestures}
          handleGestureSelect={handleGestureSelect}
          startRecording={startRecording}
          deleteRecording={deleteRecording}
        />
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center justify-between" style={{ width: '50%', height: '50%' }}>
            <p className="text-lg font-medium text-center">
              <strong>Instructions:</strong> When the prompt for you to gesture shows up, perform the gesture as you would.
            </p>
            <p className="text-lg font-medium">
              {isRecording ? `Recording ends in: ${countdown} seconds` : "Recording..."}
            </p>
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
