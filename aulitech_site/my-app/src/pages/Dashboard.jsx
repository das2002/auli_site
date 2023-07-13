import React from "react";
import { clear } from 'idb-keyval';

import ConnectDirectory from "../components/ConfigureCato/ConnectDirectory";

const Dashboard = ({classNames}) => {
  
  const reset = () => {
    clear();
  }

  const handleCatoConnected = (connectState) => {
    console.log(connectState);
  }

  return (
      <div className="mx-auto w-full max-w-7xl grow lg:flex xl:px-2">
          {/* Left sidebar & main wrapper */}
          <div className="flex-1 xl:flex">
            <div className="border-b border-gray-200 px-4 py-6 sm:px-6 lg:pl-8 xl:w-64 xl:shrink-0 xl:border-b-0 xl:border-r xl:pl-6">
              {/* Left column area */}
              hi
            </div>

            <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">{/* Main area */} hi</div>
          </div>

          <div className="shrink-0 border-t border-gray-200 px-4 py-6 sm:px-6 lg:w-96 lg:border-l lg:border-t-0 lg:pr-8 xl:pr-6">
            <div className="border-b border-gray-200 pb-5">
              <h3 className="text-base font-semibold leading-6 text-gray-900">Device Connection Status</h3>
            </div>
            <ConnectDirectory classNames={classNames} reset={reset} handleCatoConnected={handleCatoConnected}/>
            <button
              type="button"
              onClick={reset}
              className="mt-5 inline-flex items-center rounded-full bg-gray-900 px-2.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Reset Connection
            </button>
          </div>
        </div>
  )
}

export default Dashboard;