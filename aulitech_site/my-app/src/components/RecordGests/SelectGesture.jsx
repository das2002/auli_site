import React, { useState, Fragment } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Listbox, Transition } from "@headlessui/react";
import { styles } from "./ConfigureGestures";
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

const SelectGesture = ({ classNames, handleGestName, user }) => {
  const [gestureNum, setGestureNum] = useState(0);
  const [selected, setSelected] = useState(gestures[0]);

  const shareGesture = (e) => {
    setSelected(e);
    setGestureNum(e.id);
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
      <div
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {gestures.map((gest) => (
          <button
            key={gest.id}
            id={gest.id}
            value={gest}
            onClick={shareGesture}
            className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow hover:ring hover:ring-inset"
          >
            <div className="flex w-full items-center justify-between space-x-6 p-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="truncate text-large font-medium text-gray-900">
                    {gest.name}
                  </h3>
                </div>
                <p className="mt-1 truncate text-large text-gray-500">{gest.count} / 5</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <GestureGrid />
    </>
  );

  // return (
  //   <div>
  //     <div className="border-b border-gray-200 pb-5">
  //       <h3 className="text-base font-semibold leading-6 text-gray-900">
  //         Device Access
  //       </h3>
  //     </div>
  //       <div className="mt-2 max-w-xl text-sm text-gray-500">
  //         <p>
  //           Select gesture that you would like to record.
  //         </p>
  //       </div>
  //       <div className="mt-5">
  //         <Listbox value={selected} onChange={shareGesture}>
  //         {({ open }) => (
  //           <>
  //             <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Gestures</Listbox.Label>
  //             <div className="relative mt-2">
  //               <Listbox.Button className="relative w-2/4 cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 sm:text-sm sm:leading-6">
  //                 <span className="block truncate">{selected.name}</span>
  //                 <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
  //                   <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
  //                 </span>
  //               </Listbox.Button>

  //               <Transition
  //                 show={open}
  //                 as={Fragment}
  //                 leave="transition ease-in duration-100"
  //                 leaveFrom="opacity-100"
  //                 leaveTo="opacity-0"
  //               >
  //                 <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
  //                   {gestures.map((gesture) => (
  //                     <Listbox.Option
  //                       key={gesture.id}
  //                       className={({ active }) =>
  //                         classNames(
  //                           active ? 'bg-gray-100 text-blue-500' : 'text-gray-900',
  //                           'relative cursor-default select-none py-2 pl-3 pr-9'
  //                         )
  //                       }
  //                       value={gesture}
  //                     >
  //                       {({ selected, active }) => (
  //                         <>
  //                           <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}> {gesture.name} </span>

  //                           {selected ? (
  //                             <span
  //                               className={classNames(
  //                                 active ? 'text-blue-500' : 'text-blue-300',
  //                                 'absolute inset-y-0 right-0 flex items-center pr-4'
  //                               )}
  //                             >
  //                               <CheckIcon className="h-5 w-5 text-blue-500" aria-hidden="true" />
  //                             </span>
  //                           ) : null}
  //                         </>
  //                       )}
  //                     </Listbox.Option>
  //                   ))}
  //                 </Listbox.Options>
  //               </Transition>
  //             </div>
  //           </>
  //         )}
  //       </Listbox>
  //     </div>
  // </div>
  // )
};

export default SelectGesture;
