import React from "react";
import HomePg from "../pages/HomePg";

export default function LogoHome({handlePage}) {
  const logoAlt = 'AULI.TECH Logo';

  return (
    <>
      <div className="flex flex-shrink-0 items-center">
        <button onClick={() => handlePage({ thing: <HomePg/>})} >
          <img
            className={'block max-h-10 w-auto lg:hidden'}
            src={require('../../images/icononly_transparent_nobuffer.png')}
            alt={logoAlt}
          />
        </button>
        <button
          onClick={() => handlePage({ thing: <HomePg/>})}
        >
          <img
            className={'hidden max-h-10 w-auto lg:block'}
            src={require('../../images/icononly_transparent_nobuffer.png')}
            alt={logoAlt}
          />
        </button>
      </div>
    </>
  )
}