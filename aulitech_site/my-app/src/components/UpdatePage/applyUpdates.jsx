import React from 'react';
import JSZip from 'jszip';
import { get, set } from 'idb-keyval';

async function handleFileSelection(event) {
    try {
        const file = event.target.files[0];
        if (!file) {
            throw new Error('No file selected');
        }

        const zipBlob = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(zipBlob);

        // previously selected directory
        let directoryHandle = await get('directoryHandle');
        if (!directoryHandle) {
            directoryHandle = await window.showDirectoryPicker();
            await set('directoryHandle', directoryHandle);
        }

        // iterate
        for (const fileName of Object.keys(zip.files)) {
            if (fileName === 'config.json') {
                // Skip config.json
                continue;
            }

            const fileData = await zip.files[fileName].async('blob');

            // overwrite existing files
            const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(fileData);
            await writable.close();
        }

        console.log('Update applied successfully, except config.json');
    } catch (error) {
        console.error('Error applying update:', error);
    }
}

export default function Updates() {
    return (
        <div>
            <input type="file" onChange={handleFileSelection} accept=".zip" />
            <p>Select the update ZIP file to apply updates.</p>
        </div>
    );
}

export async function applyUpdate(zipArrayBuffer) {
    try {
        const zip = await JSZip.loadAsync(zipArrayBuffer);

        const directoryHandle = await window.showDirectoryPicker();

        // iterate each file inside zip
        for (const fileName of Object.keys(zip.files)) {
            if (fileName === 'config.json') {
                // skip config.json
                continue;
            }

            const fileData = await zip.files[fileName].async('blob');

            // overwrite existing files
            const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(fileData);
            console.log("Updates overwritten!")
            await writable.close();
        }

        console.log('Update applied successfully, except config.json');
    } catch (error) {
        console.error('Error applying update:', error);
    }
}

