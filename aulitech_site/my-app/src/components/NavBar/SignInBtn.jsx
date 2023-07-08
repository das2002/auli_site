import React from "react";
import AuthPg from '../GoogleAuth/AuthPg'

const SignInBtn = ({user, handlePage}) => {

  return (
    <>
      <div className="flex-shrink-0">
        <button
          type="button"
          onClick={() => handlePage({thing: <AuthPg/>})}
          className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Sign In
        </button>
      </div>
    </>
  )
}

export default SignInBtn;