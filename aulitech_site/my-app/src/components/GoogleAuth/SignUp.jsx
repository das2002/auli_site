import React, { useState } from "react";
import { auth } from '../../firebase'
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const signUp = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, pass)
            .then((userCredential) => {
                console.log(userCredential);
            }) 
            .catch((error) => {
                console.log(error);
            })
    }
    return(
        <>
        <form onSubmit={signUp}>
          <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow ">
            <div className="px-4 py-5 sm:px-6 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create Account</h1>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => {setEmail(e.target.value)}}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder=" Email"
                  />
                </div>
              </div>
  
              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={pass}
                    onChange={(e) => {setPass(e.target.value)}}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder=" Password"
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-4 sm:px-6 text-center">
            <button 
                type="submit"
                className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Register
              </button>
          </div>
        </div>
      </form>
    </>
)
}

export default SignUp;