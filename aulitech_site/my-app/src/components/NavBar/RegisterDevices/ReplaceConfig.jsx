import { get, set, entries } from 'idb-keyval';

export async function getDirectoryHandle() {

    console.log("Getting directory handle...");

    try {
        let directoryHandle = await get('configDirectoryHandle');
        if (!directoryHandle) {
            directoryHandle = await window.showDirectoryPicker();
            await set('configDirectoryHandle', directoryHandle);
        }
        const permission = await verifyPermission(directoryHandle, true);
        if (permission) {
            return directoryHandle;
        } else {
            throw new Error('Permission to read the directory was not granted.');
        }
    } catch (error) {
        console.error('Error getting directory handle:', error);
        return false;
    }
}

export async function fetchAndCompareConfig(webAppHwUid) {
    console.log("Fetching and comparing config.json...");

    entries().then((entries) => console.log(entries));

    try {
        const fileHandle = await getFileHandle();
        if (!fileHandle) {
            throw new Error('No file handle found.');
        }
        
        // If there's no handle in IndexedDB, use the directory picker
        let file = null;
        try {
            file = await fileHandle.getFile();    
        } catch (error) {
            if (error instanceof DOMException || error instanceof TypeError) {
                let directoryHandle = await window.showDirectoryPicker();

                if (!directoryHandle) {
                    throw new Error('No directory handle found.');
                }

                await set('configDirectoryHandle', directoryHandle);
                const permissionStatus = await verifyPermission(directoryHandle, true);
                if (!permissionStatus) {
                    throw new Error('Permission to read the directory was not granted.');
                }
                fileHandle = await directoryHandle.getFileHandle('config.json', { create: true });
                await set('configFileHandle', fileHandle);
                file = await fileHandle.getFile();
            } else {
                throw error;
            }
        }

        const text = await file.text();
        const config = JSON.parse(text);
        const deviceHwUid = config.global_info.HW_UID.value;
        if (deviceHwUid == webAppHwUid) {
            console.log('HW_UID matches.');
            return deviceHwUid;
        } else {
            console.log('HW_UID does not match.');
            return null;
        }

    } catch (error) {
        console.error('Error fetching and comparing config:', error);
        return false;
    }
}

export async function getFileHandle() {

    console.log("Getting file handle...");

    try {
        let fileHandle = await get('configFileHandle');
        if (!fileHandle) {
            console.log("have to request file handle");
            let directoryHandle = await getDirectoryHandle();
            try {
                fileHandle = await directoryHandle.getFileHandle('config.json', { create: true });
                await set('configFileHandle', fileHandle);
            } catch (error) {
                console.error('Error getting file handle:', error);
                if (error instanceof DOMException) {
                    directoryHandle = await window.showDirectoryPicker();
                    await set('configDirectoryHandle', directoryHandle);
                    const permissionStatus = await verifyPermission(directoryHandle, true);
                    if (!permissionStatus) {
                        throw new Error('Permission to read the directory was not granted.');
                    }
                    fileHandle = await directoryHandle.getFileHandle('config.json', { create: true });
                    await set('configFileHandle', fileHandle);
                } else {
                    return false;
                }
            }
        }
        const permission = await verifyPermission(fileHandle, true);
        if (permission) {
            return fileHandle;
        } else {
            throw new Error('Permission to read the file was not granted.');
        }
    } catch (error) {
        console.error('Error getting file handle:', error);
        return false;
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

    const permission = await fileHandle.queryPermission(options);

    if (permission === 'granted') {
        return true;
    }
    if (permission === 'denied' || permission === 'prompt') {
        return (await fileHandle.requestPermission(options)) === 'granted';
    }
    return false;
}
