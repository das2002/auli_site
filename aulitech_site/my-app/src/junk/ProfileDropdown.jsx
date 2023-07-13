import React, { Fragment} from "react";
import { Menu, Transition } from '@headlessui/react';
import { Link } from "react-router-dom";


const ProfileDropdown = ({user, classNames}) => {

  return (
    <>
      <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
  
        {/* Profile dropdown */}
        <Menu as="div" className="relative ml-3">
          <div>
            <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <span className="sr-only">Open user menu</span>
              <span className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                <svg className="h-full w-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
            </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item 
                className='bg-gray-100 block px-4 py-2 text-sm text-gray-700'                          
              >
                <Link to="/profile">Profile</Link>
              </Menu.Item>
              {/* <Menu.Item 
                className='bg-gray-100 block px-4 py-2 text-sm text-gray-700'                          
              >
                <Link to="/configure-cato">Configure Cato</Link>
              </Menu.Item> */}
              <Menu.Item 
                className='bg-gray-100 block px-4 py-2 text-sm text-gray-700'                          
              >
                <Link to="/sign-out">Sign Out</Link>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </>
  )
}

export default ProfileDropdown;