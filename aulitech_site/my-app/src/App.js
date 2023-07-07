import React, {useState, useEffect, Fragment} from 'react';
import './App.css';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
//import { useNavigate, Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import SignedIn from './components/NavBar/SignedIn';
// import SignInBtn from './components/NavBar/SignInBtn';
import LogoHome from './components/NavBar/LogoHome';
import NavAuth from './components/NavBar/NavAuth';
import AboutPg from './pages/AboutPg';
import HomePg from './pages/HomePg';
import CatoPg from './pages/CatoPg';
import PeriPg from './pages/PeriPg';
//import NavAuthDisclosure from './components/NavBar/NavAuthDisclosure';

export const NAV = [
  { name: 'About', thing: <AboutPg/>, current: false },
  { name: 'Cato', thing: <CatoPg/>, current: false },
  { name: 'Peri', thing: <PeriPg/>, current: false }
];

function App() {
  const [user, setUser] = useState(null);
  const [currPg, setCurrPg] = useState({name: 'Home', thing: <HomePg/>});


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

                {/* Logo home button */}
                < LogoHome handlePage={handleCurrPage} />

                <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                  {NAV.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleCurrPage({name: item.name, thing: item.thing})}
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
              <NavAuth user={user}  handlePage={handleCurrPage}/>
            </div>
          </div>
        </>
      )}
    </Disclosure>
    <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{currPg.name}</h1>
          </div>
        </header>
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
