import React, { useState, useEffect } from "react";
import { get, set, clear } from 'https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm';

const ConfigureCato = () => {
  const [catoConnected, setCatoConnected] = useState(false);
  const [configSuccess, setConfigSuccess]  = useState(false);
  const [gestureNum, setGestureNum] = useState(0);
  const [prevGesture, setPrevGesture]  = useState('');
  
  const reset = () => {
    clear();
    setCatoConnected(false);
  }


  const getDirectory = async() => {
    try {
      const dirHandleOrUndefined = await get('directory');

      if (dirHandleOrUndefined) {
        console.log("retrieved dir handle:", dirHandleOrUndefined.name);
        setCatoConnected(true);
        return;
      }

      const dirHandle = await window.showDirectoryPicker({
        id: 'AULI_CATO',
        mode: 'readwrite'
      });

      await set('directory', dirHandle);
      console.log('store dir handle:', dirHandle.name);
      setCatoConnected(true);
      
    }
    catch(error) {
      console.log("get directory error:", error);
    }
  }


  const writeConfig = async() => {
    //const directory = await get('directory');
    try {
      const directory = await get('directory');
      console.log(directory);

      if(typeof directory !== 'undefined') {
        const perm = await directory.requestPermission()

        if(perm === 'granted') {
          const configFile = await directory.getFileHandle('config.cato', { create: true });
          
          console.log('Config.cato:', configFile);
          
          const writable = await configFile.createWritable();
          console.log(gestureNum);
          await writable.write(gestureNum);
          await writable.close();

          const checkConfig = await directory.getFileHandle('config.cato', { create: false })
          if(checkConfig !== null) {
            setConfigSuccess(true);
          };
        };
      }
    }
    catch(error) {
      console.log("write config.cato error:", error);
    }
  }

  // const handleGestureNums = (e) => {
  //   const numMeanings = {
  //     0: 'Noop',
  //     1: 'Nod up',
  //     2: 'Nod down',
  //     3: 'Nod right',
  //     4: 'Tilt right',
  //     5: 'Tilt left',
  //     6: 'Shake vertical',
  //     7: 'Shake horizontal',
  //     8: 'Circle clockwise',
  //     9: 'Circle counterclockwise',
  //   };

  //   setPrevGesture(numMeanings[gestureNum]);
  //   setGestureNum(e.target.value);

  // }
  // console.log('Previous gesture:', prevGesture);
  // console.log('Gesture num:', gestureNum)


  const HandleConnectDirectoryUI = () => {
    return (
      <div>
        <p>{catoConnected ? 'Connected to AULI_CATO on local computer.' : 'Allow access to Cato. Select AULI_CATO from your local computer.'}</p>
        
        {catoConnected  ? 
        <>
          <img src={require('../../images/check-icon.png')} alt='circle check icon' width={'3%'}/>
          <br/>
          <button onClick={reset}>Reset Connection</button>
        </>
        :
        <>
          <button onClick={getDirectory}>Connect</button>
        </>}
      </div>
    )
  }

  const HandleConfigUI = () => {
    return (
      <div>
        <p>Hit start to begin recording gesture.</p>
        <button onClick={writeConfig} disabled={configSuccess}>Start</button>
        <br/>
        {configSuccess ? 
        <>   
          <img src={require('../../images/check-icon.png')} alt='circle check icon' width={'3%'}/>  
        </>
        : null}
      </div>
    )
  }

  return (
    <>
      <h3>Configure your Cato</h3>
      <HandleConnectDirectoryUI/>
      <br/>
      <br/>
      <div>
        <p>Select gesture to record and map.</p>
        <select
          value={gestureNum}
          onChange={(e) => {setGestureNum(e.target.value)}}
        >
          <option value={0}>Select</option>
          <option value={1}>Nod up</option>
          <option value={2}>Nod down</option>
          <option value={3}>Nod right</option>
          <option value={4}>Nod left</option>
          <option value={5}>Tilt right</option>
          <option value={6}>Tilt left</option>
          <option value={7}>Shake vertical</option>
          <option value={8}>Shake horizontal</option>
          <option value={9}>Circle clockwise</option>
          <option value={10}>Circle counterclockwise</option>
        </select>
      </div>
      <HandleConfigUI/>
    </>
  )
}

export default ConfigureCato;