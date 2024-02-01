import { get, set } from 'idb-keyval';


export async function getDirectoryHandle() {
    let directoryHandle = await get('configDirectoryHandle');
    // no handle --> store the handle
    if (!directoryHandle) {
        directoryHandle = await window.showDirectoryPicker();
        await set('configDirectoryHandle', directoryHandle);
    }
    const options = { mode: 'readwrite' };
    const permission = await directoryHandle.queryPermission(options);
    console.log("has permission??", permission)
    if (permission !== 'granted') {
        const permissionGranted = await directoryHandle.requestPermission(options);
        if (permissionGranted !== 'granted') {
            throw new Error('Read-write access not granted.'); //return from decision
        }
    }
    return directoryHandle;
}

export async function fetchAndCompareConfig(webAppHwUid) {
    console.log("Fetching and comparing config.json...");

    try {
        // Try to get the file handle from IndexedDB
        const fileHandle = await getFileHandle();
        
        // If there's no handle in IndexedDB, use the directory picker
        
        const file = await fileHandle.getFile();
        const text = await file.text();
        const config = JSON.parse(text);
        const deviceHwUid = config.global_info.HW_UID.value;
        if (deviceHwUid == webAppHwUid) {
            console.log('HW_UID matches.');
        } else {
            console.log('HW_UID does not match.');
        }

        return deviceHwUid;
        
    } catch (error) {
        console.error('Error fetching and comparing config:', error);
        return false;
    }
}

export async function getFileHandle() {
    let fileHandle = await get('configFileHandle');

    if (fileHandle) {
        const permission = await verifyPermission(fileHandle, true);
        if (permission) {
            return fileHandle;
        } else {
            const directoryHandle = await getDirectoryHandle();
            fileHandle = await directoryHandle.getFileHandle('config.json', { create: true });
            await set('configFileHandle', fileHandle);
            return fileHandle;
        }
    }

    const directoryHandle = await getDirectoryHandle();
    fileHandle = await directoryHandle.getFileHandle('config.json', { create: true });
    await set('configFileHandle', fileHandle);
    const permission = await verifyPermission(fileHandle, true);
    if (permission) {
        return fileHandle;
    } else {
        throw new Error('Permission to read the file was not granted.');
    }    
}

export async function overwriteConfigFile(newConfig) {
    try {
        // check if we have a file handle
        const fileHandle = await getFileHandle();

        // overwrite config
        const writable = await fileHandle.createWritable();
        await writable.write(new Blob([JSON.stringify(newConfig, null, 2)], { type: 'application/json' }));
        await writable.close();

        console.log('Config file overwritten and handle stored successfully.');
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

async function verifyPermission(fileHandle, readWrite) {
    const options = {};
    if (readWrite) {
        options.mode = 'readwrite';
    }
    // alredy permission granted?
    const permission = await fileHandle.queryPermission(options);
    // permission granted --> true
    if (permission === 'granted') {
        return true;
    }
    // permission not there --> request permission
    if (permission === 'denied' || permission === 'prompt') {
        return (await fileHandle.requestPermission(options)) === 'granted';
    }
    return false;
}