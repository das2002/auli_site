import React, { useState } from "react";

const  CatoName = ({jsonData}) => {
  const [nameCato, setNameCato] = useState("");


  const handleEditDeviceName = (e) => {
    setNameCato(e.target.value);
    console.log(nameCato);
    return jsonData.name = e.target.value;
  }


  console.log(jsonData);
  return (
    <>
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-4">
          <label htmlFor="deviceName" className="block text-sm font-medium leading-6 text-gray-900">
            Device Name
          </label>
          <div className="mt-2">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="text"
                name="deviceName"
                id="deviceName"
                value={nameCato}
                onChange={handleEditDeviceName}
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder={jsonData ? jsonData.name : "Device Name"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

export default CatoName;