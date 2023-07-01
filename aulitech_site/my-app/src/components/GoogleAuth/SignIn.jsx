import React, { useState } from "react";
import { auth } from '../../firebase'
import { signInWithEmailAndPassword } from "firebase/auth";

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const signIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, pass)
            .then((userCredential) => {
                console.log(userCredential);
            }) 
            .catch((error) => {
                console.log(error);
            })
    }
    return(
        <div className="sign-in-container">
            <form onSubmit={signIn}>
                <h1>Log In</h1>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => {setEmail(e.target.value)}}
                ></input>
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={pass}
                    onChange={(e) => {setPass(e.target.value)}}
                ></input>
                <button type="submit">Log In</button>
            </form>
        </div>
    )
}

export default SignIn;