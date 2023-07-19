import React, { useState } from "react";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const FormatJson = ({ classNames, devices, curr }) => {
  const FormatValuesValueObj = () => {
    try {
    } catch (error) {
      console.log("format device, value, value error: ", error);
    }
  };

  const DisplayInfo = () => {
    try {
      console.log(devices[0].keysinfo);
      console.log(devices[0].valuesinfo);

      return (
        <>
          {/* {devices.forEach((device) => (
            device.map((val, index) => (
            <div key={index}>
              val
            </div>
          ))))} */}
          {devices[curr].valuesinfo.map((item) => (
            <div key={item.label} className="p-5">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                {item.label}
              </h2>
              <p className="p-2.5 text-sm leading-6 text-gray-600">
                {item.description}
              </p>
              <div className="p-2.5">
                {item.access === "rw" ? (
                  <>
                    {item.options === undefined ? (
                      <>
                        {Object.keys(item.value) < 1 || typeof(item.value) === "string" ? (
                          <>
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 sm:max-w-md">
                            <input
                              type="text"
                              name={`${item.name}`}
                              id={`${item.name}`}
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                              placeholder={item.name}
                            />
                          </div>
                          </>
                        ) : (
                          <>
                            <FormatValuesValueObj val={item.value} />
                          </>
                        )}
                        {/* <div className="mt-2">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 sm:max-w-md">
                          <input
                            type="text"
                            name={`${item.name}`}
                            id={`${item.name}`}
                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder={item.value}
                          />
                        </div>
                      </div> */}
                      </>
                    ) : (
                      <>
                        <label
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Current option: {item.value}
                        </label>
                        {item.options.map((option, index) => (
                          <button
                            key={option}
                            className="py-2 px-4 mr-2 rounded-md shadow-sm ring-1 ring-inset ring-gray-300"
                          >
                            {option}
                          </button>
                        ))}
                      </>
                    )}
                  </>
                ) : (
                  <p>(Read only vaue).</p>
                )}
              </div>
            </div>
          ))}
        </>
      );
    } catch (error) {
      console.log("display err: ", error);
    }
  };

  return (
    <>
      <div className="divide-y divide-gray-200">
        <DisplayInfo />
      </div>
    </>
  );
};

export default FormatJson;








  /* <Menu as="div" className="relative inline-block text-left">
// <div>
//   <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
//     Options
//     <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
//   </Menu.Button>
// </div>

<Transition
  as={Fragment}
  enter="transition ease-out duration-100"
  enterFrom="transform opacity-0 scale-95"
  enterTo="transform opacity-100 scale-100"
  leave="transition ease-in duration-75"
  leaveFrom="transform opacity-100 scale-100"
  leaveTo="transform opacity-0 scale-95"
>
  <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
    <div className="py-1">
      <Menu.Item>
        {({ active }) => (
          <a
            href="#"
            className={classNames(
              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
              'block px-4 py-2 text-sm'
            )}
          >
            Account settings
          </a>
        )}
      </Menu.Item>
      <Menu.Item>
        {({ active }) => (
          <a
            href="#"
            className={classNames(
              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
              'block px-4 py-2 text-sm'
            )}
          >
            Support
          </a>
        )}
      </Menu.Item>
      <Menu.Item>
        {({ active }) => (
          <a
            href="#"
            className={classNames(
              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
              'block px-4 py-2 text-sm'
            )}
          >
            License
          </a>
        )}
      </Menu.Item>
      <form method="POST" action="#">
        <Menu.Item>
          {({ active }) => (
            <button
              type="submit"
              className={classNames(
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'block w-full px-4 py-2 text-left text-sm'
              )}
            >
              Sign out
            </button>
          )}
        </Menu.Item>
      </form>
    </div>
  </Menu.Items>
</Transition>
</Menu> */

