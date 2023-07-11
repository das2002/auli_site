import React, {useState, useEffect} from 'react';
import './App.css';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";


import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AboutPg from './pages/AboutPg';
import CatoPg from './pages/CatoPg';
import HomePg from './pages/HomePg';
import PeriPg from './pages/PeriPg';
import ProfilePg from './pages/ProfilePg';
import Navigation from './components/NavBar/Navigation';
import AuthPg from './components/GoogleAuth/AuthPg';
import ConfigureCato from './components/ConfigureCato/Configure';
import SignOutAccount from './components/GoogleAuth/SignOutAccount';
import SignIn from './components/GoogleAuth/SignIn';
import SignUp from './components/GoogleAuth/SignUp';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if(user) {
        setUser(user);
      } else {
        setUser(user);
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

  return (
    <div className="h-screen">
    <BrowserRouter>
    <Navigation user={user} classNames={classNames}/>
      <Routes>
        <Route exact path="/" element={<HomePg classNames={classNames}/>}/>
        <Route path="/about" element={<AboutPg/>}/>
        <Route path="/cato" element={<CatoPg/>}/>
        <Route path="/peri" element={<PeriPg/>} />
        <Route path="/profile" element={<ProfilePg/>}/>
        <Route path="/user-auth" element={<AuthPg/>}/>
        <Route path="/configure-cato" element={<ConfigureCato classNames={classNames}/>}/>
        <Route path="/sign-out" element={<SignOutAccount/>}/>
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App;
