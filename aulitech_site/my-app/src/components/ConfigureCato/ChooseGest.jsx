import React, {useState} from "react";

const ChooseGest = () => {
  const [nextStepDisabled, setNextStepDisabled] = useState(false);

  const gestures = [
    { id: 0, name: "Select" },
    { id: 1, name: "Nod up" },
    { id: 2, name: "Nod down" },
    { id: 3, name: "Nod right" },
    { id: 4, name: "Nod left" },
    { id: 5, name: "Tilt right" },
    { id: 6, name: "Tilt left" },
    { id: 7, name: "Shake vertical" },
    { id: 8, name: "Shake horizontal" },
    { id: 9, name: "Circle clockwise" },
    { id: 10, name: "Circle counterclockwise" },
  ];

  return (
    <div >
      <div className="border-b border-gray-200 pb-5">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Select Gesture
        </h3>
      </div>
      <ul
        role="list"
        className="px-4 py-5 sm:p-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {gestures.map((gest) => (
          <li
            key={gest.name}
            className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
          >
            <div className="flex w-full items-center justify-between space-x-6 p-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="truncate text-sm font-medium text-gray-900">
                    {gest.name}
                  </h3>
                </div>
                <p className="mt-1 truncate text-sm text-gray-500"></p>
              </div>
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="flex w-0 flex-1">
                  {/* <p
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  {gest.count} / 5
                </p> */}
                </div>
                <div className="-ml-px flex w-0 flex-1">
                  {/* <p
                  className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  
                </p> */}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChooseGest;
