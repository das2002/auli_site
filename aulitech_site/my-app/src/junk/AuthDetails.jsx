import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AuthPg from "./AuthPg";


const AuthDetails = () => {
  const [authUser, setAuthUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if(user) {
        setAuthUser(user);
        setShowAuth(false);
      } else {
        setAuthUser(null);
      }
    });

    // return removes listener
    return () => {
      listen();
    }
  }, []);


  const userSignOut = () => {
    signOut(auth).then(() => {
      console.log('signed out successfully');
      setDisabled(false);
    })
    .catch((error) => {
      console.log("userSignOut error:", error)
    })
  }

  const doShow = () => {
    setShowAuth(true);
    setDisabled(true);
  }
  return (
    <div className="auth-details-container">
      {authUser ? 
        <>
          <button 
            onClick={userSignOut}
            type="button"
            className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Sign Out
          </button>
          <p>Signed in as {authUser.email}</p>
        </> 
      :
        <>
          {!disabled ? <button onClick={doShow}>Login</button> : null}
        </>}
      <div>
        { showAuth ? <AuthPg/> : null }
      </div>
    </div>
  )
}

export default AuthDetails;