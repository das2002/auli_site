import React from "react";
import SignInBtn from "../aulitech_site/my-app/src/components/NavBar/SignInBtn";
import ProfileDropdown from "../components/NavBar/ProfileDropdown";

const NavAuth = ({user}) => {
  return (
    <>
      <div className="flex items-center">
        {user !== null ?
          <ProfileDropdown user={user}/>
        :
          <SignInBtn user={user}/>
        }
      </div>
    </>
  );
};

export default NavAuth;