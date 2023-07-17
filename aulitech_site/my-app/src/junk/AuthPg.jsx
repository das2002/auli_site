import React, { useState } from "react";

import SignIn from "../components/GoogleAuth/SignIn";
import SignUp from "../components/GoogleAuth/SignUp";

const AuthPg = () => {
  const [register, setRegister] = useState(false);

  const handleRegister = () => {
    setRegister(!register);
  };

  return (
    <div className="object-center">
      {register ? (
        <>
          <SignUp />
          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an accoount?{" "}
            <button
              onClick={handleRegister}
              className="font-semibold leading-6 text-blue-500 hover:text-blue-400"
            >
              Sign In
            </button>
          </p>
        </>
      ) : (
        <>
          <SignIn />
          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an accoount?{" "}
            <button
              onClick={handleRegister}
              className="font-semibold leading-6 text-blue-500 hover:text-blue-400"
            >
              Sign Up
            </button>
          </p>
        </>
      )}

      {/* <br/>

      <div className="bg-gray-50 sm:rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">{ register ? "Already have an account?" : "Don't already have an account?" }</h3>
          <div className="mt-5">
            { register ?
              <button
                onClick={handleRegister}
                onKeyDown={() => {}}
                className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Login
              </button>
            :
              <button
                onClick={handleRegister}
                onKeyDown={() => {}}
                className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Create Account
              </button>
            }
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default AuthPg;
