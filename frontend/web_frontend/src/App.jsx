import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import './App.css';
import Login from './pages/Login/Login';
import Welcome from './pages/Welcome/Welcome';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>

          <Route path="/" element={<Login />} />
          <Route path="/welcome" element={<Welcome />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;