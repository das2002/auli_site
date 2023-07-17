import React, { useState } from "react";
import UserCatoDevices from "./UserCatoDevices";
import SettingsNav from "./SettingsNav";
import FormatJson from "./FormatJson";
import { defaultConfig } from "./RegisterCatoDevice";


const CatoSettings = ({classNames, user}) => {
  const [firstDevice, setFirstDevice] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [curr, setCurr] = useState(defaultConfig);

  const handleDevice = (isFirstState, id) => {
    setFirstDevice(isFirstState);
    setDeleteId(id);
  }

  const handleCurr = (currConfig) => {
    setCurr(currConfig);
  }

  const HandleWhichComponent = () => {
    // UserCatoDevices(user, handleDevice);
    
    if(firstDevice) {
      return (
        <>
          <p>No Cato devices registered. Select register device to register your Cato.</p>
        </>
      )
    } else {
      return(
        <>
          <FormatJson configString={curr}/>
        </>
      )
    }
  }

  return (
    <>
      <SettingsNav classnames={classNames} user={user} handleCurr={handleCurr}/>
      <HandleWhichComponent/>
    </>
  )
}



export default CatoSettings;

