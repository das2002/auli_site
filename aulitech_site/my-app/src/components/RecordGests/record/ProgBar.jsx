import React from "react";
import { CheckIcon } from "@heroicons/react/20/solid";

export default function ProgBar({ classNames, stepCount, gestName }) {
  const steps = [
    {
      name: "Step 1",
      href: "#",
      status: stepCount >= 1 ? "complete" : "current",
    },
    {
      name: "Step 2",
      href: "#",
      status:
        stepCount === 1 ? "current" : stepCount >= 1 ? "complete" : "upcoming",
    },
    {
      name: "Step 3",
      href: "#",
      status:
        stepCount === 2 ? "current" : stepCount >= 2 ? "complete" : "upcoming",
    },
    {
      name: "Step 4",
      href: "#",
      status:
        stepCount === 3 ? "current" : stepCount >= 3 ? "complete" : "upcoming",
    },
    {
      name: "Step 5",
      href: "#",
      status:
        stepCount === 4 ? "current" : stepCount >= 4 ? "complete" : "upcoming",
    },
  ];

  return (
    <nav aria-label="Progress">
      <ol role="list" className="overflow-hidden p-5 mr-10">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={classNames(
              stepIdx !== steps.length - 1 ? "pb-16" : "",
              "relative"
            )}
          >
            {step.status === "complete" ? (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div
                    className="absolute left-5 top-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-900"
                    aria-hidden="true"
                  />
                ) : null}
                <a href={step.href} className="group relative flex items-start">
                  <span className="flex h-9 items-center">
                    <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-900">
                      <CheckIcon
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                  <span className="sr-only">{step.name}</span>

                  {/* <span className="ml-4 flex min-w-0 flex-col">
                    <span className="text-sm font-medium">{gest}{step.name}</span>
                  </span> */}
                </a>
              </>
            ) : step.status === "current" ? (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div
                    className="absolute left-5 top-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
                    aria-hidden="true"
                  />
                ) : null}
                <a
                  href={step.href}
                  className="group relative flex items-start"
                  aria-current="step"
                >
                  <span className="flex h-9 items-center" aria-hidden="true">
                    <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-900 bg-white">
                      <span className="h-2.5 w-2.5 rounded-full bg-gray-900" />
                    </span>
                  </span>
                  <span className="sr-only">{step.name}</span>

                  {/* <span className="ml-4 flex min-w-0 flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {step.name}
                    </span>
                  </span> */}
                </a>
              </>
            ) : (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div
                    className="absolute left-5 top-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
                    aria-hidden="true"
                  />
                ) : null}
                <a href={step.href} className="group relative flex items-start">
                  <span className="flex h-9 items-center" aria-hidden="true">
                    <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                      <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                    </span>
                  </span>
                  <span className="sr-only">{step.name}</span>

                  {/* <span className="ml-4 flex min-w-0 flex-col">
                    <span className="text-sm font-medium text-gray-500">
                      {step.name}
                    </span>
                  </span> */}
                </a>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
  // return (
  //   <>
  //     <nav aria-label="Progress">
  //       <ol role="list" className="flex justify-center">
  //         {steps.map((step, stepIdx) => (
  //           <li
  //             key={step.name}
  //             className={classNames(
  //               stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "",
  //               "relative"
  //             )}
  //           >
  //             {step.status === "complete" ? (
  //               <>
  //                 <div
  //                   className="absolute inset-0 flex items-center"
  //                   aria-hidden="true"
  //                 >
  //                   <div className="h-0.5 w-full bg-gray-900" />
  //                 </div>
  //                 <a
  //                   href="#"
  //                   className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gray-900"
  //                 >
  //                   <CheckIcon
  //                     className="h-5 w-5 text-white"
  //                     aria-hidden="true"
  //                   />
  //                   <span className="sr-only">{step.name}</span>
  //                 </a>
  //               </>
  //             ) : step.status === "current" ? (
  //               <>
  //                 <div
  //                   className="absolute inset-0 flex items-center"
  //                   aria-hidden="true"
  //                 >
  //                   <div className="h-0.5 w-full bg-gray-200" />
  //                 </div>
  //                 <a
  //                   href="#"
  //                   className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-900 bg-white"
  //                   aria-current="step"
  //                 >
  //                   <span
  //                     className="h-2.5 w-2.5 rounded-full bg-gray-900"
  //                     aria-hidden="true"
  //                   />
  //                   <span className="sr-only">{step.name}</span>
  //                 </a>
  //               </>
  //             ) : (
  //               <>
  //                 <div
  //                   className="absolute inset-0 flex items-center"
  //                   aria-hidden="true"
  //                 >
  //                   <div className="h-0.5 w-full bg-gray-200" />
  //                 </div>
  //                 <a
  //                   href="#"
  //                   className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400"
  //                 >
  //                   <span
  //                     className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300"
  //                     aria-hidden="true"
  //                   />
  //                   <span className="sr-only">{step.name}</span>
  //                 </a>
  //               </>
  //             )}
  //           </li>
  //         ))}
  //       </ol>
  //     </nav>
  //   </>
  // );
}
