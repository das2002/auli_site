import React from "react";
import { Accordion, AccordionItem as Item } from "@szhsin/react-accordion";
import AccordianElement from "../components/NavBar/Accordian";

export default function DevicesAccordian({
  devices,
  classNames,
  handleCurr,
  currIndex,
}) {
  const AccordionItem = ({ header, ...rest }) => {
    return (
      <Item
        {...rest}
        header={({ state: { isEnter } }) => (
          <>
            {header}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-6 text-white h-6 ml-auto transition-transform duration-200 ease-out ${
                isEnter && "rotate-180"
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </>
        )}
        className={({ isEnter }) =>
          classNames(
            isEnter ? "text-white" : "text-gray-400",
            "border-b border-white py-3 -mx-6"
          )
        }
        buttonProps={{
          className: ({ isEnter }) =>
            `flex w-full p-4 text-left text-lg hover:bg-transparent${
              isEnter && "bg-transparent"
            }`,
        }}
        contentProps={{
          className: "transition-height duration-200 ease-out",
        }}
        panelProps={{ className: "p-4" }}
      />
    );
  };

  const deviceHeader = <>
  <div className="-mx-6">
        <div className="text-gray-400 group flex gap-x-3 px-6 py-3 text-xl leading-6 font-semibold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
            />
          </svg>

          <p>Devices</p>
        </div>
      </div>
  </>

  return (
    <div>
      <Accordion
        transition
        transitionTimeout={200}
      >
        <AccordionItem
          header={deviceHeader}

        >
          <AccordianElement
            devices={devices}
            classNames={classNames}
            handleCurr={handleCurr}
            currIndex={currIndex}
          />
        </AccordionItem>
      </Accordion>
    </div>
  );
}
