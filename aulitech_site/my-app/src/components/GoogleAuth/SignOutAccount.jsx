import React from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";


const SignOutAccount = () => {
  const navigate = useNavigate();
  
  const userSignOut = () => {
    signOut(auth).then(() => {
      console.log('signed out successfully');
      navigate('/')
    })
    .catch((error) => {
      console.log("userSignOut error:", error)
    })
  }

  return (
    <>
      <button 
        onClick={userSignOut}
        type="button"
        className="inline-flex rounded-full items-center bg-blue-500 px-2.5 py-1 text-lg font-semibold text-white disabled:bg-gray-200 disabled:cursor-not-allowed hover:bg-blue-300"
      >   
        Sign Out
      </button>
    </>
  )
}

export default SignOutAccount;