import React, { useState } from "react";
import StoreGestData from "./StoreGestData";

const FormatGestData = ({logFile, gestures}) => {
  const [mappedData, setMappedData] = useState([]);
  const [gestName, setGestName] = useState('');

  const handleFormat = () => {
    const lineSeperated = logFile.split('\n');
    const mapped = [];

    const commaSeperated = [];
    lineSeperated.forEach((line) => {
      commaSeperated.push(line.split(','));
    })

  for(let i=0; i < commaSeperated.length - 1; i++) {
    let dataObj = {};

    commaSeperated[i].map((value, index) => {
      switch (index) {
          case 0 :
            return dataObj.ax = value;
          case 1 :
            return dataObj.ay = value;
          case 2 :
            return dataObj.az = value;
          case 3 : 
            return dataObj.gx = value;
          case 4 :
            return dataObj.gy = value;
          case 5 :
            return dataObj.gz = value;
          case 6 : 
            return setGestName(gestures[parseInt(value)].name);
          default:
            return null;
        };

      })
      mapped.push(dataObj);
    };
    setMappedData(mapped);
  }
  
  
  return(
    <>
    <p>called format gest data </p>
    <button
      onClick={handleFormat}
    >
      format data test
    </button>
    <StoreGestData gesture={gestName} logFile={mappedData}/>
    </>
  );
};

export default FormatGestData;