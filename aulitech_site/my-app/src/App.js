import React, {useState, useEffect, Fragment} from 'react';
import './App.css';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { Disclosure } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

import LogoHome from './components/NavBar/LogoHome';
import NavAuth from './components/NavBar/NavAuth';
import HomePg from './pages/HomePg';
import NavBarPgs from './components/NavBar/NavBarPgs';
import NavAuthDisclosure from './components/NavBar/NavAuthDisclosure';


function App() {
  const [user, setUser] = useState(null);
  const [currPg, setCurrPg] = useState({thing: <HomePg/>});



  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }


  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if(user) {
        setUser(user);
        setCurrPg({thing: <HomePg/>})
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
    <Disclosure as="div" className="bg-transparent">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">

                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-white focus:outline-none transition ease-in-out duration-300  delay-300">
                    <span className="sr-only">Open main menu</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                    </svg>
                  </Disclosure.Button>
                </div>

                {/* Logo home button */}
                < LogoHome handlePage={handleCurrPage} />

                {/* NavBar Pages*/}
                <NavBarPgs user={user} handlePage={handleCurrPage}/>
              </div>
              <NavAuth user={user}  handlePage={handleCurrPage}/>
            </div>
          </div>
          <NavAuthDisclosure user={user} handlePage={handleCurrPage}/>
        </>
      )}
    </Disclosure>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
              {currPg.thing}
          </div>
        </main>
    </div>
    </div>
  );
}

export default App;
