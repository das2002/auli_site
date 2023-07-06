import React from "react";
import SignInBtn from "./SignInBtn";
import SignedIn from "./SignedIn";

const NavAuth = ({user, handlePage}) => {
  
  return (
    <>
      <div className="flex items-center">
        {user !== 'undefined' ?
          <SignedIn user={user}  handlePage={handlePage}/>
        :
          <SignInBtn/>
        }
      </div>
    </>
  );
};

export default NavAuth;

/* 
            
*/