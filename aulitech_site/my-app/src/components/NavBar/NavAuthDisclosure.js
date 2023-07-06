import React from "react";
import { Disclosure } from '@headlessui/react';
import { USER, USER_NAV } from "./SignedIn";
import { NAV } from "../../App";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const NavAuthDisclosure = () => {
  return (
    <>
      <Disclosure.Panel className="md:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
          {NAV.map((item) => (
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
          ))}
        </div>
        <div className="border-t border-gray-700 pb-3 pt-4">
          <div className="flex items-center px-5 sm:px-6">
            <div className="flex-shrink-0">
              <img className="h-10 w-10 rounded-full" src={USER.imageUrl} alt="" />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-white">{USER.name}</div>
              <div className="text-sm font-medium text-gray-400">{USER.email}</div>
            </div>
          </div>
          <div className="mt-3 space-y-1 px-2 sm:px-3">
            {USER_NAV.map((item) => (
              <Disclosure.Button
                key={item.name}
                as="a"
                href={item.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
              >
                {item.name}
              </Disclosure.Button>
            ))}
          </div>
        </div>
      </Disclosure.Panel>

    </>
  );
};

export default NavAuthDisclosure;