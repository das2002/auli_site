import React, { useState, useEffect, Fragment } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Listbox, Transition } from "@headlessui/react";
import { styles } from "./ConfigureGestures";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from '@heroicons/react/20/solid';
import { PlusCircleIcon } from '@heroicons/react/20/solid';

import {
  collection,
  query,
  where,
  getDocs,
  limit,
  getCountFromServer,
  addDoc,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "../../firebase";

const gestures = [
  { id: 1, name: "Nod up", count: 0 },
  { id: 2, name: "Nod down", count: 0 },
  { id: 3, name: "Nod right", count: 0 },
  { id: 4, name: "Nod left", count: 0 },
  { id: 5, name: "Tilt right", count: 0 },
  { id: 6, name: "Tilt left", count: 0 },
  { id: 7, name: "Shake vertical", count: 0 },
  { id: 8, name: "Shake horizontal", count: 0 },
  { id: 9, name: "Circle clockwise", count: 0 },
  { id: 10, name: "Circle counterclockwise", count: 0 },
];

const SelectGesture = ({ user }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedGesture, setSelectedGesture] = useState(null);
  const [recordingStart, setRecordingStart] = useState(null);

  useEffect(() => {
    getGestStats();
  }, []);

  // const shareGesture = (e) => {
  //   setSelected(e);
  //   setGestName(e.name);
  //   handleGestName(e.name);
  // };

  const startRecording = (gesture) => { 
    setSelectedGesture(gesture);
    setRecordingStart(new Date());
    setShowPopup(true);
  };
  
  const stopRecording = async () => {
    const duration = new Date() - recordingStart;
    setShowPopup(false);

    if (selectedGesture) {
      try {
        const gestureDataRef = collection(db, "gesture-data");
        const recordingData = { useruid: user.uid, gesture: selectedGesture.name, timestamp: new Date(), duration };
        await addDoc(gestureDataRef, recordingData);
        updateGestureCount(selectedGesture.name);
        console.log("Recording saved for gesture:", selectedGesture.name);
      } catch (error) {
        console.error("Error saving recording data:", error);
      }
    }
  };

  const getGestStats = async () => {
    const dataRef = collection(db, "gesture-data");
    const userDataQuery = query(dataRef, where("useruid", "==", user.uid));
    const snapshot = await getDocs(userDataQuery);

    snapshot.forEach((doc) => {
      const gestureName = doc.data().gesture;
      const gestureIndex = gestures.findIndex(g => g.name === gestureName);
      if (gestureIndex !== -1) {
        gestures[gestureIndex].count += 1;
      }
    });
  };

  // const getGestStats = async () => {
  //   try {
  //     const dataRef = collection(db, "gesture-data");
  //     const userDataQuery = query(dataRef, where("useruid", "==", user.uid));
  //     const countSnapshot = await getCountFromServer(userDataQuery);
  
  //     if (countSnapshot.data().count !== 0) {
  //       const queryTest = query(
  //         dataRef,
  //         where("useruid", "==", user.uid),
  //         limit(countSnapshot.data().count)
  //       );
  //       const getTest = await getDocs(queryTest);
  
  //       if (getTest !== null) {
  //         getTest.forEach((doc) => {
  //           const gestureName = doc.data().gesture; // Replace 'gest' with 'gesture' if that's the field name in Firestore
  //           const gestureIndex = gestures.findIndex(g => g.name === gestureName);
  //           if (gestureIndex !== -1) {
  //             gestures[gestureIndex].count += 1;
  //           }
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error querying gesture-data collection:", error);
  //   }
  // };
  
  
  // const getGestStats = async () => {
  //   try {
  //     const dataRef = collection(db, "gesture-data");

  //     const userDataQuery = query(dataRef, where("useruid", "==", user.uid));
  //     const countSnapshot = await getCountFromServer(userDataQuery);

  //     if (countSnapshot.data().count !== 0) {
  //       console.log("Count > 0");
  //       const queryTest = query(
  //         dataRef,
  //         where("useruid", "==", user.uid),
  //         limit(countSnapshot.data().count)
  //       );
  //       const getTest = await getDocs(queryTest);

  //       if (getTest !== null) {
  //         getTest.forEach((doc) => {
  //           switch (doc.data().gest) {
  //             case "Select":
  //               return null;
  //             case "Nod up":
  //               gestures[1].count += 1;
  //               break;
  //             case "Nod down":
  //               gestures[2].count += 1;
  //               break;
  //             case "Nod right":
  //               gestures[3].count += 1;
  //               break;
  //             case "Nod left":
  //               gestures[4].count += 1;
  //               break;
  //             case "Tilt right":
  //               gestures[5].count += 1;
  //               break;
  //             case "Tilt left":
  //               gestures[6].count += 1;
  //               break;
  //             case "Shake vertical":
  //               gestures[7].count += 1;
  //               break;
  //             case "Shake horizontal":
  //               gestures[8].count += 1;
  //               break;
  //             case "Circle clockwise":
  //               gestures[9].count += 1;
  //               break;
  //             case "Circle counterclockwise":
  //               gestures[10].count += 1;
  //               break;
  //             default:
  //               console.log("switch error");
  //           }
  //         });
  //       } else {
  //         console.log(getTest);
  //       }
  //     }
  //   } catch (error) {
  //     console.log("guery gesture-data collection error:", error);
  //   }
  // };

  const GestureGrid = () => {
    getGestStats();

    return (
      <div className="mt-4 mx-auto max-w-2xl">
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          {gestures.map((gesture) => ( // Ensure 'gesture' is used here
            <div
              key={gesture.id}
              className="relative flex flex-col items-center rounded-lg border border-gray-200 bg-gray-200 p-4 shadow-sm focus:outline-none"
            >
              <span className="block text-lg font-medium text-gray-900">
                {gesture.name}
              </span>
              {/* recordings list */}
              <div className="mt-2 flex-1 w-full">
                  {/* recordings list */}
              </div>
              <div className="mt-4 w-full flex items-center justify-between px-2">
                {/* record button */}
                <button 
                  className="rounded-md p-1 cursor-pointer transition-colors duration-150 ease-in-out"
                  style={{ backgroundColor: 'rgba(219, 71, 71, 0.5)' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(201, 67, 67, 0.7)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(219, 71, 71, 0.5)'}
                  onClick={() => startRecording(gesture)} // Pass 'gesture' to the function
                >
                  <svg className="h-8 w-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" fill="#F00B0B" />
                  </svg>
                </button>
  
                <div className="flex-grow bg-white p-4 mx-2 rounded shadow flex items-center h-24">
                  {/* recording names here */}
                </div>
                <button className="rounded-md bg-gray-300 p-2 text-gray-700 hover:bg-gray-500 cursor-pointer">
                  <TrashIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const updateGestureCount = async (gestureName) => {
    // Implement logic to update the gesture count in Firestore
    // This is a placeholder function
  };

  return (
    <div className="">
      <div className="border-b border-gray-200 pb-10">
        <GestureGrid />
      </div>
      <div>
        {/* <button
          type="button"
          disabled={gestName === ""}
          onClick={goToRecordPage}
          className={classNames(
            gestName === ""
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-300",
            " focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
            "mt-10 inline-flex items-center rounded-full px-2.5 py-1 text-xl font-semibold text-white shadow-sm"
          )}
        >
          Select
        </button> */}
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
