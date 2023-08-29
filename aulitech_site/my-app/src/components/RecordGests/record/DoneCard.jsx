import React from "react";

export default function DoneCard({gestName, handleDoneRecording}) {

 return (
  <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-5 h-full">
        <div className="px-4 py-5 sm:p-6 lg:px-8">
          <div className="border-b border-gray-200 pb-10">
            <div className="border-b border-gray-200 pb-5 flex justify-between">
              <h3 className="text-xl font-semibold leading-6 text-gray-900 flex-none">
                {gestName} Recording Set Complete!
              </h3>
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <button
              type="button"
              onClick={handleDoneRecording}
              className="inline-flex rounded-full items-center bg-blue-500 px-2.5 py-1 text-lg font-semibold text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-300"
            >
              Done
            </button>
          </div>
        </div>
      </div>
 )
}