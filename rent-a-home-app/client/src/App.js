import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Navigation from './components/Navigation';
import PegasusPage from './components/PegasusPage';

function App() {
  const [user, setUser] = useState(null); // To store the user's data

  return (
    <Router>
      <Navigation user={user} setUser={setUser} />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/pegasus" element={<PegasusPage />} />
      </Routes>
    </Router>
  );
}

export default App;
