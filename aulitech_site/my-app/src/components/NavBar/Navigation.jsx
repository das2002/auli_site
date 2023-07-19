import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, NavLink } from "react-router-dom";

export default function Navigation({
  user,
  classNames,
  devices,
  handleCurr,
  handleDevices,
}) {
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

  // useEffect(() => {
  //   let configData = [];

  //   const getUserConfigs = async () => {
  //     const useruid = await get('useruid');
  //     try {
  //       const colRef = collection(db, "users");
  //       const queryCol = query(collection(colRef, user.uid, "userCatos"));

  //       const colSnap = await getDocs(queryCol);
  //       colSnap.forEach((doc) => {
  //         configData.push({
  //           id: doc.id,
  //           catoname: doc.data().devicename,
  //           data: doc.data(),
  //           keysinfo: Object.keys(JSON.parse(doc.data().configjson)),
  //           valuesinfo: Object.values(JSON.parse(doc.data().configjson)),
  //           current: false,
  //         });
  //       });
  //     } catch (error) {
  //       console.log("get user cato configs error: ", error);
  //     }
  //   };

  //   return () => {
  //     getUserConfigs();
  //     setDevices(configData);
  //     set('devicesHandle', configData);
  //   };
  // }, []);

  // const handleDeviceNav = (index) => {
  //   //handleCurr(deviceId);
  //   console.log(index);
  //   devices.forEach((device, i) => {
  //     if (index === i) {
  //       console.log(device);
  //     } else {
  //       devices[i].current = false;
  //     }
  //   });
  // };

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
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {devices.map((device, index) => (
                              <li key={device.id}>
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
                              </li>
                            ))}
                          </ul>
                        </li>

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
                      </ul>
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
              <div className="text-xs font-semibold leading-6 text-gray-400">
                My Catos
              </div>
              <div role="list" className="flex flex-1 flex-col gap-y-7">
                <div>
                  <div role="list" className="-mx-2 space-y-1">
                    {devices.map((device, index) => (
                        <button
                         key={device.id}
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
                    ))}

                    {/* {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                          {item.name}
                        </a>
                      </li>
                    ))} */}
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
