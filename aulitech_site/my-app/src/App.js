import './App.css';
import { AuthUser } from './components/GoogleAuth/Authenticate';
import { TabGroup } from './components/Tabs/Tabs';

function App() {
  return (
    <div className="App">
      <AuthUser/>
    </div>
  );
}

export default App;
