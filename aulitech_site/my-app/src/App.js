import React, {useState, useEffect} from 'react';
import './App.css';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ProfilePg from './components/ProfilePage/ProfilePg';
import Navigation from './components/NavBar/Navigation';
import SignOutAccount from './components/GoogleAuth/SignOutAccount';
import SignIn from './components/GoogleAuth/SignIn';
import SignUp from './components/GoogleAuth/SignUp';
import ConfigureGestures from './components/RecordGests/ConfigureGestures';
import Dashboard from './components/Dashboard/Dashboard';
import CatoSettings from './components/CatoSettings/CatoSettings';
import RegisterCatoDevice from './components/CatoSettings/RegisterCatoDevice';
import { db } from "./firebase";
import { collection, query, getDocs, where } from "firebase/firestore";
import RecordGestures from './components/RecordGests/RecordGestures';



function App() {
  const [user, setUser] = useState(null);
  const [devices, setDevices] = useState([]);
  const [currIndex, setCurrIndex] = useState(-1);
  const [deviceCount, setDeviceCount] = useState(0);

  useEffect(() => {
    let configData = [];

    const listen = onAuthStateChanged(auth, async(user) => {
      if(user) {
        setUser(user);
        const colRef = collection(db, "users");

        const queryCol = query(collection(colRef, user.uid, "userCatos"));
        const colSnap = await getDocs(queryCol);

        const queryNew = query(
          collection(colRef, user.uid, "userCatos"),
          where("initialize", "==", "initializeUserCatosSubcollection")
        );
        const newSnap = await getDocs(queryNew);


        if (newSnap.docs.length !== 0) {
          console.log(newSnap.docs.length);
          newSnap.forEach((doc) => {
            console.log(doc.data());
          });
        } else {
          colSnap.forEach((doc) => {
            configData.push({
              id: doc.id,
              data: doc.data(),
              jsondata: JSON.parse(doc.data().configjson),
              keysinfo: Object.keys(JSON.parse(doc.data().configjson)),
              valuesinfo: Object.values(JSON.parse(doc.data().configjson)),
              current: false,
            });
          });
        }
        setDevices(configData);
        console.log(configData);
      } else {
        setUser(null);
      }
    });
    // return removes listener
    return () => {
      listen();
    }
  }, [deviceCount]);

  

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const handleDevices = (catoArr) => {
    setDevices(catoArr);
  }

  const handleDeviceCount = (count) => {
    setDeviceCount(deviceCount + count);
  }

  const handleCurr = (index, state) => {
    devices.forEach((dev, i) => {
      if (index === i) {
        devices[index].current = state;
        if(state) {
          setCurrIndex(index);
        }
      }
    })
  }


  return (
    <div className="h-screen">
    <BrowserRouter>
      {user === null ? 
      <>
        <Routes>
          <Route path="/sign-in" element={<SignIn/>}/>
          <Route path="/sign-up" element={<SignUp/>}/>
        </Routes>
        <SignIn/>
      </>
      :
      devices === undefined || devices === [] ?
        <>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 animate-spin">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </>
      :
      <>
      <Navigation user={user} classNames={classNames} devices={devices} currIndex={currIndex} handleCurr={handleCurr} handleDevices={handleDevices}/>
      <main className="py-10 lg:pl-72">
        <div className="px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route exact path="/" element={<Dashboard classNames={classNames} user={user} devices={devices} />}/>
            {/* <Route path="/dashboard" element={<Dashboard classNames={classNames} user={user} devices={devices}/>}/> */}
            <Route path="/profile" element={<ProfilePg user={user}/>}/>
            <Route path="/cato-settings/:cato" element={<CatoSettings classNames={classNames} user={user} devices={devices} currIndex={currIndex}/>}/>
            <Route path="/register-cato-device" element={<RegisterCatoDevice user={user} devices={devices} handleDeviceCount={handleDeviceCount} classNames={classNames}/>}/>
            <Route path="/record-gestures" element={<ConfigureGestures classNames={classNames} user={user}/>}/>
            <Route path="/record" element={ <RecordGestures/> } />
            <Route path="/sign-out" element={<SignOutAccount/>}/>
            {/* <Route path="/sign-in" element={<SignIn/>}/> */}
            <Route path="/sign-up" element={<SignUp/>}/>
          </Routes>
        </div>
      </main>
     </>
    }
      </BrowserRouter>
    </div>
  )
}

export default App;
