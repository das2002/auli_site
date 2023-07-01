import './App.css';
import AuthDetails from './components/AuthDetails';
import SignIn from './components/GoogleAuth/SignIn';
import SignUp from './components/GoogleAuth/SignUp';

function App() {
  return (
    <div className="App">
      <SignIn />
      <SignUp />
      <AuthDetails />
    </div>
  );
}

export default App;
