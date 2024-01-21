// deviceCheck.js

const checkDeviceConnection = async (webAppHwUid) => {
    const hwUidMatch = await fetchAndCompareConfig(webAppHwUid);
    const webAppHwUid = editedGlobalSettings["HW_UID"]["value"];
    
    if (hwUidMatch === null) {
      throw new Error("No device is plugged in or the device HW_UID does not match.");
    }
    return hwUidMatch; 
};
  const fetchAndCompareConfig = async (webAppHwUid) => {
    // fetch logic here to compare with webAppHwUid
    return null;
  };
  
  export default checkDeviceConnection;
  