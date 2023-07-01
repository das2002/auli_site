import React, {useState} from 'react';
import './App.css';
import AuthDetails from './components/AuthDetails';
import SignIn from './components/GoogleAuth/SignIn';
import SignUp from './components/GoogleAuth/SignUp';
import { Navigate } from 'react-router-dom';
import AuthPg from './components/GoogleAuth/AuthPg';

function App() {
  const [doAuth, setDoAuth] = useState(false);
  return (
    <div className="App">
      <div>
      <h1>AULI.TECH</h1>
      <AuthDetails/>
      </div>
    </div>
  );
}

export default App;
