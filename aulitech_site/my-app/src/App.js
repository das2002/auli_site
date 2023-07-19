import React, {useState, useEffect} from 'react';
import './App.css';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ProfilePg from './pages/ProfilePg';
import Navigation from './components/NavBar/Navigation';
import SignOutAccount from './components/GoogleAuth/SignOutAccount';
import SignIn from './components/GoogleAuth/SignIn';
import SignUp from './components/GoogleAuth/SignUp';
import ConfigureGesture from './components/RecordGestures/ConfigureGesture';
import Dashboard from './components/Dashboard/Dashboard';
import CatoSettings from './components/CatoSettings/CatoSettings';
import DeviceAccess from './components/RecordGestures/DeviceAccess';
import RegisterCatoDevice from './components/CatoSettings/RegisterCatoDevice';
import AuthPg from './junk/AuthPg';
import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { clear, get, set } from "idb-keyval";


function App() {
  const [user, setUser] = useState(null);
  const [devices, setDevices] = useState([]);
  const [currIndex, setCurrIndex] = useState(0);

  useEffect(() => {
            let configData = [];

    const listen = onAuthStateChanged(auth, async(user) => {
      if(user) {
        setUser(user);

        const colRef = collection(db, "users");
        const queryCol = query(collection(colRef, user.uid, "userCatos"));  
        const colSnap = await getDocs(queryCol);

        colSnap.forEach((doc) => {
          configData.push({
            id: doc.id,
            data: doc.data(),
            keysinfo: Object.keys(JSON.parse(doc.data().configjson)),
            valuesinfo: Object.values(JSON.parse(doc.data().configjson)),
            current: false,
          });
        });

        setDevices(configData);

      } else {
        setUser(null);
      }
    });
    // return removes listener
    return () => {
      listen();
    }
  }, []);

  

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const handleDevices = (catoArr) => {
    setDevices(catoArr);
  }

  const handleCurr = (device, index) => {

    devices.forEach((dev, i) => {
      if (index === i) {
        devices[index].current = true;
        setCurrIndex(index);
        console.log('true', devices[index].current);
      } else {
        devices[i].current = false;
        console.log('false', devices[i].current)
      }
    })
  }

  console.log(currIndex);

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
      <>
        <Navigation user={user} classNames={classNames} devices={devices} handleCurr={handleCurr} handleDevices={handleDevices}/>
        </>
      }
        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route exact path="/" element={<Dashboard classNames={classNames} user={user}/>}/>
              <Route path="/profile" element={<ProfilePg user={user}/>}/>
              <Route path="/configure-cato" element={<ConfigureGesture classNames={classNames} user={user}/>}/>
              <Route path="/cato-device-access" element={<DeviceAccess classNames={classNames}/>}/>
              <Route path="/cato-settings" element={<CatoSettings classNames={classNames} user={user}/>}/>
              <Route path="/register-cato-device" element={<RegisterCatoDevice user={user}/>}/>
              <Route path="/sign-out" element={<SignOutAccount/>}/>
              <Route path="/sign-in" element={<SignIn/>}/>
              <Route path="/sign-up" element={<SignUp/>}/>
            </Routes>
          </div>
        </main>

      </BrowserRouter>
    </div>
  )
}

export default App;
