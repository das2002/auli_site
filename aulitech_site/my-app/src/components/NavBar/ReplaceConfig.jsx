import { get, set } from 'idb-keyval';

export async function getDirectoryHandle() {
    let directoryHandle = await get('configDirectoryHandle');

    // Check if we already have a handle with the required permissions
    if (directoryHandle) {
        const permissions = await directoryHandle.queryPermission({ mode: 'readwrite' });
        if (permissions === 'granted') {
            return directoryHandle;
        }
    }

    // If no handle or insufficient permissions, request directory picker
    // This implicitly requests read-write access
    directoryHandle = await window.showDirectoryPicker();

    // Check and request permissions if necessary
    const permissionStatus = await directoryHandle.queryPermission({ mode: 'readwrite' });
    if (permissionStatus !== 'granted') {
        const permissionGranted = await directoryHandle.requestPermission({ mode: 'readwrite' });
        if (permissionGranted !== 'granted') {
            throw new Error('Read-write access not granted.');
        }
    }

    // Store the handle for future use
    await set('configDirectoryHandle', directoryHandle);
    return directoryHandle;
}




export async function fetchAndCompareConfig(webAppHwUid) {
    console.log("Fetching and comparing config.json...");

    try {
        const directoryHandle = await getDirectoryHandle();

        // check if config.json exists
        const fileHandle = await directoryHandle.getFileHandle('config.json', { create: false });

        //delete + create again
        const file = await fileHandle.getFile();

        // read config.json 
        const text = await file.text();
        const config = JSON.parse(text);

        // get hw_uid
        const deviceHwUid = config.global_info.HW_UID.value;

        // compare
        if (deviceHwUid === webAppHwUid) {
            console.log('HW_UID matches.');
            return true;
        } else {
            console.log('HW_UID does not match.');
            return false;
        }

        // return hw_uid
        // return deviceHwUid;
    } catch (error) {
        console.error('Error fetching and comparing config:', error);
        return false;
    }
}

export async function overwriteConfigFile(newConfig) {
    try {
        const directoryHandle = await getDirectoryHandle();

        // handle to the config.json file
        const fileHandle = await directoryHandle.getFileHandle('config.json', { create: true }); //false
        // Create a writable stream to overwrite the existing config.json file
        let writable = await fileHandle.createWritable();
        await writable.write(new Blob([JSON.stringify(newConfig, null, 2)], { type: 'application/json' }));
        await writable.close();

        console.log('Config file overwritten successfully.');
        return true;

    } catch (error) {
        console.error('Error overwriting config file:', error);
        return false;
    }
}

export async function checkDeviceConnection(webAppHwUid) {
    const hwUidMatch = await fetchAndCompareConfig(webAppHwUid);

    if (hwUidMatch === null) {
        throw new Error("No device is plugged in or the device HW_UID does not match.");
    }

    return hwUidMatch;
};
