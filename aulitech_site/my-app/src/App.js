import React, { useState, useEffect } from 'react';
import './App.css';
import { onAuthStateChanged, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase";
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";

import ProfilePg from './components/ProfilePage/ProfilePg';
import Navigation from './components/NavBar/Navigation';
import SignOutAccount from './components/GoogleAuth/SignOutAccount';
import ConfigureGestures from './components/RecordGests/ConfigureGestures';
import CatoSettings from './components/CatoSettings/CatoSettings';
import RegisterCatoDevice from './components/RegisterDevice/RegisterCatoDevice';
import { db } from "./firebase";
import { collection, query, getDocs, where, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import RecordGestures from './components/RecordGests/RecordGestures';
import Updates from './components/UpdatePage/Updates';
import Devices from './components/NavBar/Devices';
import Practice from './components/NavBar/Practice';
import RegisterInterface from './components/NavBar/RegisterInterface';

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import BindingsPanel from './components/NavBar/Bindings';
import { getFileHandle } from './components/NavBar/ReplaceConfig';



function App() {
  const [user, setUser] = useState('spinner');
  const [devices, setDevices] = useState([]);
  const [currIndex, setCurrIndex] = useState(-1);
  const [renderDevices, setRenderDevices] = useState(false);

  const [usbDevice, setUsbDevice] = useState(null);

  const [defaultRedirect, setDefaultRedirect] = useState("")

  // triggers email login/signup flow 
  const [isEmailLoginOpen, setIsEmailLoginOpen] = useState(false);
  const handleEmailLogin = () => {
    setIsLoginPopupOpen(true);
  };

  // directly opens email login popup
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const toggleLoginPopup = () => {
    setIsLoginPopupOpen(!isLoginPopupOpen);
  };

  // switches login popup to signup popup 
  const [isResetPasswordPopupOpen, setIsResetPasswordPopupOpen] = useState(false);
  const toggleReset = () => {
    setIsResetPasswordPopupOpen(!isResetPasswordPopupOpen);
  };

  // switches login popup to signup popup 
  const [isSignupPopupOpen, setIsSignupPopupOpen] = useState(false);
  const toggleSignupPopup = () => {
    setIsSignupPopupOpen(!isSignupPopupOpen);
  };

  // closes both 
  const handleCloseEmailPopups = () => {
    setIsLoginPopupOpen(false);
    setIsSignupPopupOpen(false);
  };

  const handleLoginToSignup = () => {
    setIsLoginPopupOpen(false);
    setIsSignupPopupOpen(true);
  };

  const handleSignupToLogin = () => {
    setIsLoginPopupOpen(true);
    setIsSignupPopupOpen(false);
  };


  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log(user);

      setIsLoginPopupOpen(false);
    } catch (error) {
      console.log("Error during Google sign-in:", error.message);
    }
  };

  const submitEmailLogin = async (email, password, setErrorMessage) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("Logged in", user);
        toggleLoginPopup(); // close the login popup
      })
      .catch((error) => {
        console.log("Error during account login:", error.message);
        setErrorMessage("Incorrect email or password. Please try again."); // Set custom error message
      });
  };


  const createEmailAccount = async (email, displayname, password, setErrorMessage) => {
    const auth = getAuth();

    // Regex for password validation
    // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{12,24}$/;
    const passwordRegex = /^.{8,}$/;

    if (!passwordRegex.test(password)) {
      setErrorMessage("Password must be 12-24 characters long and include at least one letter, one number, and one special character.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        user.displayName = displayname;
        user.email = email;
        console.log("Signed up", user);
        toggleSignupPopup(); // close the signup popup once signed up 
      })
      .catch((error) => {
        console.log("Error during account creation:", error.message);
        setErrorMessage(error.message); // Set Firebase error message
      });
  };


  // email and password flow login/signup
  const EmailLoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      submitEmailLogin(email, password, setErrorMessage);
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          className="email-login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="email-login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && (
          <div className="text-red-600 text-sm mt-1 mb-1">
            {errorMessage}
          </div>
        )}

        <div className="flex items-end justify-between gap-10">
          <button className="flex items-center justify-center text-white bg-accent hover:opacity-70 px-12 rounded-full h-12 decision-button">
            Log In
          </button>
          <div className="flex flex-col h-full text-right mb-1">
            <div>
              Don't have an account? {' '}
              <button
                onClick={handleLoginToSignup}
                style={{ color: 'blue', cursor: 'pointer' }}
                className="text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
              >
                Sign up
              </button>
            </div>
            <div>
              Forgot password? {' '}
              <button
                onClick={() => {
                  toggleReset();
                  toggleLoginPopup();
                }}
                style={{ color: 'blue', cursor: 'pointer' }}
                className="text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
              >
                Reset now
              </button>
            </div>
          </div>
        </div>



      </form>
    );
  };
  const EmailSignupForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayname, setName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      createEmailAccount(email, displayname, password, setErrorMessage);
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          type="name"
          placeholder="Enter Your Desired Display Name"
          required
          className="email-login-input"
          value={displayname}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter Your Email"
          required
          className="email-login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter a Password"
          required
          className="email-login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && (
          <div className="text-red-600 text-sm mt-2 mb-2">
            {errorMessage}
          </div>
        )}

        <div className="flex items-end justify-between gap-10">
          <button className="flex items-center justify-center text-white bg-accent hover:opacity-70 px-12 rounded-full h-12 decision-button">
            Sign Up
          </button>
          <p className="text-right mb-1">
            Already have an account? {' '}
            <button
              onClick={handleSignupToLogin}
              style={{ color: 'blue', cursor: 'pointer' }}
              className="text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </form>
    );
  };

  const PasswordResetRequestForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
      event.preventDefault();
      const auth = getAuth();
      sendPasswordResetEmail(auth, email)
        .then(() => {
          setMessage('Email Sent! Check your email for instructions on how to reset your password.');
        })
        .catch((error) => {
          // Handle Errors here.
          setMessage('Error: ' + error.message);
        });
    };

    return (
      <div className='z-50'>
        <form onSubmit={handleSubmit}>
          <label className='inline-block'>
            Please enter your email address. You will receive an email with a link to reset your password.
            <input className='mt-3' placeholder="Enter Your Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <button type="submit" className="flex items-center justify-center text-white bg-accent hover:opacity-70 px-12 rounded-full h-12 decision-button">
            Send
          </button>
        </form>
        {message && <p className='mt-2 text-red-500 font-light'>{message}</p>}
      </div>
    );
  }


  useEffect(() => {
    async function handleUserAuth() {
      const userListener = onAuthStateChanged(auth, async (user) => {
        if (user) {
          await ensureUserDocumentExists(user);
          const configData = await fetchUserCatos(user);
          if (configData && configData.length > 0) {
            const firstDevice = configData[0];
            setDefaultRedirect(`/devices/${firstDevice.data.device_info.device_nickname}`)
          }
          else {
            setDefaultRedirect(`/register-cato-device`)
          }

          setUser(user);
          setDevices(configData);
        } else {
          setUser(null);
        }
      });

      // Cleanup function to unsubscribe from the listener
      return () => userListener();
    }

    async function ensureUserDocumentExists(user) {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          email: user.email,
          displayname: user.displayName || 'Anonymous',
          uid: user.uid
        });
      }
    }

    async function fetchUserCatos(user) {
      const colRef = collection(db, "users", user.uid, "userCatos");
      const querySnapshot = await getDocs(colRef);
      return querySnapshot.docs
        .filter(doc => doc.id !== 'defaultDoc') // Exclude 'defaultDoc'
        .map(doc => ({
          id: doc.id,
          data: doc.data(),
          current: false,
        }));
    }

    handleUserAuth();
  }, [renderDevices]);


  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const handleRenderDevices = (num) => {
    setRenderDevices(renderDevices + num);
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
    } else if (user === null) { // login page
      return (
        <div className="login-container">
          <div className="flex gap-4 flex-col items-center justify-center min-h-screen bg-#181616">
            <h1>MyCato - Configuration Utility</h1>

            <div className="flex gap-24">
              <button
                onClick={handleGoogleLogin}
                className="google-login-button"
                style={{ width: '190px', height: '45px' }}
              >
                <FcGoogle className="text-xl" />
                <span className="text-sm font-medium">
                  Continue with Google
                </span>
              </button>
              <button
                onClick={handleEmailLogin}
                className="google-login-button"
                style={{ width: '190px', height: '45px' }}
              >
                <span className="text-sm font-medium">
                  Continue with Email
                </span>
              </button>
            </div>

          </div>
        </div>
      );
    } else { // main page
      if (typeof devices === 'undefined' || devices == []) { //don't do 3 equal signs --> "default" gets created
        return (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 animate-spin">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </>
        )
      } else {

        const checkDeviceStatusWithoutToggle = async () => {
          console.log('Checking device status...');
          try {
            let fileHandle = await getFileHandle();
            if (!fileHandle) {
              throw new Error('No file handle found.');
            }
            const file = await fileHandle.getFile();
            const text = await file.text();
            const config = JSON.parse(text);
            setUsbDevice(config.global_info.HW_UID.value);
          } catch (error) {
            console.error('Error checking device status:', error);
            setUsbDevice(null);
          }
        }

        checkDeviceStatusWithoutToggle();


        return (
          <>
            <Navigation user={user} classNames={classNames} devices={devices} currIndex={currIndex} connectedDevice={usbDevice} />
            {/* This should be the only main tag */}
            <main id='main' className="py-10 lg:pl-72">
              <div className="px-4 sm:px-6 lg:px-8" >
                <Routes>
                  {/* <Route exact path="/" element={<Dashboard classNames={classNames} user={user} devices={devices} />}/>
            {console.log(devices)} */}
                  {/* <Route path="/dashboard" element={<Dashboard classNames={classNames} user={user} devices={devices}/>}/> */}
                  <Route path="/profile" element={<ProfilePg user={user} />} />
                  <Route path="/cato-settings" element={<CatoSettings classNames={classNames} user={user} devices={devices} currIndex={currIndex} />} />
                  <Route path="/" element={<Navigate replace to={defaultRedirect} />} />
                  <Route path="/register-cato-device" element={<RegisterCatoDevice user={user} devices={devices} handleRenderDevices={handleRenderDevices} classNames={classNames} />} />
                  <Route path="/register-interface" element={<RegisterInterface user={user} />} />
                  <Route path="/record-gestures" element={<ConfigureGestures classNames={classNames} user={user} />} />
                  <Route path="/record" element={<RecordGestures />} />
                  <Route path="/sign-out" element={<SignOutAccount />} />
                  <Route path="/record-gestures" element={<RecordGestures />} />
                  <Route path="/updates" element={<Updates />} />
                  <Route path="/devices/:deviceName" element={<Devices devices={devices} />} />
                  <Route path='/devices/:deviceName/bindings' element={<BindingsPanel user={user} devices={devices} currIndex={currIndex} />} />
                  <Route path="/devices/:deviceName/register-interface" element={<RegisterInterface user={user} devices={devices} />} />
                  <Route path="/devices/:deviceName/practice" element={<Practice user={user} devices={devices} />} />
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
      {user === null && (
        <div className="flex w-full items-center justify-center z-50 transition px-6 bg-gradient-to-b from-[rgb(0,0,0,0.7)] to-transparent fixed top-0 h-landingNavigationBar">
          <div className="flex w-full items-center justify-center z-50 transition px-6 bg-gradient-to-b from-[rgb(0,0,0,0.7)] to-transparent fixed top-0 h-landingNavigationBar">
            <div className="text-white py-2 w-full grid grid-cols-3 max-w-5xl h-landingNavigationBar max-md:flex max-md:flex-row max-md:justify-between">
              <div className="flex flex-row items-center gap-2 cursor-pointer active:opacity-75 transition-all text-light-text-primary dark:text-dark-text-primary">
                <img src="./images/fulllogo_transparent_nobuffer.png" alt="CATO Logo" style={{ width: '180px', height: 'auto' }} />
              </div>

              <div className="flex flex-row w-full justify-center max-md:hidden">
                <div className="flex flex-row">
                  <div className="flex flex-row">
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      <BrowserRouter>
        <OnRenderDisplays />
      </BrowserRouter>
      {isResetPasswordPopupOpen && <div className="simple-popup z-50">
        <div className="flex items-start justify-between w-full px-3 py-3 border-b border-light-divider dark:border-dark-divider">
          <h3 className="text-base font-medium text-light-text-primary dark:text-dark-text-primary pl-3">Reset Password</h3>
          <button
            type="button"
            className="popup-close-button"
            onClick={() => {
              toggleReset();
              toggleLoginPopup();
            }}

          >
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 rotate-45"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        <div className="email-login-content flex flex-col items-center justify-center p-0 gap-0">
          <PasswordResetRequestForm />
        </div>
      </div>}

      {isLoginPopupOpen && (
        <div className="simple-popup z-0">
          <div className="flex items-start justify-between w-full px-3 py-3 border-b border-light-divider dark:border-dark-divider">
            <h3 className="text-base font-medium text-light-text-primary dark:text-dark-text-primary pl-3">Log In</h3>
            <button
              type="button"
              className="popup-close-button"
              onClick={toggleLoginPopup}
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 rotate-45"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>

          <div className="email-login-content flex flex-col items-center justify-center p-0 gap-0">
            <EmailLoginForm />
          </div>
        </div>
      )}

      {isSignupPopupOpen && (
        <div className="simple-popup">
          <div className="flex items-start justify-between w-full px-3 py-3 border-b border-light-divider dark:border-dark-divider">
            <h3 className="text-base font-medium text-light-text-primary dark:text-dark-text-primary pl-3">Sign Up</h3>
            <button
              type="button"
              className="popup-close-button"
              onClick={toggleSignupPopup}
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 rotate-45"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>

          <div className="email-login-content flex flex-col items-center justify-center p-0 gap-0">
            <EmailSignupForm />
          </div>
        </div>
      )}

    </div>
  );
}

export default App;