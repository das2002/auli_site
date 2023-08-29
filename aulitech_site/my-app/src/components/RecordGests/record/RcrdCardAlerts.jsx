import React, {useEffect, useState} from "react";

export default function RcrdCardAlerts() {
  const [dirConnect, setDirConnect] = useState(null);
  const [writeConnect, setWriteConnect] = useState(false);
  const [checkConnect, setCheckConnect] = useState(false);
  const [logConnect, setLogConnect] = useState(false);
  
  useEffect(() => {
    let dir = false;
    let write = false;
    let check = false;
    let log = false;

    const checkConnection = async() => {
      let dirHandle = await get('directory');
      let writeHandle = await get('gesture.cato');
      let checkWrtHandle = await get('checkConfig');
      let logHandle = await get('log.txt');

      if (dirHandle === undefined) {
        dir = false;
      } else {
        dir = true;
      }
      if (writeHandle === undefined) {
        write = false;
      } else {
        write = true;
      }
      if (checkWrtHandle === undefined) {
        check = false;
      } else {
        check = true;
      }
      if (logHandle === undefined) {
        log = false;
      } else {
        log = true;
      }
      return (dir, write, check, log);
    }

    return () => {
      checkConnection();
      setDirConnect(dir);
      setWriteConnect(write);
      setCheckConnect(check);
      setLogConnect(log)
    }
  }, [])

  const DisplayWhichStartAlert = () => {
    let alertTxt;
    if(!dirConnect && !writeConnect) {
      alertTxt = "When you click Start you will be prompted by your browser. Select the AULI_CATO directory then "
    }
  }

  const DisplayWhichNextAlert = () => {

  }

  const DisplayAlerts = () => {

  }
}