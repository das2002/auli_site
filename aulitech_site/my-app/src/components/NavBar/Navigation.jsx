

import React, { Fragment, useState, useEffect} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, NavLink, useNavigate } from "react-router-dom";
import AccordianElement from "./Accordian";
import Logo from "../Elements/Logo"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterInterface from './RegisterInterface';
import { collection, query, where, getDocs, setDoc, addDoc, getFirestore, doc } from 'firebase/firestore';

<Router>
  <Routes>
    <Route path="/register-interface" element={<RegisterInterface />} />
  </Routes>
</Router>


const Navigation = ({
  user,
  currIndex,
  classNames,
  devices,
  handleCurr
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const UserIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    );
  };

  const ProfileRoute = () => {
    return (
      <>
        <div className="-mx-6 mt-auto">
          <Link
            to="/profile"
            className="flex items-center gap-x-4 px-6 py-3 text-lg font-semibold leading-6 text-white hover:bg-gray-800"
          >
            <UserIcon />
            <span className="sr-only">Your profile</span>
            <span aria-hidden="true">{user !== null ? user.email : null}</span>
          </Link>
        </div>
      </>
    );
  };

  const RecordGesturesRoute = () => {
    return (
      <>
        <div className="-mx-6">
          <NavLink
            to="/record-gestures"
            className={({ isActive }) =>
              classNames(
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800",
                "group flex gap-x-4 px-6 py-3 text-lg leading-6 font-semibold"
              )
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
              <circle cx="12" cy="12" r="8" stroke-width="2" />
              <circle cx="12" cy="12" r="4" fill="currentColor" />
              <rect x="2" y="2" width="20" height="20" rx="10" stroke-width="2" />
            </svg>
            <p>Record Gestures</p>
          </NavLink>
        </div>
      </>
    );
  };

  const UpdateRoute = () => {
    return (
      <>
        <div className="-mx-6">
          <NavLink
            to="/updates"
            className={({ isActive }) =>
              classNames(
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800",
                "group flex gap-x-4 px-6 py-3 text-lg leading-6 font-semibold"
              )
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p>Updates</p>
          </NavLink>
        </div>
      </>
    );
  };

  const [isDevicesMenuOpen, setIsDevicesMenuOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const toggleDevicesMenu = () => {
    setIsDevicesMenuOpen(!isDevicesMenuOpen);
  };
  
  const selectDevice = (deviceName) => {
    setSelectedDevice(deviceName);
  };
  
  const DevicesList = () => {
    const navigate = useNavigate();

    const handleClick = (deviceName) => {
      navigate(`/devices/${deviceName}`);
    };


    const totalDuration = 350; // Total duration for all items to appear
    const itemDuration = totalDuration / (devices.length + 1); // Duration per item, +1 for NavLink
  
    return (
      <div className="absolute w-56 mt-0 space-y-1 overflow-hidden cursor-pointer">
        {devices.map((device, index) => (
          <div 
            key={index}
            onClick={() => handleClick(device.data.device_info.device_nickname)}
            className="flex items-center justify-center px-6 py-3 text-lg font-semibold rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer opacity-0"
            style={{ 
              animation: `fadeIn 100ms ease-out forwards ${index * itemDuration}ms`
            }}
          >
            {device.data.device_info.device_nickname}
          </div>
        ))}
  
        <NavLink
          to="/register-cato-device"
          className="flex items-center justify-center px-6 py-3 text-lg font-semibold rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer opacity-0"
          style={{ 
            animation: `fadeIn 100ms ease-out forwards ${devices.length * itemDuration}ms`
          }}
        >
          <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m6-6H6"
              />
            </svg>
        </NavLink>
      </div>
    );
  };

            
  const DevicesRoute = () => {
    return (
      <>
        <div className="-mx-6 transition-transform duration-50 select-none">
          <div
            className="group flex items-center transition-all duration-200 overflow-x-hidden gap-x-4 px-6 py-3 text-lg leading-6 font-semibold text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={toggleDevicesMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                     className={"w-6 h-6 transition-transform duration-300 transform " + (isDevicesMenuOpen ? "rotate-90" : "")}>
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            Devices
          </div>
          {/* {console.log(devices[0].data.device_info.device_nickname)} */}
          {isDevicesMenuOpen && (
            <div className="pl-8 pt-2 space-y-2">
              <DevicesList/>
            </div>
          )}
        </div>
      </>
    );
  };

  const UpdatesRoute = () => {
    return (
      <div className="-mx-6">
        <NavLink
          to="/updates"
          className={({ isActive }) =>
            classNames(
              isActive
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800",
              "group flex gap-x-4 px-6 py-3 text-lg leading-6 font-semibold"
            )
          }
        >
          {/* Icon here (optional) */}
          <p>Updates</p>
        </NavLink>
      </div>
    );
  };

  const PracticeRoute = () => {
    return (
      <>
        <div className="-mx-6">
          <NavLink
            to="/practice"
            className={({ isActive }) =>
              classNames(
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800",
                "group flex gap-x-4 px-6 py-3 text-lg leading-6 font-semibold"
              )
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2C6.48 2 2 6.48 2 12c0 3.866 2.964 7.017 6.75 7.017 1.657 0 3.22-.61 4.406-1.717l3.844 3.844a.6.6 0 00.848 0l1.5-1.5a.6.6 0 000-.848l-3.844-3.844A7.963 7.963 0 0019.017 12C19.017 6.48 14.537 2 9.017 2zm0 4a4 4 0 100 8 4 4 0 000-8z"></path>
            </svg>

            <p>Practice Mode</p>
          </NavLink>
        </div>
      </>
    );
  };
  
  // -----------------------------------------------------------------------

  return (
    <>
      
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>

                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
                    <Logo height={16} marginY={5} marginX={10}/>
                    <nav className="flex flex-1 flex-col">
                      <div role="list" className="flex flex-1 flex-col gap-y-7">
                        {/* <DashRoute /> */}
                        <UpdatesRoute />
                        <DevicesRoute />
                        <PracticeRoute />
                        <UpdateRoute/>
                        <RecordGesturesRoute />
                        {/* We need to add a line to divide between these sections */}
                        
                        <ProfileRoute />
                      </div>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
    {/* Sidebar component, swap this element with another sidebar if you like */}
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 transition-all duration-500">
      <Logo height={16} marginY={5} marginX={10}/>
      <nav className="flex flex-1 flex-col gap-y-7">
        <div role="list" className="flex align-top flex-col gap-y-0">
          <DevicesRoute />
          
          {/* Extra space with transition */}
          
          <div className={`transition-all duration-300`} style={{ height: isDevicesMenuOpen ? (devices.length + 1) * 52 : 0 }}></div>

        </div>
        <div role="list" className="flex align-top flex-col gap-y-7">
          {/* Routes that will move */}
          <PracticeRoute />
          <UpdateRoute/>
          <RecordGesturesRoute />
        </div>
        <ProfileRoute />
      </nav>
    </div>


</div>


        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm items-center font-semibold leading-6 text-white">
            <Logo height={8} marginY={0} marginX={0}/>
          </div>
          <Link to="/profile">
            <span className="sr-only">Your profile</span>
            <UserIcon />
          </Link>
        </div>
      </div>
    </>
  );
}

export default Navigation;

