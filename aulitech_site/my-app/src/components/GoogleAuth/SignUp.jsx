import React, { useState } from "react";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import StoreRegisterData from "../CloudFirestore/StoreRegisterData";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [err, setErr] = useState(false);

  const navigate = useNavigate();

  /* Create a user account and document in firebase auth and cloud firestore Users DB*/
  const signUp = (e) => {
    e.preventDefault();
    setErr(false);

    if (pass === confirmPass) {
      /* add user to firebase auth for website */
      createUserWithEmailAndPassword(auth, email, pass)
        .then((userCredential) => {
          console.log("user credentials: ", userCredential);
          /* Send user data to User DB */
          StoreRegisterData(userCredential);
          /* Take user to Dashboard*/
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setErr(true);
    }
  };

// --------------------------------------------------------------------------------------------------------------------------------------------------

  /* Display title for form */
  const DisplayTitle = () => {
    return (
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create Account
        </h2>
      </div>
    );
  };

  /* Display email input box */
  const DisplayEmailInput = () => {
    return (
      <div>
        <label className="block text-sm font-medium leading-6 text-gray-900">
          Email address
        </label>
        <div className="mt-2">
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    );
  };

  /* If the passwords do not match and the user trys to create an account show error message */
  const DisplayPasswordErr = () => {
    return (
      <p className="font-semibold text-sm text-yellow-500">
        Passwords are not the same
      </p>
    );
  };

  /* Display password and cinfrm password inputs */
  const DisplayPasswordInputs = () => {
    return (
      <>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Password
          </label>
        </div>
        <div className="mt-2">
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            onChange={(e) => {
              setPass(e.target.value);
            }}
            className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Confirm Password
          </label>
        </div>
        <div className="mt-2">
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            onChange={(e) => {
              setConfirmPass(e.target.value);
            }}
            className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </>
    );
  };

  /* Display all inputs and button to create account */
  const DisplayForm = () => {
    return (
      <form className="space-y-6" onSubmit={signUp}>
        <DisplayEmailInput />
        <>
          {err ? <DisplayPasswordErr /> : null}
          <DisplayPasswordInputs />
        </>

        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          Create Account
        </button>
      </form>
    );
  };

  /* Display link to sign in pg for if user already has an account*/
  const DisplayGoSignIn = () => {
    <p className="mt-10 text-center text-sm text-gray-500">
      Already have an accoount?{" "}
      <Link
        to="/"
        className="font-semibold leading-6 text-blue-500 hover:text-blue-400"
      >
        Sign In
      </Link>
    </p>;
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <DisplayTitle />

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <DisplayForm />
        <DisplayGoSignIn />
      </div>
    </div>
  );
}
