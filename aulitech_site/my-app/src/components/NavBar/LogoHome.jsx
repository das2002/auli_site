import React from "react";

export default function LogoHome({handlePage}) {
  const logoAlt = 'AULI.TECH Logo';
  const logoStyles = {
    'BLOCK': 'block h-8 w-auto lg:hidden',
    'HIDDEN': 'hidden h-8 w-auto lg:block'
  }
  return (
    <>
      <div className="flex flex-shrink-0 items-center">
        <button onClick={() => handlePage('HomePg')} >
          <img
            className={logoStyles.BLOCK}
            src={require('../../images/icononly_transparent_nobuffer.png')}
            alt={logoAlt}
          />
        </button>
        <button
          onClick={() => handlePage('HomePg')}
        >
          <img
            className={logoStyles.HIDDEN}
            src={require('../../images/icononly_transparent_nobuffer.png')}
            alt={logoAlt}
          />
        </button>
      </div>
    </>
  )
}