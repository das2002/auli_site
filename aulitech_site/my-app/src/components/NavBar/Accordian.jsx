import React, {useState} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, NavLink } from "react-router-dom";
import { Accordion, AccordionItem as Item } from "@szhsin/react-accordion";
import { initializeApp } from "firebase/app";


export default function AccordianElement({ devices, classNames, handleCurr, currIndex }) {
  const [thing, setThing] = useState(0);

  const devicePages = [
    {text: "Record Gestures", pageRoute: "/record-gestures"},
    {text: "Device Settings", pageRoute: "/cato-settings"}
  ]
  
  const AccordionItem = ({ header, ...rest }) => {
    return(
    <Item
      {...rest}
      header={({ state: { isEnter } }) => (
        <>
          {header}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            // className="w-6 h-6"
            className={`w-6 text-white h-6 ml-auto transition-transform duration-200 ease-out ${
              isEnter && "rotate-180"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </>
      )}
      className="text-white border-b"
      buttonProps={{
        className: ({ isEnter }) =>
          `flex w-full p-4 text-left text-lg hover:bg-transparent ${
            isEnter && "bg-transparent"
          }`,
      }}
      contentProps={{
        className: "transition-height duration-200 ease-out",
      }}
      panelProps={{ className: "p-4" }}
    />
  )}

  return (
    <>
      <Accordion 
      transition 
      transitionTimeout={200}
      onStateChange={({ itemKey, key, current }) => {
        if (current.isResolved)
          handleCurr(key, current.isEnter);
      }}
      >
        {devices.map((device, index) => (
          <AccordionItem
            header={device.data.devicename}
            itemKey={index}
            key={index}
            initialEntered={currIndex === index}
            className="text-white mt-5 mb-5"
          >
            <div>
              <div>
                <NavLink
                  to="/record-gestures"
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? "text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800",
                      "group flex p-2 text-lg leading-6 font-semibold border-none"
                    )
                  }
                >
                  <p>Record Gestures</p>
                </NavLink>
              </div>
              <div>
                <NavLink
                  to="/cato-settings"
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? "text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800",
                      "group flex p-2 text-lg leading-6 font-semibold border-none"
                    )
                  }
                >
                  <p>Device Settings</p>
                </NavLink>
              </div>
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
