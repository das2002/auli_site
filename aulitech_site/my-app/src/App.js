import React from 'react';
import './App.css';
import AuthDetails from './components/GoogleAuth/AuthDetails';
import ConfigureCato from './components/ConfigureCato/Configure';

function App() {
  return (
    <div className="App">
      <div>
      <h1>AULI.TECH</h1>
      <AuthDetails/>
      <ConfigureCato/>
      </div>
    </div>
  );
}

export default App;
