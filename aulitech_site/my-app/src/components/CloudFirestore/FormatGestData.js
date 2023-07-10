import React, { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore"; 

const FormatGestData = ({logFile}) => {
  const [mappedData, setMappedData] = useState([]);

  const lineArr = logFile.split('\n');
  const commaArr = [];

  lineArr.forEach((line) => {
    commaArr.push(line.split(','));
  });

  commaArr.map((arr) => {
    let test = [];
    arr.map((value, index) => {
      switch (index) {
        case 0 :
          return test.push({'ax': value});
        case 1 :
          return test.push({'ay': value});
        case 2 :
          return test.push({'az': value});
        case 3 : 
          return test.push({'gx': value});
        case 4 :
          return test.push({'gy': value});
        case 5 :
          return test.push({'gz': value});
        case 6 : 
          return test.push({'gestID': value});
        default:
          return null;
      };
    })
    return mappedData.push(test);
  });

  console.log(mappedData);

  useEffect(() => {
    if(mappedData.length > 75) {
      return setMappedData([]);
    }
  })

  return(
    <>
    <p>called format gest data </p>
    </>
  );
};

export default FormatGestData;