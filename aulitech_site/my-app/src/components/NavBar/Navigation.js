import React from "react";
import { Link, NavLink } from "react-router-dom";

import { Fragment } from 'react'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import NavAuth from "../../junk/NavAuth";
import SignInBtn from "./SignInBtn";
import ProfileDropdown from "./ProfileDropdown";

const Navigation = ({user, classNames}) => {

  
    return (
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="-ml-2 mr-2 flex items-center md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>

                  <div className="flex flex-shrink-0 items-center">
                    <Link to="/">
                      <img
                        className="block h-8 w-auto lg:hidden"
                        src={require('../../images/icononly_transparent_nobuffer.png')}
                        alt="Your Company"
                      />
                    </Link>
                    <Link to="/">
                      <img
                        className="hidden h-8 w-auto lg:block"
                        src={require('../../images/icononly_transparent_nobuffer.png')}
                        alt="Your Company"
                      />
                    </Link>
                  </div>

                  <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                    <NavLink 
                      to="/about"
                      className={({isActive}) => 
                        isActive ? 'bg-gray-900 text-white' : classNames('text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium')
                      }
                    >
                      About
                    </NavLink>

                    <NavLink 
                      to="/cato"
                      className={({isActive}) => 
                        isActive ? 'bg-gray-900 text-white' : classNames('text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium')
                      }
                    >
                      Cato
                    </NavLink>
                      
                    <NavLink 
                      to="/peri"
                      className={({isActive}) => 
                        isActive ? 'bg-gray-900 text-white' : classNames('text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium')
                      }
                    >
                      Peri
                    </NavLink>
                  </div>

                </div>

                {/* display either profile dropdown or sign in button*/}
                <div className="flex items-center">
                  {user ? <ProfileDropdown user={user} classNames={classNames}/> : <SignInBtn user={user}/>}
                </div>                
                
              </div>
            </div>
  
            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                <Disclosure.Button>
                  About
                </Disclosure.Button>
                <Disclosure.Button>
                  Cato
                </Disclosure.Button>
                <Disclosure.Button>
                  Peri
                </Disclosure.Button>

                {/*{navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}*/}

              </div>
              <div className="border-t border-gray-700 pb-3 pt-4">
                <div className="flex items-center px-5 sm:px-6">
                  <span className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-400">user</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2 sm:px-3">
                  <Disclosure.Button
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    Profile
                  </Disclosure.Button>
                  <Disclosure.Button
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    Configure Cato
                  </Disclosure.Button>
                  <Disclosure.Button
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    Sign Out
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    )
};

export default Navigation;