import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'

const plans = [
  { name: 'Startup', priceMonthly: 29, priceYearly: 290, limit: 'Up to 5 active job postings' },
  { name: 'Business', priceMonthly: 99, priceYearly: 990, limit: 'Up to 25 active job postings' },
  { name: 'Enterprise', priceMonthly: 249, priceYearly: 2490, limit: 'Unlimited active job postings' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ChooseGest() {
  const [selected, setSelected] = useState(plans[0])

  return (
    <RadioGroup value={selected} onChange={setSelected}>
      <RadioGroup.Label className="sr-only">Pricing plans</RadioGroup.Label>
      <div className="relative -space-y-px rounded-md bg-white">
        {plans.map((plan, planIdx) => (
          <RadioGroup.Option
            key={plan.name}
            value={plan}
            className={({ checked }) =>
              classNames(
                planIdx === 0 ? 'rounded-tl-md rounded-tr-md' : '',
                planIdx === plans.length - 1 ? 'rounded-bl-md rounded-br-md' : '',
                checked ? 'z-10 border-indigo-200 bg-indigo-50' : 'border-gray-200',
                'relative flex cursor-pointer flex-col border p-4 focus:outline-none md:grid md:grid-cols-3 md:pl-4 md:pr-6'
              )
            }
          >
            {({ active, checked }) => (
              <>
                <span className="flex items-center text-sm">
                  <span
                    className={classNames(
                      checked ? 'bg-indigo-600 border-transparent' : 'bg-white border-gray-300',
                      active ? 'ring-2 ring-offset-2 ring-indigo-600' : '',
                      'h-4 w-4 rounded-full border flex items-center justify-center'
                    )}
                    aria-hidden="true"
                  >
                    <span className="rounded-full bg-white w-1.5 h-1.5" />
                  </span>
                  <RadioGroup.Label
                    as="span"
                    className={classNames(checked ? 'text-indigo-900' : 'text-gray-900', 'ml-3 font-medium')}
                  >
                    {plan.name}
                  </RadioGroup.Label>
                </span>
                <RadioGroup.Description as="span" className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-center">
                  <span className={classNames(checked ? 'text-indigo-900' : 'text-gray-900', 'font-medium')}>
                    ${plan.priceMonthly} / mo
                  </span>{' '}
                  <span className={checked ? 'text-indigo-700' : 'text-gray-500'}>(${plan.priceYearly} / yr)</span>
                </RadioGroup.Description>
                <RadioGroup.Description
                  as="span"
                  className={classNames(
                    checked ? 'text-indigo-700' : 'text-gray-500',
                    'ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right'
                  )}
                >
                  {plan.limit}
                </RadioGroup.Description>
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  )
}


// import React, {useState} from "react";

// const ChooseGest = () => {
//   const [nextStepDisabled, setNextStepDisabled] = useState(false);

//   const gestures = [
//     { id: 0, name: "Select" },
//     { id: 1, name: "Nod up" },
//     { id: 2, name: "Nod down" },
//     { id: 3, name: "Nod right" },
//     { id: 4, name: "Nod left" },
//     { id: 5, name: "Tilt right" },
//     { id: 6, name: "Tilt left" },
//     { id: 7, name: "Shake vertical" },
//     { id: 8, name: "Shake horizontal" },
//     { id: 9, name: "Circle clockwise" },
//     { id: 10, name: "Circle counterclockwise" },
//   ];

//   return (
//     <div >
//       <div className="border-b border-gray-200 pb-5">
//         <h3 className="text-base font-semibold leading-6 text-gray-900">
//           Select Gesture
//         </h3>
//       </div>
//       <ul
//         role="list"
//         className="px-4 py-5 sm:p-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
//       >
//         {gestures.map((gest) => (
//           <li
//             key={gest.name}
//             className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
//           >
//             <div className="flex w-full items-center justify-between space-x-6 p-6">
//               <div className="flex-1 truncate">
//                 <div className="flex items-center space-x-3">
//                   <h3 className="truncate text-sm font-medium text-gray-900">
//                     {gest.name}
//                   </h3>
//                 </div>
//                 <p className="mt-1 truncate text-sm text-gray-500"></p>
//               </div>
//             </div>
//             <div>
//               <div className="-mt-px flex divide-x divide-gray-200">
//                 <div className="flex w-0 flex-1">
//                   {/* <p
//                   className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
//                 >
//                   {gest.count} / 5
//                 </p> */}
//                 </div>
//                 <div className="-ml-px flex w-0 flex-1">
//                   {/* <p
//                   className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
//                 >
                  
//                 </p> */}
//                 </div>
//               </div>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ChooseGest;
