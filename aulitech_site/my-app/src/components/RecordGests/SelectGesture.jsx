import React, { useState, Fragment } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Listbox, Transition } from "@headlessui/react";
import { styles } from "./ConfigureGestures";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
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
      <RadioGroup value={selected} onChange={shareGesture}>
        <RadioGroup.Label className="text-lg font-semibold leading-6 text-gray-900">
          Select Gesture
        </RadioGroup.Label>

        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
          {gestures.map((gest) => (
            <RadioGroup.Option
              key={gest.id}
              value={gest}
              className={({ active }) =>
                classNames(
                  active
                    ? "border-blue-500 ring-2 ring-blue-500"
                    : "border-gray-200",
                  "relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none hover:border-blue-300 hover:ring-blue-300 hover:ring-1 hover:ring-inset"
                )
              }
            >
              {({ checked, active }) => (
                <>
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <RadioGroup.Label
                        as="span"
                        className="block text-lg font-medium text-gray-900"
                      >
                        {gest.name}
                      </RadioGroup.Label>
                      {/* <RadioGroup.Description as="span" className="mt-1 flex items-center text-sm text-gray-500">
                      {gest.count}
                    </RadioGroup.Description> */}
                      <RadioGroup.Description
                        as="span"
                        className="mt-6 text-sm font-medium text-gray-900"
                      >
                        {gest.count} / 5
                      </RadioGroup.Description>
                    </span>
                  </span>
                  <CheckCircleIcon
                    className={classNames(
                      !checked ? "invisible" : "",
                      "h-6 w-6 text-blue-500"
                    )}
                    aria-hidden="true"
                  />
                  <span
                    className={classNames(
                      active ? "border" : "border-2",
                      checked ? "border-blue-500" : "border-transparent",
                      "pointer-events-none absolute -inset-px rounded-lg"
                    )}
                    aria-hidden="true"
                  />
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    );
  };

  return (
    <div className="">
      <div className="border-b border-gray-200 pb-10">
        <GestureGrid />
      </div>
      <div>
        <button
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
        </button>
      </div>
    </div>
  );
};

export default SelectGesture;
