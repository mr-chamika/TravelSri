import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import './App.css';
import Login from './pages/Login/Login';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route path="/login" element={<Login />} /> */}

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;