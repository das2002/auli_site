

import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, NavLink } from "react-router-dom";
import AccordianElement from "./Accordian";
import Logo from "../Elements/Logo"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterInterface from './RegisterInterface';


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

  const UserSettingsRoute = () => {
    return (
      <>
        <div className="-mx-6">
          <NavLink
            to="/user-settings"
            className={({ isActive }) =>
              classNames(
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800",
                "group flex gap-x-4 px-6 py-3 text-lg leading-6 font-semibold"
              )
            }
          >
            {/* icon here*/}
            <p>User Settings</p>
          </NavLink>
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

  const DevicesRoute = () => {
    return (
      <>
        <div className="-mx-6">
          <NavLink
            to="/devices" //updates
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6l8 4v8l-8 4-8-4V10l8-4z"></path>
            </svg>
            <p>Devices</p>
          </NavLink>
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
  

  const RegisterNewRoute = () => {
    return (
      <div className="-mx-6">
        <NavLink
          to="/register-cato-device"
          className={({ isActive }) =>
            classNames(
              isActive
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800",
              "group flex gap-x-4 px-6 py-3 text-lg leading-6 font-semibold"
            )
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12m6-6H6"
            />
          </svg>

          <p>Register Device</p>
          
          </NavLink>
      </div>
    );
  };

  const RegisterInterfaceRoute = () => {
    return (
      <div className="-mx-6">
        <NavLink
          to="/register-interface"
          className={({ isActive }) =>
            classNames(
              isActive
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800",
              "group flex gap-x-4 px-6 py-3 text-lg leading-6 font-semibold"
            )
          }
        >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m6-6H6" // Plus icon
              />
            </svg>
            <p>Register Interface</p>
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

  const DashRoute = () => {
    return (
      <>
        <div className="-mx-6 ">
          <NavLink
            to="/"
            className={({ isActive }) =>
              classNames(
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800",
                "group flex gap-x-4 px-6 py-3 text-xl leading-6 font-semibold"
              )
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>

            <p>Dashboard</p>
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
                        <DashRoute />
                        <UpdatesRoute />
                        <DevicesRoute />
                        <PracticeRoute />
                        <UpdateRoute/>
                        <RecordGesturesRoute />
                        {/* We need to add a line to divide between these sections */}
                        
                        <RegisterNewRoute />
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
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
        <Logo height={16} marginY={5} marginX={10}/>
        <nav className="flex flex-1 flex-col">
            <div role="list" className="flex flex-1 flex-col gap-y-7">
                <DashRoute />
                <DevicesRoute />
                <PracticeRoute />
                <UpdateRoute/>
                <RecordGesturesRoute />
                {/* We need to add a line to divide between these sections */}
                <div className="border-t border-gray-700"></div>
                <RegisterNewRoute />
                <RegisterInterfaceRoute /> 
                <ProfileRoute />
            </div>
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

