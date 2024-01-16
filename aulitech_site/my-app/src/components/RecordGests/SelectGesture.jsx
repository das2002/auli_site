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

  const uploadFileToFirebase = async (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, 'path/to/your/file/' + file.name); 

    try {
      await uploadBytes(storageRef, file);
      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  
  const handleFileUpload = (file) => {
    uploadFileToFirebase(file);
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

const SelectGesture = ({ user }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedGesture, setSelectedGesture] = useState(null);
  const [recordingStart, setRecordingStart] = useState(null);

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
    getGestStats();
  }, []);


  const handleGestureSelect = (gestureId) => {
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

  const startRecording = (gesture) => {
    setGestureData([]);

    setSelectedGesture(gesture);
    setRecordingStart(new Date());
    setShowPopup(true);
    setIsRecording(true);

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
      const gestureDataString = JSON.stringify(gestureData);
  
      try {
        const gestureDataRef = collection(db, "gesture-data");
        const recordingData = {
          useruid: user.uid,
          gesture: selectedGesture.name,
          timestamp,
          duration,
          gestureData,
          log: gestureDataString 
        };
        const docRef = await addDoc(gestureDataRef, recordingData);

        setGestures(currentGestures => {
          return currentGestures.map(gesture => {
            if (gesture.name === selectedGesture.name) {
              const newRecording = {
                timestamp: timestamp.toLocaleString(),
                docId: docRef.id
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center justify-between" style={{ width: '50%', height: '50%' }}>
            <p className="text-lg font-medium text-center">
              <strong>Instructions:</strong> When the prompt for you to gesture shows up, perform the gesture as you would.
            </p>
            <p className="text-lg font-medium">
              {isRecording ? `Recording ends in: ${countdown} seconds` : "Recording..."}
            </p> 
            <button className="rounded-md bg-red-500 p-3 text-white hover:bg-red-700" 
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

