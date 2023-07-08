import React from "react";
import SignInBtn from "./SignInBtn";
import SignedIn from "./SignedIn";

const NavAuth = ({user, handlePage}) => {
  return (
    <>
      <div className="flex items-center">
        {user !== null ?
          <SignedIn user={user}  handlePage={handlePage}/>
        :
          <SignInBtn user={user}  handlePage={handlePage}/>
        }
      </div>
    </>
  );
};

export default NavAuth;