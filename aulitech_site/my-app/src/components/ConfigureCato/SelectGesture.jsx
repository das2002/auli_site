import React, { useState, Fragment } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Listbox, Transition } from '@headlessui/react';
import { styles } from '../../junk/Configure';


const gestures = [
  {id: 0, name: 'Select'},
  {id: 1, name: 'Nod up'},
  {id: 2, name: 'Nod down'},
  {id: 3, name: 'Nod right'},
  {id: 4, name: 'Nod left'},
  {id: 5, name: 'Tilt right'},
  {id: 6, name: 'Tilt left'},
  {id: 7, name: 'Shake vertical'},
  {id: 8, name: 'Shake horizontal'},
  {id: 9, name: 'Circle clockwise'},
  {id: 10, name: 'Circle counterclockwise'}
];

const SelectGesture = ({classNames, handleGestName}) => {
  const [gestureNum, setGestureNum] = useState(0);
  const [selected, setSelected] = useState(gestures[0]);


    const shareGesture = (e) => {
      setSelected(e);
      setGestureNum(e.id);
      handleGestName(e.name)
    }

    return(
      <>
            <div className="border-b border-gray-200 pb-5 ">
              <h3 className="text-base font-semibold leading-6 text-gray-900">Start Here</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Select gesture that you would like to record from the dropdown below.
                </p>
              </div>
            </div>
            <div className="mt-5">
            <Listbox value={selected} onChange={shareGesture}>
            {({ open }) => (
              <>
                <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Gestures</Listbox.Label>
                <div className="relative mt-2">
                  <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 sm:text-sm sm:leading-6">
                    <span className="block truncate">{selected.name}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {gestures.map((gesture) => (
                        <Listbox.Option
                          key={gesture.id}
                          className={({ active }) =>
                            classNames(
                              active ? 'bg-gray-100 text-blue-500' : 'text-gray-900',
                              'relative cursor-default select-none py-2 pl-3 pr-9'
                            )
                          }
                          value={gesture}
                        >
                          {({ selected, active }) => (
                            <>
                              <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}> {gesture.name} </span>

                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? 'text-blue-500' : 'text-blue-300',
                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                  )}
                                >
                                  <CheckIcon className="h-5 w-5 text-blue-500" aria-hidden="true" />
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
          {gestureNum !== 0 ? 
          <>
            <button
              type="button"
              className="mt-10 inline-flex items-center rounded-full bg-gray-900 px-2.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Continue
            </button>

          </>
          :
          null}
        </div>
          
      </>
    )
    // return (
    //   <div className={classNames(gestureNum !== 0 ? styles.ACTIVE_RING : "", "bg-white shadow sm:rounded-lg sm:mx-auto sm:w-full md:max-w-md")}>
    //     <div className="px-4 py-5 sm:p-6">
    //       <h3 className="text-base font-semibold leading-6 text-gray-900">2. Select Gesture</h3>
    //       <div className="mt-2 max-w-xl text-sm text-gray-500">
    //         <p>
    //           Select gesture that you would like to record from the dropdown below.
    //         </p>
    //       </div>
        //   <div className="mt-5">
        //     <Listbox value={selected} onChange={shareGesture}>
        //     {({ open }) => (
        //       <>
        //         <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Gestures</Listbox.Label>
        //         <div className="relative mt-2">
        //           <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 sm:text-sm sm:leading-6">
        //             <span className="block truncate">{selected.name}</span>
        //             <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        //               <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        //             </span>
        //           </Listbox.Button>

        //           <Transition
        //             show={open}
        //             as={Fragment}
        //             leave="transition ease-in duration-100"
        //             leaveFrom="opacity-100"
        //             leaveTo="opacity-0"
        //           >
        //             <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
        //               {gestures.map((gesture) => (
        //                 <Listbox.Option
        //                   key={gesture.id}
        //                   className={({ active }) =>
        //                     classNames(
        //                       active ? 'bg-gray-100 text-blue-500' : 'text-gray-900',
        //                       'relative cursor-default select-none py-2 pl-3 pr-9'
        //                     )
        //                   }
        //                   value={gesture}
        //                 >
        //                   {({ selected, active }) => (
        //                     <>
        //                       <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}> {gesture.name} </span>

        //                       {selected ? (
        //                         <span
        //                           className={classNames(
        //                             active ? 'text-blue-500' : 'text-blue-300',
        //                             'absolute inset-y-0 right-0 flex items-center pr-4'
        //                           )}
        //                         >
        //                           <CheckIcon className="h-5 w-5 text-blue-500" aria-hidden="true" />
        //                         </span>
        //                       ) : null}
        //                     </>
        //                   )}
        //                 </Listbox.Option>
        //               ))}
        //             </Listbox.Options>
        //           </Transition>
        //         </div>
        //       </>
        //     )}
        //   </Listbox>
        // </div>
    //   </div>
    // </div>
    // )

};

export default SelectGesture;