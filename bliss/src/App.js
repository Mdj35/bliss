import logo from './logo.svg';
import './App.css';
import Login from "./pages/Login";
import UserPage from "./pages/Homepage";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

