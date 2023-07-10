import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { auth } from "../../firebase";
// import { signOut, onAuthStateChanged } from "firebase/auth";

const SignInBtn = ({user}) => {
  // const [btnLink, setBtnLink] = useState(null);
  // const [doSignOut, setDoSignOut] = useState(false);

  // const userSignOut = () => {
  //   signOut(auth).then(() => {
  //     console.log('signed out successfully');
  //   })
  //   .catch((error) => {
  //     console.log("userSignOut error:", error)
  //   })
  // }

  // const userSignInOut = () => {
  //   if(doSignOut) {
  //     userSignOut();
  //   }
  // }

  // useEffect(() => {
  //   const listen = onAuthStateChanged(auth, (user) => {
  //     if(user) {
  //        setDoSignOut(true);
  //        setBtnLink("/")
  //     } else {
  //        setDoSignOut(false);  
  //        setBtnLink("/sign-in")
  //     }
  //   });
  //   // return removes listener
  //   return () => {
  //     listen();
  //   }
  // }, []);

  return (
    <>
      <div className="flex-shrink-0">
        <Link to="/sign-in">
          <button
            type="button"
            className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Sign In
          </button>
        </Link>
      </div>
    </>
  )
}

export default SignInBtn;