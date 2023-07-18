import React, { useState } from "react";

const FormatJson = ({ firstDevice, devices, curr }) => {

  const HandleWhichComponent = () => {
    if (!firstDevice) {

      let currConfig;
      devices.forEach((device, index) => {
        if(index === curr) {
          return currConfig = JSON.stringify(device.data.configjson);
        };
      })
      let name = "name";


      return (
        <>

        </>
      );
    }
  };
  return (
    <>
      <HandleWhichComponent />
    </>
  );
};

export default FormatJson;
