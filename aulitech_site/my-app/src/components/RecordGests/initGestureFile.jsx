import { get, set } from 'idb-keyval';
import { doc, updateDoc } from "firebase/firestore"; 
import { db } from "../../firebase";

let directoryHandle = null;

export async function initGestureFile() {
    console.log("initGestureFile called");

    try {
        directoryHandle = await get('directoryHandle');
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
        console.log(`Confirmed: 'gesture.cato' file is created. ${file.size} bytes.`);

    } catch (error) {
        console.error('Error initializing gesture file:', error);
    }
}

//check for flag.txt
export async function checkForFlagFile(callback) {
    try {
        if (!directoryHandle) {
            throw new Error('Directory handle not initialized');
        }
        //polling :(
        const checkFileExistence = async () => {
            try {
                await directoryHandle.getFileHandle('flag.txt');
                callback(true); //flagFileFound=true
            } catch {
                setTimeout(checkFileExistence, 1000);
            }
        };

        checkFileExistence();
    } catch (error) {
        console.error('Error checking for flag file:', error);
    }
}

export async function uploadLogToFirebase(gestureId, logText) {
    const gestureRef = doc(db, "gesture-data", gestureId);
    try {
      await updateDoc(gestureRef, {
        log: logText
      });
      console.log("Log updated successfully");
    } catch (error) {
      console.error("Error updating log:", error);
    }
  }
