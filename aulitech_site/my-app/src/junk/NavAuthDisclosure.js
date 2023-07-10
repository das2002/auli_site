import React from "react";
import { Disclosure } from '@headlessui/react';
import AboutPg from "../pages/AboutPg";
import CatoPg from "../pages/CatoPg";
import PeriPg from "../pages/PeriPg";
import SignInBtn from "../components/NavBar/SignInBtn";
import ConfigureCato from "../components/ConfigureCato/Configure";
import SignOutAccount from "../components/GoogleAuth/SignOutAccount";


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const NavAuthDisclosure = ({user, handlePage}) => {
  const USER_NAV = [
    { name: 'Configure Cato', thing: <ConfigureCato/>},
    { name: 'Sign out', thing: <SignOutAccount/>}
  ];


const USER = {
    name: 'Tom Cook',
    email: 'user.email',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  };
  const NAV = [
    { name: 'About', thing: <AboutPg/> },
    { name: 'Cato', thing: <CatoPg/> },
    { name: 'Peri', thing: <PeriPg/> }
  ];

  const handleLiftState = (pgName) => {
    for(let i=0; i < NAV.length; i++) {
      if(NAV[i].name === pgName) {        
        return (
          handlePage({thing: NAV[i].thing})
        );
      };
    };
  };

  const HandleUserNavUI = () => {
    return (
      <>
              {user !== null ? 
        <div className="pb-3 pt-4 divide-y divide-solid divide-gray-700">
          <div className="flex items-center px-2 sm:px-2 ">
            <div className="flex-shrink-0">
              <img className="h-10 w-10 rounded-full" src={USER.imageUrl} alt="" />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-700">{USER.name}</div>
            </div>
          </div>
          <div className="mt-3 space-y-1 px-2 sm:px-3">
            {USER_NAV.map((item) => (
              <Disclosure.Button
                key={item.name}
                as="a"
                onClick={() => handlePage({thing: item.thing})}
                className="block rounded px-1 py-2 text-sm font-medium text-gray-700"
              >
                {item.name}
              </Disclosure.Button>
            ))}
          </div>
        </div>
        :
        <SignInBtn/>
        }
      </>
    );
  }


  return (
    <>
      <Disclosure.Panel className="w-1/2 bg-white divide-y rounded divide-solid divide-gray-700 z-10">
      
      <HandleUserNavUI/>
        <div className=" px-2 pb-3 pt-2 sm:px-3">
          {NAV.map((item) => (
            <Disclosure.Button
              key={item.name}
              as="a"
              onClick={() => handleLiftState(item.name)}
              className={'text-gray-800 block rounded-md px-1 py-2 text-base font-small'}
              >
              {item.name}
            </Disclosure.Button>
          ))}
        </div>
      </Disclosure.Panel>
    </>
  );
};

export default NavAuthDisclosure;