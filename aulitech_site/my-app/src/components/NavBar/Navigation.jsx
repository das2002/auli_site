import React, { createContext, useContext, Fragment, useState, useEffect} from "react";
import ReactDOM from 'react-dom';
import { Dialog, Portal, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, NavLink } from "react-router-dom";
import Logo from "../Elements/Logo"
import SignOutAccount from "../GoogleAuth/SignOutAccount";
import { useNavigate, useRoutes, useLocation, BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import RegisterInterface from './RegisterInterface';
import PracticeModeToggle from "./PracticeModeToggle/PracticeModeToggle";
import Practice from "../PracticeMode/Practice";
import { overwriteConfigFile } from '../NavBar/ReplaceConfig';

// static nav buttons in navbar
const RecordGesturesRoute = () => {
  const { classNames } = useContext(AppContext);
  return (
    <div className="-mx-6 transition-all duration-300">
      <NavLink
        to="/record-gestures"
        className={({ isActive }) =>
          classNames(
            isActive
              ? "bg-gray-700 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-700",
            "group flex gap-x-4 px-6 py-3 text-lg leading-6 font-semibold"
          )
        }
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <circle cx="12" cy="12" r="8" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <rect x="2" y="2" width="20" height="20" rx="10" strokeWidth="2" />
        </svg>
        <p>Record Gestures</p>
      </NavLink>
    </div>
  );
};

const UpdateRoute = () => {
  const { classNames } = useContext(AppContext);
  return (
    <div className="-mx-6 transition-all duration-300">
      <NavLink
        to="/updates"
        className={({ isActive }) =>
          classNames(
            isActive
              ? "bg-gray-700 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-700",
            "group flex gap-x-4 px-6 py-3 text-lg leading-6 font-semibold"
          )
        }
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <p>Updates</p>
      </NavLink>
    </div>
  );
};


const UserIcon = () => {
  return (
    <div className="fixed">
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
    </div>
  );
};

// accordion menus 
const DevicesList = React.memo(() => {
  const { classNames, isDevicesMenuOpen, devices, savedConfig, isPracticeMode, setIsPracticeMode} = useContext(AppContext);

  const location = useLocation();
  const navigate = useNavigate();


  const [isPracticeModeToggleOn, setIsPracticeModeToggleOn] = useState(false);
  const [animate, setAnimate] = useState(false);


  const togglePracticeMode = async (index) => {
    const devicePath = devices[index].data.device_info.device_nickname;
  
    if (!window.location.pathname.includes('practice')) {
      // Navigate to the practice mode page for this device
      console.log("device -> practice", window.location.pathname)
      console.log("opractice", setIsPracticeMode)
      navigate(`/devices/${devicePath}/practice`);

    } else {
      // Navigate back to the device's main page
      console.log("practice -> device")
      if (isPracticeMode && JSON.stringify(savedConfig) !== '{}'){ // overwrite config 
        console.log(isPracticeMode, savedConfig)
        overwriteConfigFile(savedConfig);
      }
      
      navigate(`/devices/${devicePath}`);
    }
  
    setIsPracticeModeToggleOn(!isPracticeModeToggleOn);
  };
  
  useEffect(() => {
    if (isDevicesMenuOpen) {
      setAnimate(true);
    } else {
      setAnimate(false);
    }
  }, [isDevicesMenuOpen]);
  if (!isDevicesMenuOpen) return null;

  // Function to check if the NavLink is active
  const isNavLinkActive = (devicePath) => location.pathname.includes(`/devices/${devicePath}`);

  const totalDuration = 350; // Total duration for all items to appear
  const itemDuration = totalDuration / (devices.length + 1); // Duration per item, +1 for NavLink

  return (
    <>
      {devices.map((device, index) => {
        const devicePath = device.data.device_info.device_nickname;
        const isActive = isNavLinkActive(devicePath);

        return (
          <div 
            key={devicePath}
            className={`relative w-full mt-0 mr-12 space-y-1 align-center overflow-hidden cursor-pointer rounded-xl ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
          >
          <div className={`relative w-full mt-0 mr-12 space-y-1 align-center overflow-hidden cursor-pointer rounded-xl ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            <div className='flex flex-row w-full align-center '>
              <NavLink 
                key={index}
                to={`/devices/${devicePath}`}
                className={() =>
                  classNames(
                    isActive ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700",
                    "flex items-center w-full overflow-hidden align-center px-6 py-3 text-lg font-semibold rounded-xl cursor-pointer opacity-0"
                  )
                }
                style={{ 
                  animation: `fadeIn 100ms ease-out forwards ${index * itemDuration}ms`
                }}
              >
                {devicePath}
              </NavLink>
              {isActive && <PracticeModeToggle deviceName={devicePath} onToggle={() => togglePracticeMode(index)}/>} 
            </div>
          </div>
          </div>
        );
      })}

      {/* Register Cato Device NavLink */}
      <NavLink
        to="/register-cato-device"
        className={({ isActive }) =>
          classNames(
            isActive
              ? "bg-gray-800 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-800",
            "flex items-center justify-center px-6 py-3 text-lg font-semibold rounded-xl cursor-pointer opacity-0"
          )
        }
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

    </>
  );
});
const DevicesRoute = () => {
  const {toggleDevicesMenu, isDevicesMenuOpen } = useContext(AppContext);

  return (
    <>
      <div className="-mx-6 relative transition-transform duration-50 select-none mt-36">
        <div
          className="group flex items-center transition-all duration-200 overflow-x-hidden gap-x-4 px-6 py-3 text-lg leading-6 font-semibold text-gray-400 hover:text-white hover:bg-gray-800"
          onClick={toggleDevicesMenu}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                   className={"w-6 h-6 transition-transform duration-300 transform " + (isDevicesMenuOpen ? "rotate-90" : "")}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
          Devices
        </div>
        {/* {console.log(devices[0].data.device_info.device_nickname)} */}
        <div className="pl-8 pt-2 space-y-2">
          <DevicesList/>
        </div>
      </div>
    </>
  );
};

const SignOutModal = ({onCancel, onConfirm }) => {
  const {isSignOutModalOpen, toggleSignOutModal } = useContext(AppContext);
  if (!isSignOutModalOpen) return null;

  const Portal = ({ children }) => {
    return ReactDOM.createPortal(
      children,
      document.body // Append to body
    );
  };  
  return (
    <Portal>
      <div className="priority-backdrop">
        <div className="signout-modal rounded-full">
          <div className="flex items-start justify-between w-full px-3 py-3 border-b border-light-divider dark:border-dark-divider">
            <h3 className="text-base font-medium text-light-text-primary dark:text-dark-text-primary pl-3">Confirm Sign Out</h3>
          </div>
          
          <div className="signout-modal-content text-center leading-normal">
            <p className="text-base text-center pt-12">Are you sure you want to sign out?</p>
            <div className="button-container flex space-x-4 m4">
              <button
                onClick={toggleSignOutModal}
                className="bg-gray-600 inline-flex rounded-full items-center px-2 py-1 text-lg font-semibold text-white disabled:bg-gray-200 disabled:cursor-not-allowed hover:opacity-70"
              >
                Cancel
              </button>
              <SignOutAccount className="flex items-center justify-center px-2 h-12"/>
            </div>
          </div>
          
        </div>
      </div>
    </Portal>
  );
  
};

const ProfileRoute = React.memo(() => {
  const {
    toggleSettingsMenu,
    isSettingsMenuOpen,
    toggleSignOutModal,
    isSignOutModalOpen,
    classNames,
    user
  } = useContext(AppContext);
  
  const [menuState, setMenuState] = useState('closed');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const updatePointerEvents = (isAnimating) => {
      const elements = ['signoutbutton', 'settingsbutton'].map(id => document.getElementById(id));
      elements.forEach(element => {
        if (element) {
          element.classList.toggle('pointer-events-none', isAnimating);
        }
      });
    };

    updatePointerEvents(isAnimating);

    if (isSettingsMenuOpen) {
      setMenuState('opening');
      setTimeout(() => setMenuState('opened'), 250);
    } else if (menuState === 'opened') {
      setMenuState('closing');
      setTimeout(() => setMenuState('closed'), 250);
    }
  }, [isSettingsMenuOpen, menuState, isAnimating]);

  const toggleMenu = () => {
    toggleSettingsMenu();
    setIsAnimating(true);
  };

  const getAnimationClass = (delay) => {
    const baseClass = `delay-${delay}ms pointer-events-none`;
    switch (menuState) {
      case 'opening': return `animate-slideUp ${baseClass}`;
      case 'closing': return `animate-slideDown ${baseClass}`;
      case 'opened': return 'translate-y-0';
      case 'closed': return 'translate-y-full';
      default: return '';
    }
  };

  return (
    <div className="-mx-6 mt-auto">
      {['opening', 'opened', 'closing'].includes(menuState) && (
        <div className="gap-x-4 z-30">
          <button
            id='signoutbutton'
            onClick={toggleSignOutModal}
            onAnimationEnd={() => {setIsAnimating(false)}}
            className={`group z-30 flex gap-x-4 px-6 py-3 text-lg leading-6 font-semibold w-full text-gray-400 hover:text-white hover:bg-gray-800 button ${getAnimationClass(1)}`}
          >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-6 h-6 rotate-90"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
            Sign Out
          </button>

          {/* Sign Out Modal */}
          {isSignOutModalOpen && <SignOutModal/>}

          <NavLink
            id='settingsbutton'
            to="/profile"
            className={({ isActive }) =>
              `settingsbutton z-40 group flex gap-x-4 px-6 py-3 text-lg leading-6 font-semibold ${isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'} ${getAnimationClass(2)}`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg> Settings
          </NavLink>
        </div>
      )}
      <div
        className="group z-50 flex items-center select-none transition-all duration-200 overflow-x-hidden gap-x-4 px-6 py-3 text-lg leading-6 font-semibold text-gray-400 hover:text-white hover:bg-gray-800 pr-3"
        onClick={toggleMenu}
      >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 flex-shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        <p className="max-w-xs truncate z-50">{user !== null ? user.email : null}</p>
      </div>
    </div>
  );
});

// main sidebar 
const AppContext = createContext();
const Navigation = ({
  user,
  currIndex,
  classNames,
  devices,
}) => {
  // states for settings and devices accordions 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDevicesMenuOpen, setIsDevicesMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [savedConfig, setSavedConfig] = useState({}); // must be accessible to Practice 
  const [isPracticeMode, setIsPracticeMode] = useState(false);

  console.log('should definitely be func', setIsPracticeMode);
  // router 
  <Router>
    <Routes>
      <Route path="/register-interface" element={<RegisterInterface />} />
      <Route 
        exact 
        path="/devices/:deviceName/practice" 
        element={
          <Practice 
          />
        } 
      />
    </Routes>
  </Router>




  const toggleDevicesMenu = () => {
    setIsDevicesMenuOpen(!isDevicesMenuOpen);
  };

  const toggleSettingsMenu = () => {
    setIsSettingsMenuOpen(!isSettingsMenuOpen);
  };

  const toggleSignOutModal = () => {
    setIsSignOutModalOpen(!isSignOutModalOpen);
  };

  const contextValue = {
    user,
    currIndex,
    classNames,
    devices,
    isDevicesMenuOpen, 
    isSettingsMenuOpen,
    sidebarOpen,
    isSignOutModalOpen,
    savedConfig,
    setSavedConfig,
    isPracticeMode,
    setIsPracticeMode,
    toggleDevicesMenu,
    toggleSettingsMenu,
    toggleSignOutModal, 
  };

  return (
    <>
      <AppContext.Provider value={contextValue}>
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
                        <div role="list" className="flex align-top flex-col gap-y-7">
                          <div role="list" className="flex align-top flex-col gap-y-0">
                            <DevicesRoute/>
                              
                              {/* Extra space with transition */}
                              
                              <div className={`transition-all duration-300`} style={{ height: isDevicesMenuOpen ? (devices.length + 1) * 52 : 0 }}></div>

                          </div>
                          {/* Routes that will move */}
                          <UpdateRoute/>
                          <RecordGesturesRoute />
                        </div>
                        <ProfileRoute/>
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
          <div className="navbar">
            <Logo height={16} marginY={5} marginX={10}/>
            <nav className="flex flex-1 flex-col gap-y-7">
              <div role="list" className="flex align-top flex-col gap-y-0">
                <DevicesRoute/>

                {/* Extra space with transition */}

                {/* <div className={`transition-all duration-300`} style={{ height: isDevicesMenuOpen ? (devices.length + 1) * 52 : 0 }}></div> */}

              </div>
              <div role="list" className="flex align-top flex-col gap-y-7 transition-all duration-300">
                {/* Routes that will move */}
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
      </ AppContext.Provider>
    </>
  );
}

export { AppContext };

export default Navigation;

