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

        // Create a temporary file to write the new configuration
        const tempFileHandle = await directoryHandle.getFileHandle('temp_config.json', { create: true });
        let writable = await tempFileHandle.createWritable();
        await writable.write(new Blob([JSON.stringify(newConfig, null, 2)], { type: 'application/json' }));
        await writable.close();

        // Check if config.json exists and delete it
        try {
            await directoryHandle.removeEntry('config.json');
        } catch (error) {
            console.log('No existing config.json to delete:', error);
        }

        // Rename the temporary file to config.json
        await directoryHandle.renameEntry('temp_config.json', 'config.json');

        console.log('Config file overwritten successfully.');
    } catch (error) {
        console.error('Error overwriting config file:', error);
    }
}


export async function deleteConfigFileIfExists() {
    try {
        let directoryHandle = await get('configDirectoryHandle');

        if (!directoryHandle) {
            return false;
        }

        const permissionStatus = await directoryHandle.requestPermission({ mode: 'readwrite' });
        if (permissionStatus !== 'granted') {
            throw new Error('Permission to access directory not granted.');
        }

        // Check if config.json exists and delete it
        try {
            const fileHandle = await directoryHandle.getFileHandle('config.json', { create: false });
            await directoryHandle.removeEntry('config.json');
            console.log('Existing config file deleted successfully.');
            return true;
        } catch (error) {
            console.log('No existing config file to delete:', error);
            return false;
        }
    } catch (error) {
        console.error('Error in deleting config file:', error);
        return false;
    }
}
