import React, {useState, useEffect, Fragment} from 'react';
import './App.css';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

import SignedIn from './components/NavBar/SignedIn';
import SignInBtn from './components/NavBar/SignInBtn';
//import NavAuthDisclosure from './components/NavBar/NavAuthDisclosure';

export const NAV = [
  { name: 'About', current: true },
  { name: 'Cato', current: false },
  { name: 'Peri', current: false }
];

function App() {
  const [user, setUser] = useState(null);
  const [currPg, setCurrPg] = useState('AULI.TECH');


  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if(user) {
        setUser(user);
      } else {
        setUser(user);
      }
    });
    // return removes listener
    return () => {
      listen();
    }
  }, []);

  const handleCurrPage = (pg) => {
    setCurrPg(pg);
  }

  return (
    <div className="App">
    <div>
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
                      < XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      < Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-shrink-0 items-center">
                  < button onClick={() => handleCurrPage('AULI.TECH')} >
                    <img
                      className="block h-8 w-auto lg:hidden"
                      src={require('./images/icononly_transparent_nobuffer.png')}
                      alt="AULI.TECH Logo"
                    />
                  </button>
                  <button
                    onClick={() => handleCurrPage('AULI.TECH')}
                  >
                    <img
                      className="hidden h-8 w-auto lg:block"
                      src={require('./images/icononly_transparent_nobuffer.png')}
                      alt="AULI.TECH Logo"
                    />
                  </button>
                </div>
                <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                  {NAV.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleCurrPage(item.name)}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
            {user !== 'undefined' ?
              <SignedIn user={user}  handlePage={handleCurrPage}/>
            :
              <SignInBtn user={user}  handlePage={handleCurrPage}/>
            }
      </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
    <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{currPg}</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            hello
          </div>
        </main>
    </div>
    </div>
  );
}

export default App;
