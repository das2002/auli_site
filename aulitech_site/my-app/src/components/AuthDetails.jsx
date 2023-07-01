import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";


const AuthDetails = () => {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if(user) {
                setAuthUser(user);
            } else {
                setAuthUser(null);
            }
        });

        // return removes listener
        return () => {
            listen();
        }
    }, []);


    const userSignOut = () => {
        signOut(auth).then(() => {
            console.log('signed out successfully');
        })
        .catch((error) => {
            console.log(error)
        })
    }
    return (
        <div className="auth-details-container">
                {authUser ? 
                    <>
                        <button onClick={userSignOut}>Sign Out</button>
                    </> 
                : 
                    null
                }
        </div>
    )
}

export default AuthDetails;