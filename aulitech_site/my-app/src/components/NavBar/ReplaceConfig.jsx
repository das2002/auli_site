import { get, set } from 'idb-keyval';

export async function fetchAndCompareConfig(webAppHwUid) {
    console.log("Fetching and comparing config.json...");

    try {
        // check existing directories
        let directoryHandle = await get('configDirectoryHandle');

        // request + store in indexedDB
        if (!directoryHandle) {
            directoryHandle = await window.showDirectoryPicker();
            await set('configDirectoryHandle', directoryHandle);
        }

        // get r/w access
        const permissionStatus = await directoryHandle.requestPermission({ mode: 'readwrite' });
        if (permissionStatus !== 'granted') {
            throw new Error('Permission to access directory not granted.');
        }

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
        } else {
            console.log('HW_UID does not match.');
        }

        // return hw_uid
        return deviceHwUid;
    } catch (error) {
        console.error('Error fetching and comparing config:', error);
        return null;
    }
}

export async function overwriteConfigFile(newConfig) {
    try {
        let directoryHandle = await get('configDirectoryHandle');

        if (!directoryHandle) {
            directoryHandle = await window.showDirectoryPicker();
            await set('configDirectoryHandle', directoryHandle);
        }

        const permissionStatus = await directoryHandle.requestPermission({ mode: 'readwrite' });
        if (permissionStatus !== 'granted') {
            throw new Error('Permission to access directory not granted.');
        }

        // handle to the config.json file
        const fileHandle = await directoryHandle.getFileHandle('config.json', { create: false });

        // Create a writable stream to overwrite the existing config.json file
        let writable = await fileHandle.createWritable();
        await writable.write(new Blob([JSON.stringify(newConfig, null, 2)], { type: 'application/json' }));
        await writable.close();

        console.log('Config file overwritten successfully.');
    } catch (error) {
        console.error('Error overwriting config file:', error);
    }
}
