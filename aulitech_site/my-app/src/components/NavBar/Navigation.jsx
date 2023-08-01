import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, NavLink } from "react-router-dom";
import { Accordion, AccordionItem as Item } from "@szhsin/react-accordion";

export default function Navigation({
  user,
  currIndex,
  classNames,
  devices,
  handleCurr,
  handleDevices,
}) {
  const AccordionItem = ({ header, ...rest }) => (
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
          `flex w-full p-4 text-left hover:bg-transparent ${
            isEnter && "bg-transparent"
          }`,
      }}
      contentProps={{
        className: "transition-height duration-200 ease-out",
      }}
      panelProps={{ className: "p-4" }}
    />
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const Logo = () => {
    return (
      <img
        className="h-8 w-auto"
        src={require("../../images/icononly_transparent_nobuffer.png")}
        alt="Auli logo"
      />
    );
  };

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
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center">
                      <Logo />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <div role="list" className="flex flex-1 flex-col gap-y-7">
                        <div>
                          <div role="list" className="-mx-2 space-y-1">
                            {devices.map((device, index) => (
                              <div key={`${device.id}mobile`}>
                                <button
                                  onClick={() => handleCurr(device, index)}
                                  onKeyDown={() => {}}
                                  className={classNames(
                                    device.current
                                      ? "bg-gray-800 text-white"
                                      : "text-gray-400 hover:text-white hover:bg-gray-800",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  {device.data.devicename}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/*                         <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {/* <NavLink
                              to="/"
                              className={({ isActive }) =>
                                classNames(
                                  isActive
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                )
                              }
                            >
                              <li>
                                <p>Dashboard</p>
                              </li>
                            </NavLink>
                            <NavLink
                              to="/configure-cato"
                              className={({ isActive }) =>
                                classNames(
                                  isActive
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                )
                              }
                            >
                              <li>Record Gestures</li>
                            </NavLink>

                            <NavLink
                              to="/configure-cato"
                              className={({ isActive }) =>
                                classNames(
                                  isActive
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                )
                              }
                            >
                              <li>Cato Settings</li>
                            </NavLink> 
                          </ul>
                        </li> */}
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
            <div className="flex h-16 shrink-0 items-center">
              <Logo />
            </div>

            <nav className="flex flex-1 flex-col">
              <div role="list" className="flex flex-1 flex-col gap-y-7">
                <div>
                  <div className="ml-1 -mx-6 mt-auto">
                    <div>
                      <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                          classNames(
                            isActive
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-800",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )
                        }
                      >
                        {/* <svg
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
                        </svg> */}

                        <p>Dashboard</p>
                      </NavLink>
                    </div>
                  </div>
                  <Accordion transition transitionTimeout={200}>

                  {devices.map((device, index) => (
                        <AccordionItem
                          header={device.data.devicename}
                          itemKey={device.data.devicename}
                          className="text-white mt-5 mb-5"
                        >
                            <div>
                              <div>
                                <NavLink
                                  key={"record"}
                                  to={device.data.devicename === "liv 3" ? "/dashboard" : "/record-gestures"}
                                  className={({ isActive }) =>
                                    classNames(
                                      isActive
                                        ? "text-white"
                                        : "text-gray-400 hover:text-white hover:bg-gray-800",
                                      "group flex p-2 text-sm leading-6 font-semibold border-none"
                                    )
                                  }
                                >
                                  <p>Record Gestures</p>
                                </NavLink>
                              </div>
                              <div>
                                <NavLink
                                  key={"settings"}
                                  to="/cato-settings"
                                  className={({ isActive }) =>
                                    classNames(
                                      isActive
                                        ? "text-white"
                                        : "text-gray-400 hover:text-white hover:bg-gray-800",
                                      "group flex p-2 text-sm leading-6 font-semibold border-none"
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
                  <div className="-mx-6 mt-auto">
                  <NavLink
                    to="/register-cato-device"
                    className={({ isActive }) =>
                      classNames(
                        isActive
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:text-white hover:bg-gray-800",
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
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

                    <p>Register new device</p>
                  </NavLink>
                  </div>

                </div>


                <div className="-mx-6 mt-auto">
                 
                  <Link
                    to="/profile"
                    className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                  >
                    <UserIcon />
                    <span className="sr-only">Your profile</span>
                    <span aria-hidden="true">
                      {user !== null ? user.email : null}
                    </span>
                  </Link>
                </div>
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
          <div className="flex-1 text-sm font-semibold leading-6 text-white">
            Dashboard
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
