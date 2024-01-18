import JSZip from 'jszip';
import { get, set } from 'idb-keyval';

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
            await writable.close();
        }

        console.log('Update applied successfully, except config.json');
    } catch (error) {
        console.error('Error applying update:', error);
    }
}

