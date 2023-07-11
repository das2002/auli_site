import React, { useState } from "react";
import { get } from 'https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm';
import { styles } from "../../junk/Configure";


const WriteCato = ({classNames, gestID, handleStartCountdown, handleConfigSuccess}) => {
  const [configSuccess, setConfigSuccess]  = useState(false);
  console.log(gestID);

  const writeConfig = async() => {
    try {
      const directory = await get('directory');
      console.log(directory);

      if(typeof directory !== 'undefined') {
        const perm = await directory.requestPermission()

        if(perm === 'granted') {
          const configFile = await directory.getFileHandle('config.cato', { create: true });
          
          console.log('Config.cato: ', configFile, 'gesture ID: ', gestID);
          
          const writable = await configFile.createWritable();
          await writable.write(gestID);
          await writable.close();

          const checkConfig = await directory.getFileHandle('config.cato', { create: false })
          if(checkConfig !== null) {
            setConfigSuccess(true);
            handleConfigSuccess(true);
            handleStartCountdown(true);
          };
        };
      }
    }
    catch(error) {
      console.log("write config.cato error:", error);
    }
  }

  return (
    <div className={classNames(configSuccess ? styles.ACTIVE_RING : "", "bg-white shadow sm:rounded-lg sm:mx-auto sm:w-full md:max-w-md")}>
    <div className="px-4 py-5 sm:p-6">
      <h3 className="text-base font-semibold leading-6 text-gray-900">Share gesture with Cato</h3>
      <div className="mt-2 sm:flex sm:items-start sm:justify-between">
        <div className="max-w-xl text-sm text-gray-500">
          <p>
            {configSuccess ? 'Letting Cato know to get ready for gesture...' : 'Let Cato know what gesture you would like to record by clicking Share.'}                
          </p>
          <p className="mt-2">
            
          </p>
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={writeConfig}
          className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Share
        </button>
      </div>
    </div>
  </div>
  )

};

export default  WriteCato;