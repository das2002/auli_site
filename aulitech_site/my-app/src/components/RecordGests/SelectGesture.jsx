import React, { useState, Fragment } from "react";
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

const SelectGesture = ({
  classNames,
  handleGestName,
  user,
  goToRecordPage,
}) => {
  const [gestName, setGestName] = useState("");
  const [selected, setSelected] = useState();

  const shareGesture = (e) => {
    setSelected(e);
    setGestName(e.name);
    handleGestName(e.name);
  };

  const getGestStats = async () => {
    try {
      const dataRef = collection(db, "gesture-data");

      const userDataQuery = query(dataRef, where("useruid", "==", user.uid));
      const countSnapshot = await getCountFromServer(userDataQuery);

      if (countSnapshot.data().count !== 0) {
        console.log("Count > 0");
        const queryTest = query(
          dataRef,
          where("useruid", "==", user.uid),
          limit(countSnapshot.data().count)
        );
        const getTest = await getDocs(queryTest);

        if (getTest !== null) {
          getTest.forEach((doc) => {
            switch (doc.data().gesture) {
              case "Select":
                return null;
              case "Nod up":
                gestures[1].count += 1;
                break;
              case "Nod down":
                gestures[2].count += 1;
                break;
              case "Nod right":
                gestures[3].count += 1;
                break;
              case "Nod left":
                gestures[4].count += 1;
                break;
              case "Tilt right":
                gestures[5].count += 1;
                break;
              case "Tilt left":
                gestures[6].count += 1;
                break;
              case "Shake vertical":
                gestures[7].count += 1;
                break;
              case "Shake horizontal":
                gestures[8].count += 1;
                break;
              case "Circle clockwise":
                gestures[9].count += 1;
                break;
              case "Circle counterclockwise":
                gestures[10].count += 1;
                break;
              default:
                console.log("switch error");
            }
          });
        } else {
          console.log(getTest);
        }
      }
    } catch (error) {
      console.log("guery gesture-data collection error:", error);
    }
  };

  const GestureGrid = () => {
    getGestStats();

    return (
      <div className="mt-4 mx-auto max-w-2xl">
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          {gestures.map((gest) => (
            <div
              key={gest.id}
              className="relative flex flex-col items-center rounded-lg border border-gray-200 bg-gray-200 p-4 shadow-sm focus:outline-none"
            >
              <span className="block text-lg font-medium text-gray-900">
                {gest.name}
              </span>
              {/* Placeholder for the recordings list */}
              <div className="mt-2 flex-1 w-full">
                  {/* space for recordings list */}
              </div>
              <div className="mt-4 w-full flex items-center justify-between px-2">
                {/* Record button */}
                <button className="rounded-md p-1 cursor-pointer transition-colors duration-150 ease-in-out" 
                  style={{ backgroundColor: 'rgba(219, 71, 71, 0.5)' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(201, 67, 67, 0.7)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(219, 71, 71, 0.5)'}
                >
                  <svg className="h-8 w-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" fill="#F00B0B" />
                  </svg>
                </button>
  
                {/* Taller rectangular box for recording names */}
                <div className="flex-grow bg-white p-4 mx-2 rounded shadow flex items-center h-24">
                  {/* recording names here */}
                </div>
  
                {/* Trash button */}
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
    </div>
  );
};

export default SelectGesture;
