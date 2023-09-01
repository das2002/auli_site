import React from "react";
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'


export default function OptionsDropdwn({classNames, current, options, handleOptSelect, path}) {
  const [selected, setSelected] = useState(current)

  const shareSelectOpt = (e) => {
    try {
      setSelected(e)
      handleOptSelect(e, path)
    } catch(error) {
      console.log(error)
    }
  }

  return (
    <Listbox value={selected} onChange={shareSelectOpt}>
      {({ open }) => (
        <>

          <div className="relative mx-4">
            <Listbox.Button className="relative border-0 outline-0 w-full cursor-default rounded-md bg-white px-2.5 py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-inset sm:text-base sm:leading-6">
              <span className="block truncate">{selected}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-900" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="text-gray-900 absolute z-40 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg focus:outline-none sm:text-base">
                {options.map((opt, index) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-blue-500 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={opt}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {opt}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-blue-500',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}