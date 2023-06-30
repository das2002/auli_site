import { React, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBP9Wu6bJaP1xZ3ia5PXaomwL9G-iET_zM",
  authDomain: "auli-website.firebaseapp.com",
  projectId: "auli-website",
  storageBucket: "auli-website.appspot.com",
  messagingSenderId: "532419651189",
  appId: "1:532419651189:web:f471f644f138c21dbeba3c",
  measurementId: "G-BRKYWEXKHQ"
  };

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const authHandlers = {
    signup: async(email, pass) => {
        await createUserWithEmailAndPassword(auth, email, pass)
    },
    login: async(email, pass) => {
        await signInWithEmailAndPassword(auth, email, pass)
    },
    logout: async() => {
        await signOut(auth);
    }
}

export function AuthUser() {    
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const [authenticating, setAuthenticating] = useState(false);
    const [register, setRegister] = useState(false);
    const [error, setError] = useState(false);

    /*const [dataToSetToStore, setDataToSetToStore] = useState({});
    const [userStore, setUserStore] = useState(null);
    const [loadStore, setLoadStore] = useState(true);
    const [dataStore, setDataStore] = useState({});*/

    /*const authStore = {
        user: userStore,
        loading: loadStore,
        data: dataStore
    }*/
    const user = auth.currentUser;
    
    const reset = () => {
        setEmail('');
        setPass('');
        setConfirmPass('');
        setAuthenticating(false);
        setRegister(false);
        setError(false);
    }

    async function handleAuth() {
        if (authenticating) {
            return;
        }
        if(!email || !password || (register && !confirmPass)) {
            setError(true);
            return;
        }

        setAuthenticating(true);
        try {
            if (!register) {
                    await createUserWithEmailAndPassword(auth, email, password)
            } else {
                await authHandlers.signup(email, password)
            }
            //reset();
        }  catch(err) {
            console.log('auth error occured',  err)
            setError(true);
        }
    }

    function handleRegister() {
        setRegister(!register);
    }

    /*async function userExists() {
        
        onAuthStateChanged(auth, (user) => {
            const docRef = doc(db, "users", user.uid);
            const docSnap = getDoc(docRef);
            docSnap();

            if (user !== null) {
              const uid = user.uid;
              if (!docSnap.exists()) {
                const userRef = doc(db, "user", uid);

                if(user.uid !== null) {
                    setDataToSetToStore({
                        email: user.email,
                        password: user.password,
                        uid: user.uid,
                        firstName: first,
                        lastName: last
                    });
    
                    const doSetDoc = async() => {await setDoc(userRef, dataToSetToStore, {merge: true})}
                    doSetDoc();
                }
              }
            } else {
              console.log("no user")
            }
          });
    }*/

    //console.log(auth.currentUser);
    return (
        <div>
            <form>
                <h1>{register ? "Register" : "Login"}</h1>
                <p>{error ? "Email or password is incorrect." : null}</p>
                <label>
                    <input
                        value={email}
                        type="text"
                        placeholder="Email"
                        onChange={(e) => {setEmail(e.target.value)}}
                    />
                </label>
                <label>
                    <input
                        value={password}
                        type="text"
                        placeholder="Password"
                        onChange={(e) => {setPass(e.target.value)}}
                    />
                </label>
                {register ? 
                <div>
                    <label>
                        <input
                            value={confirmPass}
                            type="text"
                            placeholder="Confirm Password"
                            onChange={(e) => {setConfirmPass(e.target.value)}}
                        />
                    </label>
                </div>               
                : null}
                <button onClick={handleAuth}>
                    {authenticating ? 'loading...' : 'Submit'}
                </button>
            </form>
            <br/>
            <div>
                {register ? 
                <div>
                    <p>Already have an account?</p>
                    <button onClick={handleRegister}>Login</button>
                </div>
                :
                <div>
                    <p>Don't have an account?</p>
                    <button onClick={handleRegister}>Register</button>
                </div>}
            </div>
        </div>
    );

};