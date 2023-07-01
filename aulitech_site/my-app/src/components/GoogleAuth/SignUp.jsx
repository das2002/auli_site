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
        <div className="sign-up-container">
            <form onSubmit={signUp}>
                <h1>Register Account</h1>
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
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default SignUp;