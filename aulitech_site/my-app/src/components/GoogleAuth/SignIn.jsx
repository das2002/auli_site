import React, { useState } from "react";
import { auth } from '../../firebase'
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const SignIn = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const navigate = useNavigate();

    const signIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, pass)
            .then((userCredential) => {
              console.log(userCredential);
              navigate('/')
            }) 
            .catch((error) => {
              console.log(error);
            })
    }

    return(

            <>
        {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-white">
          <body class="h-full">
          ```
        */}
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign In
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={signIn}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    onChange={(e) => {setEmail(e.target.value)}}
                    className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  {/*<div className="text-sm">
                    <a href="#" className="font-semibold text-blue-500 hover:text-blue-400">
                      Forgot password?
                    </a>
                  </div>*/}
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    onChange={(e) => {setPass(e.target.value)}}
                    className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  Sign In
                </button>
              </div>
            </form>
  
            <p className="mt-10 text-center text-sm text-gray-500">
              Don't have an accoount?{' '}
              <Link to="/sign-up" className="font-semibold leading-6 text-blue-500 hover:text-blue-400">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </>

    )
  // return(
  //   <>
  //     <form onSubmit={signIn}>
  //       <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
  //         <div className="px-4 py-5 sm:px-6 text-center">
  //           <h1 className="text-3xl font-bold tracking-tight text-gray-900">Login</h1>
  //         </div>
  //         <div className="px-4 py-5 sm:p-6">
  //           <div>
  //             <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
  //               Email
  //             </label>
  //             <div className="mt-2">
  //               <input
  //                 type="email"
  //                 name="email"
  //                 id="email"
  //                 value={email}
  //                 onChange={(e) => {setEmail(e.target.value)}}
  //                 className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 focus:ring-ambers-300 sm:text-sm sm:leading-6"
  //                 placeholder=" Email"
  //               />
  //             </div>
  //           </div>

  //           <div>
  //             <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
  //               Password
  //             </label>
  //             <div className="mt-2">
  //               <input
  //                 type="password"
  //                 name="password"
  //                 id="password"
  //                 value={pass}
  //                 onChange={(e) => {setPass(e.target.value)}}
  //                 className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-offset-0 focus:ring-blue-300 sm:text-sm sm:leading-6"
  //                 placeholder=" Password"
  //               />
  //             </div>
  //           </div>
  //         </div>
  //         <div className="px-4 py-4 sm:px-6 text-center">
  //         <button 
  //             type="submit"
  //             className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
  //           >
  //             Log In
  //           </button>
  //       </div>
  //     </div>
  //   </form>
  // </>
  //)
}

export default SignIn;