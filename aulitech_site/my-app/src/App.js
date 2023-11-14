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
import RegisterCatoDevice from './components/RegisterDevice/RegisterCatoDevice';
import { db } from "./firebase";
import { collection, query, getDocs, where } from "firebase/firestore";
import RecordGestures from './components/RecordGests/RecordGestures';


function App() {
  const [user, setUser] = useState('spinner');
  const [devices, setDevices] = useState([]);
  const [currIndex, setCurrIndex] = useState(-1);
  const [renderDevices, setRenderDevices] = useState(false);

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
              // jsondata: JSON.parse(doc.data().configjson),
              // keysinfo: Object.keys(JSON.parse(doc.data().configjson)),
              // valuesinfo: Object.values(JSON.parse(doc.data().configjson)),
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
  }, [renderDevices]);

  

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  // const handleDevices = (catoArr) => {
  //   setDevices(catoArr);
  // }

  const handleRenderDevices = (num) => {
    setRenderDevices(renderDevices + num);
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

  const OnRenderDisplays = () => {
    if (user === 'spinner') {
      return (
        <div className="grid grid-cols-1 place-items-center h-full">
          {/* <div clasName="p-10">
            <div className="pb-10 flex justify-between">
              <Logo height={10} marginY={0} marginX={0}/>
              <h2 className="text-xl font-bold leading-7 my-auto pl-2.5 text-white sm:truncate sm:text-2xl sm:tracking-tight">
                My Cato
              </h2>
            </div> */}
            <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-20 h-20 mx-auto motion-safe:animate-spin text-gray-900"
        >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
          {/* </div> */}
        </div>
      )
    } else if (user === null){

      return (
        <>
          <Routes>
            <Route path='/' element={<SignIn></SignIn>}/>
            <Route path="/sign-in" element={<SignIn/>}/>
            <Route path="/sign-up" element={<SignUp/>}/>
          </Routes>

        </>
      )
    } else {
      if(typeof devices === 'undefined' || devices === []) {
        return (
          <>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 animate-spin">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          </>
        )
      } else {
        return (
          <>
      <Navigation user={user} classNames={classNames} devices={devices} currIndex={currIndex} handleCurr={handleCurr}/>
      <main className="py-10 lg:pl-72">
        <div className="px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route exact path="/" element={<Dashboard classNames={classNames} user={user} devices={devices} />}/>
            {/* <Route path="/dashboard" element={<Dashboard classNames={classNames} user={user} devices={devices}/>}/> */}
            <Route path="/profile" element={<ProfilePg user={user}/>}/>
            <Route path="/cato-settings" element={<CatoSettings classNames={classNames} user={user} devices={devices} currIndex={currIndex}/>}/>
            <Route path="/register-cato-device" element={<RegisterCatoDevice user={user} devices={devices} handleRenderDevices={handleRenderDevices} classNames={classNames}/>}/>
            <Route path="/record-gestures" element={<ConfigureGestures classNames={classNames} user={user}/>}/>
            <Route path="/record" element={ <RecordGestures/> } />
            <Route path="/sign-out" element={<SignOutAccount/>}/>
            <Route path="/sign-in" element={<SignIn/>}/>
            <Route path="/sign-up" element={<SignUp/>}/>
          </Routes>
        </div>
      </main>
     </>
        )
      }
    }
  }

  return (
    <div className="h-screen">
      <BrowserRouter>
        <OnRenderDisplays/>
      </BrowserRouter>
    </div>
  )
}

export default App;

    //   {user === null ? 
    //   <>
    //     <Routes>
    //       <Route path="/sign-in" element={<SignIn/>}/>
    //       <Route path="/sign-up" element={<SignUp/>}/>
    //     </Routes>
    //     <SignIn/>
    //   </>
    //   :
    //   devices === undefined || devices === [] ?
    //     <>
    //       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 animate-spin">
    //         <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    //       </svg>
    //     </>
    //   :
    //   <>
    //   <Navigation user={user} classNames={classNames} devices={devices} currIndex={currIndex} handleCurr={handleCurr}/>
    //   <main className="py-10 lg:pl-72">
    //     <div className="px-4 sm:px-6 lg:px-8">
    //       <Routes>
    //         <Route exact path="/" element={<Dashboard classNames={classNames} user={user} devices={devices} />}/>
    //         {/* <Route path="/dashboard" element={<Dashboard classNames={classNames} user={user} devices={devices}/>}/> */}
    //         <Route path="/profile" element={<ProfilePg user={user}/>}/>
    //         <Route path="/cato-settings" element={<CatoSettings classNames={classNames} user={user} devices={devices} currIndex={currIndex}/>}/>
    //         <Route path="/register-cato-device" element={<RegisterCatoDevice user={user} devices={devices} handleDeviceCount={handleDeviceCount} classNames={classNames}/>}/>
    //         <Route path="/record-gestures" element={<ConfigureGestures classNames={classNames} user={user}/>}/>
    //         <Route path="/record" element={ <RecordGestures/> } />
    //         <Route path="/sign-out" element={<SignOutAccount/>}/>
    //         {/* <Route path="/sign-in" element={<SignIn/>}/> */}
    //         <Route path="/sign-up" element={<SignUp/>}/>
    //       </Routes>
    //     </div>
    //   </main>
    //  </>
    // }
