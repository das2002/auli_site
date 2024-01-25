import { get, set } from 'idb-keyval';

export async function getDirectoryHandle() {
    let directoryHandle = await get('configDirectoryHandle');

    const hasPermission = await verifyPermission(directoryHandle, true);
    if (!hasPermission) {
        throw new Error('Read-write access not granted.');
    }

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
        // Try to get the file handle from IndexedDB
        const fileHandle = await get('configFileHandle');
        
        // If there's no handle in IndexedDB, use the directory picker
        if (!fileHandle) {
            const directoryHandle = await getDirectoryHandle();
            // request + store in indexedDB
            if (!directoryHandle) {
                directoryHandle = await window.showDirectoryPicker();
                await set('configDirectoryHandle', directoryHandle);
            }
            const permissionStatus = await directoryHandle.requestPermission({ mode: 'readwrite' });
            if (permissionStatus !== 'granted') {
                throw new Error('Permission to access directory not granted.');
            }
            const fileHandle = await directoryHandle.getFileHandle('config.json', { create: true });
            await set('configFileHandle', fileHandle);
            const file = await fileHandle.getFile();
            const text = await file.text();
            const config = JSON.parse(text);
            const deviceHwUid = config.global_info.HW_UID.value;
            if (deviceHwUid == webAppHwUid) {
                console.log('HW_UID matches.');
            } else {
                console.log('HW_UID does not match.');
            }

            // return hw_uid
            return deviceHwUid;

        } else {
            // Verify permission
            const hasPermission = await verifyPermission(fileHandle, false);
            if (!hasPermission) {
                throw new Error('Permission to read the file was not granted.');
            }

            // Use the file handle to read the file
            const file = await fileHandle.getFile();
            const text = await file.text();
            const config = JSON.parse(text);
            const deviceHwUid = config.global_info.HW_UID.value;
            if (deviceHwUid === webAppHwUid) {
                console.log('HW_UID matches.');
            } else {
                console.log('HW_UID does not match.');
            }
    
            // return hw_uid
            return deviceHwUid; 
        }
    } catch (error) {
        console.error('Error fetching and comparing config:', error);
        return false;
    }
}

export async function getFileHandle() {
    let fileHandle = await get('configFileHandle');
    const hasPermission = await verifyPermission(fileHandle, true);
    if (!hasPermission) {
        throw new Error('Read-write access not granted.');
    }

    // Check if we already have a handle with the required permissions
    if (fileHandle) {
        const permissions = await fileHandle.queryPermission({ mode: 'readwrite' });
        if (permissions === 'granted') {
            return fileHandle;
        } else {
            // If no handle or insufficient permissions, request directory picker
            // This implicitly requests read-write access
            const directoryHandle = await getDirectoryHandle();
            fileHandle = await directoryHandle.getFileHandle('config.json', { create: true });
            
            // Check and request permissions if necessary
            const permissionStatus = await fileHandle.queryPermission({ mode: 'readwrite' });
            if (permissionStatus !== 'granted') {
                const permissionGranted = await fileHandle.requestPermission({ mode: 'readwrite' });
                if (permissionGranted !== 'granted') {
                    throw new Error('Read-write access not granted.');
                }
            }

            // Store the handle for future use
            await set('configFileHandle', fileHandle);
            return fileHandle;
        }
    } else {
        // If no handle or insufficient permissions, request directory picker
        // This implicitly requests read-write access
        const directoryHandle = await getDirectoryHandle();
        fileHandle = await directoryHandle.getFileHandle('config.json', { create: true });
        
        // Check and request permissions if necessary
        const permissionStatus = await fileHandle.queryPermission({ mode: 'readwrite' });
        if (permissionStatus !== 'granted') {
            const permissionGranted = await fileHandle.requestPermission({ mode: 'readwrite' });
            if (permissionGranted !== 'granted') {
                throw new Error('Read-write access not granted.');
            }
        }

        // Store the handle for future use
        await set('configFileHandle', fileHandle);
        return fileHandle;
    }
}

export async function overwriteConfigFile(newConfig) {
    try {
        // check if we have a file handle
        let fileHandle = await get('configFileHandle');

        if (!fileHandle) {
            const directoryHandle = await getDirectoryHandle();
            fileHandle = await directoryHandle.getFileHandle('config.json', { create: true });
            await set('configFileHandle', fileHandle);
        }

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
    // permission granted? --> true
    if ((await fileHandle.queryPermission(options)) === 'granted') {
        return true;
    }
    // user grants permission --> also true
    if ((await fileHandle.requestPermission(options)) === 'granted') {
        return true;
    }
    return false;
}
