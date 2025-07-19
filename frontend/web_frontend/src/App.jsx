import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login/Login';
import Welcome from './pages/Welcome/Welcome';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>

          <Route path="/" element={<Login />} />
          <Route path="/welcome" element={<Welcome />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;