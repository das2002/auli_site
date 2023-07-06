import React from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";


const SignOut = () => {
  const userSignOut = () => {
    signOut(auth).then(() => {
      console.log('signed out successfully');
    })
    .catch((error) => {
      console.log("userSignOut error:", error)
    })
  }

  return (
    <>
      <p>Sign Out</p>
      <button 
        onClick={userSignOut}
        type="button"
        className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >   
        Sign Out
      </button>
    </>
  )
}

export default SignOut;