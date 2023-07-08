import React from "react";
import AboutPg from '../../pages/AboutPg';
import CatoPg from '../../pages/CatoPg';
import PeriPg from '../../pages/PeriPg';

export const NAV = [
  { name: 'About', thing: <AboutPg/> },
  { name: 'Cato', thing: <CatoPg/> },
  { name: 'Peri', thing: <PeriPg/> }
];

const NavBarPgs = ({user, handlePage}) => {
  
  const handleLiftState = (pgName) => {
    for(let i=0; i < NAV.length; i++) {
      if(NAV[i].name === pgName) {        
        return (
          handlePage({thing: NAV[i].thing})
        );
      };
    };
  };
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  };

  return(
    <>
      <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
        {NAV.map((item) => (
          <button
            key={item.name}
            onClick={() => handleLiftState(item.name)}
            className={classNames(
              'text-gray-400 hover:text-white',
              'rounded-md px-3 py-2 text-sm font-medium'
            )}
          >
            {item.name}
          </button>
        ))}
      </div>
    </>
  )
}

export default NavBarPgs;