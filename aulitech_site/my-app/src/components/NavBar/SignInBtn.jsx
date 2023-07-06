import React from "react";

const SignInBtn = ({user, handlePage}) => {

  return (
    <>
      <div className="flex-shrink-0">
        <button
          type="button"
          onClick={() => handlePage('AuthPg')}
          className="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Sign In
        </button>
      </div>
    </>
  )
}

export default SignInBtn;