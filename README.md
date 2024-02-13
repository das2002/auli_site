# AULI Site Deliverable

## Overview
This is the AULI Configuration Site. Users can configure their AULI devices using this site. The site is built using React. The site is host on Google Firebase.

## Prerequisites
- Node.js
- npm
- Firebase CLI

## Project Structure
```

├── auli_site
│   ├── aulitech_site
│   │   ├── my-app
│   │   │   ├── public
│   │   │   │   ├── images
            ├── src
                ├── bluetooth
                ├── components
                    ├── CatoSettings
                    ├── CloudFirestore
                    ├── Dashboard
                    ├── GoogleAuth
                    ├── NavBar
                        ├── cato_schemas
                        ├── configs
                        ├── DeviceSettings
                        ├── images
                        ├── PracticeMode
                        ├── RegisterDevices
                        ├── Navigation.jsx
                        ├── ProfilePg.jsx
                    ├── RecordGests
                    ├── UpdatePage
                ├── images
                ├── junk
                ├── resources
        ├── node_modules

```

## Installation
1. Clone the repository
2. cd into auli_site/aulitech_site/my-app
3. Run `npm install --force` to install the dependencies
4. Run `npm start` to start the development server

## Firebase Deployment
1. cd into auli_site/aulitech_site/my-app
2. Run `npm run build` to build the project
3. Run `firebase deploy` to deploy the project to Firebase

## GitHub Deployment on Merge
If you make any changes on the main branch, the changes will be automatically deployed to Firebase using GitHub Actions.
1. Create a pull request
2. Merge the pull request to main
3. The changes will be automatically deployed to Firebase

## Code Walkthrough
The React project for this site is located in auli_site/aulitech_site/my-app

### Components
The components for the site are located in auli_site/aulitech_site/my-app/src/components
- Landing Page
    - The code for the landing page is located in the App.js file in the onRenderDisplays function
- Login Flow
    - The code for the login flow is located in the App.js file
        - The login flow for Google authorization is handled by the handleGoogleLogin function
        - The login flow for email and password authorization is handled by the submitEmailLogin function
- Device Registration
    - The code for device registration is located in src/components/NavBar/RegisterDevices/RegisterCatoDevice.jsx.
        - Device Registration Flow:
            - Check if the device that is being registered is already registered to the user
                - If the device is already registered, then the flow will abort.
                - If the device is not registered, then the user can register the device.
            - The app will then pull the config off the user's device and then pull the existing data from the device.
                - if the config is missing fields, then then the app will fill in the missing fields with default values.
            - The app will upload the data pulled from config to firebase for this device and create a new device in the user's device list.
        - fetchAndCompareConfig()
            - This function checks if the device is already registered to the user. If this device is not registered to the user, then the user can register the device.

-   Device Settings
    - The code for device settings editing is stored in src/components/NavBar/DeviceSettings/Devices.jsx
        - The user can edit the device settings and save the changes to the device.
        - The user can also delete the device from their device list.
        - Each of the connections have their own Connection Accordion in which we nest the settings for that connection for its current operation mode. Any changes made to the settings will be saved to the webapp for the duration of that session. The changes will not be saved to the device or pushed to Firebase until the user clicks the save button.
        
    - Register Connection
        - On the Device settings page for a device, you can register a new connection, which takes the user to a separate page to register a new connection. The user can select the connection type. The user can then save the connection to the device.
        - The code for registering a new connection is located in src/components/NavBar/RegisterDevices/RegisterInterface.jsx
        - The user can select the connection type and save the connection to the device. After the user hits save on the connection registration page, the connection is saved to firebase (not device yet). User can then hit save on the Device Settings page to save the connection to the device.

    -   Practice Mode
        - The code for practice mode is located in src/components/NavBar/PracticeMode/Practice.jsx
        - The user can select the device to practice with by toggling Practice Mode on the Navigation Bar toggle for that device. The user can edit settings for the practice mode for that device and then start practice mode by clicking on "Start Practice." The user can then practice with the device and then stop practice mode by clicking on "Finish Practice."

- Updates
    - The code for updating the site is located in src/components/NavBar/UpdatePage/Updates.jsx
    - The user can get the release.zip for an update and then drag and drop the release contents to their device to update the device.
    - The releases are pulled from the Firebase Storage for the releases and displayed on the site.
    - To add a release to the site, the site admin can:
        - Go to the releases folder in the Firebase Storage
        - create a new folder with the release version number
        - upload the release.zip to the folder as 'release.zip'
        - upload the release description as a Markdown file to the folder as 'description'
        - In Updates.jsx, within the releasesMetadata array, add a new object with the release version number, the path to the release description, and the path to the release.zip.


