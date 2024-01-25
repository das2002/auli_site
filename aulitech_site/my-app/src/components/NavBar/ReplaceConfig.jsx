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
            // ... rest of the existing code ...
        } else {
            // Verify permission
            const hasPermission = await verifyPermission(fileHandle, false);
            if (!hasPermission) {
                throw new Error('Permission to read the file was not granted.');
            }

            // Use the file handle to read the file
            const file = await fileHandle.getFile();
            // ... rest of the existing code ...
        }
    } catch (error) {
        console.error('Error fetching and comparing config:', error);
        return false;
    }
}

export async function overwriteConfigFile(newConfig) {
    try {
        const directoryHandle = await getDirectoryHandle();

        // handle config.json
        const fileHandle = await directoryHandle.getFileHandle('config.json', { create: true });

        // store in indexedDB
        await set('configFileHandle', fileHandle);

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
