import { get, set } from 'idb-keyval';

export async function initGestureFile() {
    console.log("initGestureFile called");

    try {
        //check for an existing directory in IndexedDB
        let directoryHandle = await get('directoryHandle');

        //if no handle --> request & store it in IndexedDB
        if (!directoryHandle) {
            directoryHandle = await window.showDirectoryPicker();
            await set('directoryHandle', directoryHandle);
        }

        //check if user granted permission to r/w
        const permissionStatus = await directoryHandle.requestPermission({ mode: 'readwrite' });

        if (permissionStatus !== 'granted') {
            throw new Error('Permission to access directory not granted.');
        }

        //check of gesture.cato is there and if not create one
        const fileHandle = await directoryHandle.getFileHandle('gesture.cato', { create: true });
        console.log('Gesture file is ready.');

        const file = await fileHandle.getFile();
        //console debugging
        console.log(`Confirmed: 'gesture.cato' file is created or exists with size ${file.size} bytes.`);
    } catch (error) {
        console.error('Error initializing gesture file:', error);
    }
}
