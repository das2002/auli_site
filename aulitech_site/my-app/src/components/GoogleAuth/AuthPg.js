import React, { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const AuthPg = () => {
    const [ register, setRegister ] = useState(false);
    const [showAuth, setSHowAuth] = useState(false);

    const handleRegister = () => {
        setRegister(!register);
    }

    return(
        <div>
            { register ? <SignUp/> : <SignIn/> }
            <p>{ register ? "Already have an account?" : "Dont have an account?" }</p>
            <>
            { register ?
                <button onClick={handleRegister} onKeyDown={() => {}}>Login</button>
            :
                <button onClick={handleRegister} onKeyDown={() => {}}>Create Account</button>
            }
            </>
        </div>
    )
}

export default AuthPg;